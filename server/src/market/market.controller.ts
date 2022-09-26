import { Controller, Post, Body } from "@nestjs/common";
import { MarketService } from "./market.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { CancelListingDto } from "./dto/cancel-listing.dto";
import { FindAllDto } from "./dto/find-all.dto";
import { ApiTags } from "@nestjs/swagger";
// import { WebsocketExceptionsFilter } from "@api/common/ws-error.filter";

@ApiTags("market")
@Controller("market")
// @UseFilters(new WebsocketExceptionsFilter())
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post("/createListing")
  createListing(@Body() createListingDto: CreateListingDto) {
    return this.marketService.createListing(createListingDto);
  }

  @Post("/findAll")
  findAll(@Body() findAllDto: FindAllDto) {
    return this.marketService.findAll(findAllDto);
  }

  @Post("/cancelListing")
  cancelListing(@Body() cancelListingDto: CancelListingDto) {
    return this.marketService.cancelListing(cancelListingDto);
  }
}
