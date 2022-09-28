import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateListingDto } from "./dto/create-listing.dto";
import { CancelListingDto } from "./dto/cancel-listing.dto";
import { FindListingsDto } from "./dto/find-listings.dto";

import {
  MarketListing,
  MarketListingDocument,
} from "./schemas/market-listing.schema";

import { User, UserDocument } from "./schemas/user.schema";
import { ChainService } from "../chain/chain.service";

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(MarketListing.name)
    private marketListingModel: Model<MarketListingDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly chainService: ChainService,
  ) {
    this.chainService.ethersProvider
      .getBlockNumber()
      .then((startBlockNumber) => {
        this.watchNFTMintedEvent(startBlockNumber);
        this.watchFrontTransferEvent(startBlockNumber);
      })
      .catch((err) => {
        console.error(err.message);
        throw new Error("Error while running marketplace listeners");
      });
  }

  watchNFTMintedEvent(startBlockNumber: number) {
    console.info("watching NFT minted events...");

    this.chainService.erc721Contract.on(
      "NFTMinted",
      async (
        requester: string,
        quantity: number,
        lastTokenId: number,
        _event,
      ) => {
        if (_event.blockNumber <= startBlockNumber) return;

        console.info(
          `-- NFTMinted - requester ${requester}, quantity ${quantity}, lastTokenId ${lastTokenId}`,
        );

        const user = await this.getUser(requester);

        const newTokenIds = [];

        let currentTokenId = lastTokenId;
        for (let i = 0; i < quantity; i++) {
          newTokenIds.push(currentTokenId);
          currentTokenId--;
        }

        // Keep track of the tokenIds owner by the user
        await this.userModel.findOneAndUpdate(
          { userAddress: user.userAddress },
          { $push: { tokenIds: { $each: newTokenIds } } },
        );
      },
    );
  }

  watchFrontTransferEvent(startBlockNumber: number) {
    console.info("watching front NFTs tranfer events...");

    this.chainService.erc721Contract.on(
      "Transfer",
      async (from, to, tokenId, _event) => {
        if (_event.blockNumber <= startBlockNumber) return;

        console.info(
          `-- Transfer - tokenId ${tokenId}, from ${from}, to ${to}`,
        );

        const previousOwner = await this.getUser(from);
        const newOwner = await this.getUser(to);

        // Remove token from sender
        await this.userModel.updateOne(
          { userAddress: previousOwner.userAddress },
          {
            $pullAll: {
              tokenIds: [tokenId],
            },
          },
        );

        // Add token to new owner
        await this.userModel.findOneAndUpdate(
          { userAddress: newOwner.userAddress },
          { $push: { tokenIds: tokenId } },
        );
      },
    );
  }

  async createListing(createListingDto: CreateListingDto) {
    // recover address from signature
    const sellerAddress = await this.chainService.recoverAddress(
      createListingDto.signature,
      String(createListingDto.tokenId),
    );

    if (sellerAddress !== createListingDto.userAddress) {
      throw new Error("Invalid signature.");
    }

    const tokenOwner = await this.chainService.ownerOfFront(
      createListingDto.tokenId,
    );

    if (tokenOwner !== createListingDto.userAddress) {
      throw new Error("Invalid token owner.");
    }

    try {
      const listing = new this.marketListingModel({
        tokenId: createListingDto.tokenId,
        sellerAddress: createListingDto.userAddress,
        price: createListingDto.price,
        order: createListingDto.order,
        active: true,
      });

      await listing.save();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findListings(findListingsDto: FindListingsDto) {
    try {
      const { page = 1, limit = 10 } = findListingsDto;

      const foundListedTokens = await this.marketListingModel
        .findOne({ active: true })
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .exec();

      return foundListedTokens;
    } catch (err) {
      throw new Error(err);
    }
  }

  async cancelListing(cancelListingDto: CancelListingDto) {
    // recover address from signature
    const sellerAddress = await this.chainService.recoverAddress(
      cancelListingDto.signature,
      String(cancelListingDto.tokenId),
    );

    if (sellerAddress !== cancelListingDto.userAddress) {
      throw new Error("Invalid signature.");
    }

    try {
      await this.marketListingModel.findOneAndUpdate(
        { userAddress: cancelListingDto.userAddress },
        {
          $set: { active: false },
        },
        {
          new: true,
        },
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUserNFTs(userAddress: string): Promise<string[]> {
    try {
      const nftsWithMetadata = [];

      const nfts = await this.getUser(userAddress);

      for (const tokenId of nfts.tokenIds) {
        const tokenURI = await this.chainService.getTokenURI(tokenId);

        nftsWithMetadata.push(tokenURI);
      }

      return nftsWithMetadata;
    } catch (err) {
      throw new Error(err);
    }
  }

  private async getUser(userAddress: string) {
    try {
      let user = await this.userModel.findOne({ userAddress }).exec();

      if (!user) {
        const newUser = new this.userModel({
          userAddress,
          tokenIds: [],
        });

        await newUser.save();

        user = newUser;
      }

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}
