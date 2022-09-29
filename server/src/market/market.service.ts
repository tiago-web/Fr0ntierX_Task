import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateListingDto } from "./dto/create-listing.dto";

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
          { tokenId: tokenId, active: true },
          {
            $set: { active: false },
          },
        );
      },
    );
  }

  async createListing(createListingDto: CreateListingDto) {
    const tokenOwner = await this.chainService.ownerOfFront(
      createListingDto.tokenId,
    );

    if (tokenOwner !== createListingDto.userAddress) {
      throw new Error("Invalid token owner.");
    }

    const foundListing = await this.marketListingModel
      .findOne({ tokenId: createListingDto.tokenId, active: true })
      .exec();

    if (foundListing !== null) {
      throw new Error("Token already listed");
    }

    const listing = new this.marketListingModel({
      tokenId: createListingDto.tokenId,
      sellerAddress: createListingDto.userAddress,
      price: createListingDto.price,
      sellerSignature: createListingDto.signature,
      order: createListingDto.order,
      active: true,
    });

    await listing.save();
  }

  async findListings() {
    const foundListedTokens = await this.marketListingModel
      .find({ active: true })
      .exec();

    const tokens = [];

    for (const listedToken of foundListedTokens) {
      const tokenURI = await this.chainService.getTokenURI(listedToken.tokenId);

      tokens.push({
        tokenURI,
        price: listedToken.price,
        tokenId: listedToken.tokenId,
        orderOne: listedToken.order,
        sigOne: listedToken.sellerSignature,
        sellerAddress: listedToken.sellerAddress,
      });
    }

    return tokens;
  }

  async findUserNFTs(userAddress: string): Promise<string[]> {
    const tokens = [];

    const { tokenIds } = await this.getUser(userAddress);

    for (const tokenId of tokenIds) {
      const tokenURI = await this.chainService.getTokenURI(tokenId);

      const foundListing = await this.marketListingModel
        .findOne({
          tokenId,
          active: true,
        })
        .exec();

      tokens.push({ tokenURI, tokenId, isListed: foundListing !== null });
    }

    return tokens;
  }

  private async getUser(userAddress: string) {
    let user = await this.userModel.findOne({ userAddress }).exec();

    if (user === null) {
      // Create new user if it doesn't exist
      const newUser = new this.userModel({
        userAddress,
        tokenIds: [],
      });

      await newUser.save();

      user = newUser;
    }

    return user;
  }
}
