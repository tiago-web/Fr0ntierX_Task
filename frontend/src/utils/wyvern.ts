import Web3 from "web3";
let web3 = new Web3(window?.web3.currentProvider);

const eip712Domain = {
  name: "EIP712Domain",
  fields: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
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

web3 = web3.extend({
  methods: [
    {
      name: "signTypedData",
      call: "eth_signTypedData",
      params: 2,
      // @ts-ignore
      inputFormatter: [web3.extend.formatters.inputAddressFormatter, null],
    },
  ],
});

const structToSign = (order: any, exchange: any) => {
  return {
    name: eip712Order.name,
    fields: eip712Order.fields,
    domain: {
      name: "Wyvern Exchange",
      version: "3.1",
      chainId: 50,
      verifyingContract: exchange,
    },
    data: order,
  };
};

const parseSig = (bytes: any) => {
  bytes = bytes.substr(2);
  const r = "0x" + bytes.slice(0, 64);
  const s = "0x" + bytes.slice(64, 128);
  const v = parseInt("0x" + bytes.slice(128, 130), 16);
  return { v, r, s };
};

const wrap = (inst: any) => {
  var obj = {
    inst: inst,
    atomicMatchWith: (
      order: any,
      sig: any,
      call: any,
      counterorder: any,
      countersig: any,
      countercall: any,
      metadata: any,
      misc: any
    ) =>
      inst.atomicMatch_(
        [
          order.registry,
          order.maker,
          order.staticTarget,
          order.maximumFill,
          order.listingTime,
          order.expirationTime,
          order.salt,
          call.target,
          counterorder.registry,
          counterorder.maker,
          counterorder.staticTarget,
          counterorder.maximumFill,
          counterorder.listingTime,
          counterorder.expirationTime,
          counterorder.salt,
          countercall.target,
        ],
        [order.staticSelector, counterorder.staticSelector],
        order.staticExtradata,
        call.data,
        counterorder.staticExtradata,
        countercall.data,
        [call.howToCall, countercall.howToCall],
        metadata,
        web3.eth.abi.encodeParameters(
          ["bytes", "bytes"],
          [
            web3.eth.abi.encodeParameters(
              ["uint8", "bytes32", "bytes32"],
              [sig.v, sig.r, sig.s]
            ) + (sig.suffix || ""),
            web3.eth.abi.encodeParameters(
              ["uint8", "bytes32", "bytes32"],
              [countersig.v, countersig.r, countersig.s]
            ) + (countersig.suffix || ""),
          ]
        ),
        misc
      ),

    sign: (order: any, account: any) => {},
  };
  obj.sign = (order: any, account: any): any => {
    const str = structToSign(order, inst.address);
    return (
      web3
        // @ts-ignore
        .signTypedData(account, {
          types: {
            EIP712Domain: eip712Domain.fields,
            Order: eip712Order.fields,
          },
          domain: str.domain,
          primaryType: "Order",
          message: order,
        })
        .then((sigBytes: any) => {
          const sig = parseSig(sigBytes);
          return sig;
        })
    );
  };

  return obj;
};

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export { wrap, ZERO_BYTES32 };
