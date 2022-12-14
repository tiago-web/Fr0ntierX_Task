/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Front, FrontInterface } from "../../contracts/Front";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "customBaseURI_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ApprovalCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "ApprovalQueryForNonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceQueryForZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "Front__InvalidQuantity",
    type: "error",
  },
  {
    inputs: [],
    name: "MintERC2309QuantityExceedsLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "MintToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "MintZeroQuantity",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnerQueryForNonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnershipNotInitializedForExtraData",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromIncorrectOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToNonERC721ReceiverImplementer",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "URIQueryForNonexistentToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toTokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "ConsecutiveTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lastTokenId",
        type: "uint256",
      },
    ],
    name: "NFTMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "ipfsHashes",
        type: "string[]",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "newBaseURI",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620016cc380380620016cc8339810160408190526200003491620001b9565b6040805180820182526005815264119c9bdb9d60da1b60208083019182528351808501909452600384526211949560ea1b9084015281519192916200007c9160029162000113565b5080516200009290600390602084019062000113565b50506000805550620000a433620000c1565b8051620000b990600990602084019062000113565b5050620002e2565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b82805462000121906200028f565b90600052602060002090601f01602090048101928262000145576000855562000190565b82601f106200016057805160ff191683800117855562000190565b8280016001018555821562000190579182015b828111156200019057825182559160200191906001019062000173565b506200019e929150620001a2565b5090565b5b808211156200019e5760008155600101620001a3565b60006020808385031215620001cc578182fd5b82516001600160401b0380821115620001e3578384fd5b818501915085601f830112620001f7578384fd5b8151818111156200020c576200020c620002cc565b604051601f8201601f19908116603f01168101908382118183101715620002375762000237620002cc565b8160405282815288868487010111156200024f578687fd5b8693505b8284101562000272578484018601518185018701529285019262000253565b828411156200028357868684830101525b98975050505050505050565b600181811c90821680620002a457607f821691505b60208210811415620002c657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b6113da80620002f26000396000f3fe6080604052600436106100e45760003560e01c806301ffc9a7146100e957806306fdde031461011e578063081812fc14610140578063095ea7b31461017857806318160ddd1461018d57806323b872dd146101b057806342842e0e146101c357806355f804b3146101d65780636352211e146101f657806370a0823114610216578063715018a6146102365780638a1bbf861461024b5780638da5cb5b1461025e57806395d89b4114610273578063a22cb46514610288578063b88d4fde146102a8578063c87b56dd146102bb578063e985e9c5146102db578063f2fde38b14610324575b600080fd5b3480156100f557600080fd5b50610109610104366004610fff565b610344565b60405190151581526020015b60405180910390f35b34801561012a57600080fd5b50610133610396565b6040516101159190611266565b34801561014c57600080fd5b5061016061015b366004611069565b610428565b6040516001600160a01b039091168152602001610115565b61018b610186366004610fd6565b61046c565b005b34801561019957600080fd5b50600154600054035b604051908152602001610115565b61018b6101be366004610ee9565b61050c565b61018b6101d1366004610ee9565b61068b565b3480156101e257600080fd5b5061018b6101f1366004611037565b6106ab565b34801561020257600080fd5b50610160610211366004611069565b6106ca565b34801561022257600080fd5b506101a2610231366004610e9d565b6106d5565b34801561024257600080fd5b5061018b610723565b61018b610259366004611081565b610737565b34801561026a57600080fd5b5061016061085b565b34801561027f57600080fd5b5061013361086a565b34801561029457600080fd5b5061018b6102a3366004610f9c565b610879565b61018b6102b6366004610f24565b6108e5565b3480156102c757600080fd5b506101336102d6366004611069565b61092f565b3480156102e757600080fd5b506101096102f6366004610eb7565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b34801561033057600080fd5b5061018b61033f366004610e9d565b6109be565b60006301ffc9a760e01b6001600160e01b03198316148061037557506380ac58cd60e01b6001600160e01b03198316145b806103905750635b5e139f60e01b6001600160e01b03198316145b92915050565b6060600280546103a5906112ec565b80601f01602080910402602001604051908101604052809291908181526020018280546103d1906112ec565b801561041e5780601f106103f35761010080835404028352916020019161041e565b820191906000526020600020905b81548152906001019060200180831161040157829003601f168201915b5050505050905090565b600061043382610a3c565b610450576040516333d1c03960e21b815260040160405180910390fd5b506000908152600660205260409020546001600160a01b031690565b6000610477826106ca565b9050336001600160a01b038216146104b05761049381336102f6565b6104b0576040516367d9dca160e11b815260040160405180910390fd5b60008281526006602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b600061051782610a63565b9050836001600160a01b0316816001600160a01b03161461054a5760405162a1148160e81b815260040160405180910390fd5b60008281526006602052604090208054338082146001600160a01b038816909114176105975761057a86336102f6565b61059757604051632ce44b5f60e11b815260040160405180910390fd5b6001600160a01b0385166105be57604051633a954ecd60e21b815260040160405180910390fd5b80156105c957600082555b6001600160a01b0386811660009081526005602052604080822080546000190190559187168152208054600101905561060685600160e11b610ac4565b600085815260046020526040902055600160e11b831661065457600184016000818152600460205260409020546106525760005481146106525760008181526004602052604090208490555b505b83856001600160a01b0316876001600160a01b031660008051602061138583398151915260405160405180910390a4505050505050565b6106a6838383604051806020016040528060008152506108e5565b505050565b6106b3610ad9565b80516106c6906009906020840190610d72565b5050565b600061039082610a63565b60006001600160a01b0382166106fe576040516323d3ad8160e21b815260040160405180910390fd5b506001600160a01b03166000908152600560205260409020546001600160401b031690565b61072b610ad9565b6107356000610b38565b565b60058151111561075a57604051639b50b5ff60e01b815260040160405180910390fd5b8181511461077b57604051639b50b5ff60e01b815260040160405180910390fd5b60008054905b82518110156107eb578281815181106107aa57634e487b7160e01b600052603260045260246000fd5b6020026020010151600a600084815260200190815260200160002090805190602001906107d8929190610d72565b50806107e381611327565b915050610781565b506107f63384610b8a565b7f3a8a89b59a31c39a36febecb987e0657ab7b7c73b60ebacb44dcb9886c2d5c8a3384600161082460005490565b61082e91906112a9565b604080516001600160a01b03909416845260208401929092529082015260600160405180910390a1505050565b6008546001600160a01b031690565b6060600380546103a5906112ec565b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6108f084848461050c565b6001600160a01b0383163b156109295761090c84848484610c6b565b610929576040516368d2bf6b60e11b815260040160405180910390fd5b50505050565b606061093a82610a3c565b61095757604051630a14c4b560e41b815260040160405180910390fd5b6000610961610d63565b905080516000141561098257604051806020016040528060008152506109b7565b80600a60008581526020019081526020016000206040516020016109a792919061117a565b6040516020818303038152906040525b9392505050565b6109c6610ad9565b6001600160a01b038116610a305760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b610a3981610b38565b50565b6000805482108015610390575050600090815260046020526040902054600160e01b161590565b600081600054811015610aab57600081815260046020526040902054600160e01b8116610aa9575b806109b7575060001901600081815260046020526040902054610a8b565b505b604051636f96cda160e11b815260040160405180910390fd5b4260a01b176001600160a01b03919091161790565b33610ae261085b565b6001600160a01b0316146107355760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610a27565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60005481610bab5760405163b562e8dd60e01b815260040160405180910390fd5b6001600160a01b038316600090815260056020526040902080546001600160401b018402019055610be2836001841460e11b610ac4565b6000828152600460205260408120919091556001600160a01b0384169083830190839083906000805160206113858339815191528180a4600183015b818114610c445780836000600080516020611385833981519152600080a4600101610c1e565b5081610c6257604051622e076360e81b815260040160405180910390fd5b60005550505050565b604051630a85bd0160e11b81526000906001600160a01b0385169063150b7a0290610ca0903390899088908890600401611229565b602060405180830381600087803b158015610cba57600080fd5b505af1925050508015610cea575060408051601f3d908101601f19168201909252610ce79181019061101b565b60015b610d45573d808015610d18576040519150601f19603f3d011682016040523d82523d6000602084013e610d1d565b606091505b508051610d3d576040516368d2bf6b60e11b815260040160405180910390fd5b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b949350505050565b6060600980546103a5906112ec565b828054610d7e906112ec565b90600052602060002090601f016020900481019282610da05760008555610de6565b82601f10610db957805160ff1916838001178555610de6565b82800160010185558215610de6579182015b82811115610de6578251825591602001919060010190610dcb565b50610df2929150610df6565b5090565b5b80821115610df25760008155600101610df7565b60006001600160401b03831115610e2457610e24611358565b610e37601f8401601f1916602001611279565b9050828152838383011115610e4b57600080fd5b828260208301376000602084830101529392505050565b80356001600160a01b0381168114610e7957600080fd5b919050565b600082601f830112610e8e578081fd5b6109b783833560208501610e0b565b600060208284031215610eae578081fd5b6109b782610e62565b60008060408385031215610ec9578081fd5b610ed283610e62565b9150610ee060208401610e62565b90509250929050565b600080600060608486031215610efd578081fd5b610f0684610e62565b9250610f1460208501610e62565b9150604084013590509250925092565b60008060008060808587031215610f39578081fd5b610f4285610e62565b9350610f5060208601610e62565b92506040850135915060608501356001600160401b03811115610f71578182fd5b8501601f81018713610f81578182fd5b610f9087823560208401610e0b565b91505092959194509250565b60008060408385031215610fae578182fd5b610fb783610e62565b915060208301358015158114610fcb578182fd5b809150509250929050565b60008060408385031215610fe8578182fd5b610ff183610e62565b946020939093013593505050565b600060208284031215611010578081fd5b81356109b78161136e565b60006020828403121561102c578081fd5b81516109b78161136e565b600060208284031215611048578081fd5b81356001600160401b0381111561105d578182fd5b610d5b84828501610e7e565b60006020828403121561107a578081fd5b5035919050565b60008060408385031215611093578182fd5b823591506020808401356001600160401b03808211156110b1578384fd5b818601915086601f8301126110c4578384fd5b8135818111156110d6576110d6611358565b8060051b6110e5858201611279565b8281528581019085870183870188018c10156110ff578889fd5b8893505b8484101561113c5780358681111561111957898afd5b6111278d8a838b0101610e7e565b84525060019390930192918701918701611103565b50809750505050505050509250929050565b600081518084526111668160208601602086016112c0565b601f01601f19169290920160200192915050565b60008351602061118d82858389016112c0565b8454918401918390600181811c90808316806111aa57607f831692505b8583108114156111c857634e487b7160e01b88526022600452602488fd5b8080156111dc57600181146111ed57611219565b60ff19851688528388019550611219565b60008b815260209020895b858110156112115781548a8201529084019088016111f8565b505083880195505b50939a9950505050505050505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061125c9083018461114e565b9695505050505050565b6020815260006109b7602083018461114e565b604051601f8201601f191681016001600160401b03811182821017156112a1576112a1611358565b604052919050565b6000828210156112bb576112bb611342565b500390565b60005b838110156112db5781810151838201526020016112c3565b838111156109295750506000910152565b600181811c9082168061130057607f821691505b6020821081141561132157634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561133b5761133b611342565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b031981168114610a3957600080fdfeddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa264697066735822122009c6c9746fd8519faca8cc3e4bbfac0916dfa430097a5a922483acb41be2e98864736f6c63430008040033";

type FrontConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FrontConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Front__factory extends ContractFactory {
  constructor(...args: FrontConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    customBaseURI_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Front> {
    return super.deploy(customBaseURI_, overrides || {}) as Promise<Front>;
  }
  override getDeployTransaction(
    customBaseURI_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(customBaseURI_, overrides || {});
  }
  override attach(address: string): Front {
    return super.attach(address) as Front;
  }
  override connect(signer: Signer): Front__factory {
    return super.connect(signer) as Front__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FrontInterface {
    return new utils.Interface(_abi) as FrontInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Front {
    return new Contract(address, _abi, signerOrProvider) as Front;
  }
}
