import { Controller, Post, Body, Param, Get } from "@nestjs/common";
import { MarketService } from "./market.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { CancelListingDto } from "./dto/cancel-listing.dto";
import { FindListingsDto } from "./dto/find-listings.dto";
import { ApiTags } from "@nestjs/swagger";
// import { WebsocketExceptionsFilter } from "@api/common/ws-error.filter";

@ApiTags("market")
@Controller("market")
// @UseFilters(new WebsocketExceptionsFilter())
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post("/create-listing")
  createListing(@Body() createListingDto: CreateListingDto) {
    return this.marketService.createListing(createListingDto);
  }

  @Post("/find-listings")
  findAll(@Body() findListings: FindListingsDto) {
    return this.marketService.findListings(findListings);
  }

  @Post("/cancel-listing")
  cancelListing(@Body() cancelListingDto: CancelListingDto) {
    return this.marketService.cancelListing(cancelListingDto);
  }

  @Get("/find-user-nfts/:address")
  findMyNFTs(@Param("address") address: string) {
    return this.marketService.findUserNFTs(address);
  }
}
