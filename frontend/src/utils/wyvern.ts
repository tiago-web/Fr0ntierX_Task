import { blockchainParams } from "../chain/config";
import { OrderProps } from "../hooks/useMarket";

const parseSig = (bytes: string) => {
  bytes = bytes.substr(2);
  const r = "0x" + bytes.slice(0, 64);
  const s = "0x" + bytes.slice(64, 128);
  const v = parseInt("0x" + bytes.slice(128, 130), 16);
  return { v, r, s };
};

const eip712Order = {
  name: "Order",
  fields: [
    { name: "registry", type: "address" },
    { name: "maker", type: "address" },
    { name: "staticTarget", type: "address" },
    { name: "staticSelector", type: "bytes4" },
    { name: "staticExtradata", type: "bytes" },
    { name: "maximumFill", type: "uint256" },
    { name: "listingTime", type: "uint256" },
    { name: "expirationTime", type: "uint256" },
    { name: "salt", type: "uint256" },
  ],
};

const structToSign = (order: OrderProps, exchange: string) => {
  return {
    name: eip712Order.name,
    fields: eip712Order.fields,
    domain: {
      name: "Wyvern Exchange",
      version: "3.1",
      chainId: blockchainParams.chainId,
      verifyingContract: exchange,
    },
    data: order,
  };
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
export { parseSig, eip712Order, structToSign, ZERO_BYTES32, ZERO_ADDRESS };
