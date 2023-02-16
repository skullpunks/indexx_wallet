import { Box, Button, HStack, Img, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { getWeb3 } from "../api/Transaction";
function AssetTemplate(props) {
  let userAddress = props?.userAddress;
  let assetName = props?.asset?.name;
  let chain = props?.chain;
  const [balance, setBalance] = useState("fetching Balance..");
  // const [erc20URL, setErc20URL] = useState("");
  let smartContractAddress;
  if (chain === "bitcoin" || chain === "bitcoinTestNet") {
    smartContractAddress = props?.asset?.address;

  } else {
    smartContractAddress = props?.asset?.address;

    async function getBalance() {
      if (!userAddress) return 0;
      let web3 = await getWeb3(chain);

      if (!web3) return 0;
      var contract = new web3.eth.Contract(ERC20ABI, smartContractAddress);
      let _bal = await contract.methods.balanceOf(userAddress).call();
      _bal = (parseInt(_bal) / 10 ** 18);
      setBalance(_bal);
      return _bal;
    }

    useEffect(() => {
      getBalance();
    }, [props]);
  }
  const openERC20URL = () => {
    let erc20URL = '';
    if (String(chain).localeCompare("mainnet") === 0) {
      erc20URL = ("https://etherscan.io/token/" + smartContractAddress + "?a=" + userAddress);
    } else if (String(chain).localeCompare("goerli") === 0) {
      erc20URL = ("https://goerli.etherscan.io/token/" + smartContractAddress + "?a=" + userAddress);
    } else if (String(chain).localeCompare("bscMainNet") === 0) {
      erc20URL = ("https://bscscan.com/token/" + smartContractAddress + "?a=" + userAddress);
    } else if (String(chain).localeCompare("bscTestNet") === 0) {
      erc20URL = ("https://testnet.bscscan.com/token/" + smartContractAddress + "?a=" + userAddress);
    }
    window.open(erc20URL)
  }
  return (
    <HStack
      key={"asset" + smartContractAddress}
      width={"40vw"}
      borderRadius={"5px"}
      bg={"white"}
      color={"black"}
      spacing={10}
      padding={"15px"}
      justify={"space-between"}
    >
      {/* <Box bg={"black"} color={"white"}
        borderRadius={"50%"} padding={"10px"} boxShadow={"0 0 1px #eaf0f5;"}
      >
        {assetName}
      </Box> */}
      <Img
        height={"50px"}
        width={"50px"}
        src={`./${assetName}.PNG`}
      />
      <Text>{balance} {assetName}</Text>

      <Button onClick={() => openERC20URL()} colorScheme={"blue"}>
        View Details
      </Button>
    </HStack>
  );
}

export default AssetTemplate;
let ERC20ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
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
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
