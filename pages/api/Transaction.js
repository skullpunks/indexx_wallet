const { Alchemy } = require("alchemy-sdk");
const { alchemyApps } = require("./data");
import Web3 from "web3";
import { providers } from "./data";
import axios from "axios";
export async function getTransactions(network, address, setter) {
  const config = alchemyApps[network];
  if (network === "bscTestNet" || network === "bscMainNet") {
  } else if (network === "bitcoin" || network === "bitcoinTestNet") {

  }
  else {
    const alchemy = new Alchemy(config);

    const to_trxs = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
    });
    const from_trxs = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
    });
    let arr = [...to_trxs.transfers];
    arr.concat({ ...from_trxs.transfers });
    arr.reverse();
    console.log(arr);
    if (setter) setter(arr);
    // console.log("transactions are ", arr);

    return arr;
  }
}

export async function getWeb3(chain_name) {
  let HttpProviderURL = providers[chain_name];
  if (!HttpProviderURL) {
    return null;
  }

  let _provider = new Web3.providers.HttpProvider(HttpProviderURL);
  let _web3 = new Web3(_provider);

  return _web3;
}

export async function prepareTransaction(
  value,
  toAddress,
  selectedChain,
  setter
) {
  let web3 = await getWeb3(selectedChain);
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 21000;

  const rawTransaction = {
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    to: toAddress,
    value: value,
  };
  setter(rawTransaction);
  return rawTransaction;
}
export async function _signTransactionAndBroadcast(
  transactionObject,
  privKey,
  selectedChain,
  setter,
  finisher,
  Toaster
) {
  let web3 = await getWeb3(selectedChain);
  console.log({
    transactionObject,
    privKey,
    selectedChain,
    setter,
    finisher,
    Toaster,
  });
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transactionObject,
    privKey
  );
  setter(signedTransaction);
  broadcastTransaction(signedTransaction, finisher, Toaster, selectedChain);
  return signedTransaction;
}

// Function to broadcast the signed transaction
export async function broadcastTransaction(
  signedTransaction,
  finisher,
  Toast,
  selectedChain
) {
  let web3 = await getWeb3(selectedChain);
  if (!web3) return null;

  Toast({
    title: `Transaction initiated`,
    description: `Keep navigating through the wallet and we will perform your transaction in the background`,
    type: "info",
  });

  web3.eth
    .sendSignedTransaction(signedTransaction.rawTransaction)
    .once("transactionHash", (txHash) => {
      console.log(txHash);
      Toast({
        title: `Transaction Broadcast`,
        description: `Wating for confirmation...`,
        type: "info",
      });
    })
    .on("confirmation", (confirmationNumber, receipt) => {
      if (confirmationNumber <= 12)
        Toast({
          title: `Funds Transfer Progress`,
          description: `Transaction confirmed by ${confirmationNumber}/12 block(s)`,
          type: "info",
        });

      if (confirmationNumber == 12) {
        Toast({
          title: `Funds Transferred`,
          description: `Funds transferred successfully, block number: ${receipt.blockNumber}`,
          type: "success",
        });

        Toast(
          `Funds transferred successfully, block number: ${receipt.blockNumber}`
        );

        finisher();

        console.log(
          `Funds transferred successfully, block number: ${receipt.blockNumber}`
        );
      } else {
        return;
      }
    })
    .on("error", (error) => {
      Toast({
        title: `Transaction failed`,
        description: error,
        type: "error",
      });
    });
}


export async function bnbExternalTransaction(address, network) {
  try {
    if (network === "bscTestNet") {
      const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    } else {
      const response = await axios.get(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    }
  } catch (err) {
    console.log(err)
  }
}

export async function bnberc20Transaction(address, network) {
  try {
    if (network === "bscTestNet") {
      const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    } else {
      const response = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    }
  } catch (err) {
    console.log(err)
  }
}

export async function bnberc20TransactionByContractAddress(address, contractAddress, network) {
  try {
    if (network === "bscTestNet") {
      const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=tokentx &contractaddress=${contractAddress}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    } else {
      const response = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    }
  } catch (err) {
    console.log(err)
  }
}

export async function bnberc721Transaction(address, network) {
  try {
    if (network === "bscTestNet") {
      const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    } else {
      const response = await axios.get(`https://api.bscscan.com/api?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    }
  } catch (err) {
    console.log(err)
  }
}

export async function bnbInternalTransaction(address, network) {
  try {
    if (network === "bscTestNet") {
      const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    } else {
      const response = await axios.get(`https://api.bscscan.com/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=X67YKQTIRVI5B7IR8XPW16BGTCTYXDWTSK`)
      return response.data.result
    }
  } catch (err) {
    console.log(err)
  }
}


export async function bnbAllTransaction(address, network) {
  try {
    if (network === "bscTestNet") {
     
    } else {
     
    }
  } catch(err) {
    console.log(err)
  }
}