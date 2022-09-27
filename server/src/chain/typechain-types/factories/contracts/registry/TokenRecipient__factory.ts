/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  TokenRecipient,
  TokenRecipientInterface,
} from "../../../contracts/registry/TokenRecipient";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ReceivedEther",
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
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "extraData",
        type: "bytes",
      },
    ],
    name: "ReceivedTokens",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "extraData",
        type: "bytes",
      },
    ],
    name: "receiveApproval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506102ee806100206000396000f3fe60806040526004361061001e5760003560e01c80638f4ffcb114610056575b60408051348152905133917fa419615bc8fda4c87663805ee2a3597a6d71c1d476911d9892f340d965bc7bf1919081900360200190a2005b34801561006257600080fd5b506101266004803603608081101561007957600080fd5b6001600160a01b038235811692602081013592604082013590921691810190608081016060820135600160201b8111156100b257600080fd5b8201836020820111156100c457600080fd5b803590602001918460018302840111600160201b831117156100e557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610128945050505050565b005b604080516323b872dd60e01b81526001600160a01b03868116600483015230602483015260448201869052915184928316916323b872dd9160648083019260209291908290030181600087803b15801561018157600080fd5b505af1158015610195573d6000803e3d6000fd5b505050506040513d60208110156101ab57600080fd5b50516101fc576040805162461bcd60e51b815260206004820152601b60248201527a115490cc8c081d1bdad95b881d1c985b9cd9995c8819985a5b1959602a1b604482015290519081900360640190fd5b826001600160a01b0316856001600160a01b03167fd65b48fd35864b3528d38e44760be5553248f89bf3ff6b06cca57817cc2650bf86856040518083815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561027657818101518382015260200161025e565b50505050905090810190601f1680156102a35780820380516001836020036101000a031916815260200191505b50935050505060405180910390a3505050505056fea264697066735822122069dadb4fbd80cbaca7f4dacfbac7a2d4fa11cc4e11a3d4241bd278c32731c53364736f6c63430007050033";

type TokenRecipientConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenRecipientConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenRecipient__factory extends ContractFactory {
  constructor(...args: TokenRecipientConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TokenRecipient> {
    return super.deploy(overrides || {}) as Promise<TokenRecipient>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TokenRecipient {
    return super.attach(address) as TokenRecipient;
  }
  override connect(signer: Signer): TokenRecipient__factory {
    return super.connect(signer) as TokenRecipient__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenRecipientInterface {
    return new utils.Interface(_abi) as TokenRecipientInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenRecipient {
    return new Contract(address, _abi, signerOrProvider) as TokenRecipient;
  }
}
