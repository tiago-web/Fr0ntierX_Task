import { OrderApprovedEventObject } from "src/chain/typechain-types/contracts/WyvernExchange";

export interface IOrder
  extends Omit<
    OrderApprovedEventObject,
    | "maximumFill"
    | "listingTime"
    | "expirationTime"
    | "salt"
    | "orderbookInclusionDesired"
    | "hash"
  > {
  maximumFill: number;
  listingTime: string;
  expirationTime: string;
  salt: string;
}
