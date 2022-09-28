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
import { BigNumber } from "ethers";

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
        this.watchFrontTransferEvent(startBlockNumber);
      })
      .catch((err) => {
        console.error(err.message);
        throw new Error("Error while running marketplace listeners");
      });
  }

  watchFrontTransferEvent(startBlockNumber: number) {
    console.info("watching front NFTs tranfer events...");

    this.chainService.erc721Contract.on(
      "Transfer",
      async (from, to, _tokenId: BigNumber, _event) => {
        if (_event.blockNumber <= startBlockNumber) return;

        const tokenId = _tokenId.toNumber();

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

        // Deactivate token listing
        await this.marketListingModel.updateOne(
          { tokenId: tokenId },
          {
            $set: { active: false },
          },
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
        .find({ active: true })
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .exec();

      const tokens = [];

      for (const listedToken of foundListedTokens) {
        const tokenURI = await this.chainService.getTokenURI(
          listedToken.tokenId,
        );

        tokens.push({
          tokenURI,
          price: listedToken.price,
          tokenId: listedToken.tokenId,
        });
      }

      return tokens;
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
      const tokens = [];

      const nfts = await this.getUser(userAddress);

      for (const tokenId of nfts.tokenIds) {
        const tokenURI = await this.chainService.getTokenURI(tokenId);

        tokens.push({ tokenURI, tokenId });
      }

      return tokens;
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
