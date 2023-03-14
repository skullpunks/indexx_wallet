/**       Imports */
import { Box, Button, Heading, HStack, IconButton, Image, Img, Input, Spinner, Switch, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useClipboard, useToast, VStack } from "@chakra-ui/react";
import * as bip39 from "@scure/bip39";
import axios from "axios";
import { hdkey } from "ethereumjs-wallet";
import { parseEther } from "ethers/lib/utils";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import Web3 from "web3";
//import { generateBitcoinMainAddressFromMnemonic } from "../api/bitcoin";
import { buyMethods, chains, currencyOf, tokens } from "../api/data";
import { getTransactions, getWeb3, prepareTransaction, _signTransactionAndBroadcast } from "../api/Transaction";
import {
  arrayToPrivateKey,
  capitalize,
  generateBitcoinMainAddress,
  generateBitcoinMainAddressFromPrivateKey,
  generateBitcoinTestAddress,
  generateBitcoinTestAddressFromPrivateKeyWIF,
} from "../api/Utilities";
import AccountInstance from "./AccountInstance";
import AssetTemplate from "./AssetTemplate";
import ModalWrapper from "./ModalWrapper";
import NFTsInstance from "./NFTsInstance";
import NotificationInstance from "./NotificationInstance";
import PaymentMethodInstance from "./PaymentMethodInstance";
import TransactionInstance from "./TransactionInstance";
//

//

// function to get Transactions of an address on a 'network' chain
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const brandPrimary = defineStyle({
  color: "black",
});

export const buttonTheme = defineStyleConfig({
  variants: { brandPrimary },
});

function AccountManager({ mnemonic }) {
  const [selectedChain, setSelectedChain] = useState(chains[0].name);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccounts, setShowAccounts] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedImported, setSelectedImported] = useState(null);
  const [isSelectedImported, setIsSelectedImported] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [buyIntent, setBuyIntent] = useState(false);
  const [receiveIntent, setReceiveIntent] = useState(false);
  const [sendIntent, setSendIntent] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferAddress, setTransferAddress] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [transactionObject, setTransactionObject] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [privateKey, setPrivateKey] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [image, setImage] = useState("");
  const { onCopy, value, setValue, hasCopied } = useClipboard(selectedAccount?.address);
  const [showAssets, setShowAssets] = useState(false);
  const [explorerURL, setExplorerURL] = useState("");
  const [showTxs, setShowTxs] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFaceRecogition, setShowFaceRecogition] = useState(false);
  const [countOfUnreadNotifications, setCountOfUnreadNotifications] = useState({
    mainnet: 0,
    goerli: 0,
    bitcoin: 0,
    bitcoinTestNet: 0,
    bscMainNet: 0,
    bscTestNet: 0,
  });
  const [isSleeping, setIsSleeping] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  console.log("Notificaiton: ", selectedChain, countOfUnreadNotifications[selectedChain], countOfUnreadNotifications);
  const web3 = useRef(null);
  const toast = useToast();
  function Toast(message) {
    toast({
      title: message.title,
      description: message.description,
      status: message.type,
      duration: 2000,
      isClosable: true,
    });
  }

  function underDevelopmentToast() {
    Toast({
      title: `Under Development`,
      description: `We are working on it.\nIt will be ready soon.\nThank you for trying out`,
      type: "info",
    });
  }

  function underBitcoinDevelopmentToast() {
    Toast({
      title: `No Assets avaliable`,
      description: `Bitcoin network does not have an assets to shown. Odinals will be ready soon.\nThank you for trying out`,
      type: "info",
    });
  }

  async function checkBalance(address) {
    if (selectedChain.includes("bitcoin")) {
      console.log("bitcoin");

      return 0;
    } else {
      if (!address) {
        return 0;
      }
      if (!web3 || !web3.current) {
        web3.current = await getWeb3(selectedChain);
      }
      let balance = await web3.current?.eth.getBalance(address);
      if (balance == undefined) {
        return 0;
      }
      balance = parseFloat(parseInt(balance) / 10 ** 18).toFixed(4);
      if (balance.toString() === "0.0000") {
        balance = 0;
      }
      return balance;
    }
  }

  async function bitcoinTestBalance(address) {
    let balance = await axios.get("https://api.blockcypher.com/v1/btc/test3/addrs/" + address + "/balance");
    console.log(balance.data);
    return balance.data.balance / Math.pow(10, 8);
  }

  async function bitcoinMainBalance(address) {
    let balance = await axios.get("https://api.blockcypher.com/v1/btc/main/addrs/" + address + "/balance");
    console.log(balance.data);
    return balance.data.balance / Math.pow(10, 8);
  }

  const generateAccounts = async (_seedPhrase) => {
    try {
      if (String(_seedPhrase).startsWith("0x") || String(_seedPhrase).length === 64) {
        let _accounts = accounts;
        let addressObj = new Web3().eth.accounts.privateKeyToAccount("0x" + _seedPhrase);
        let _address = addressObj.address;
        let balance = await checkBalance(_address);
        let _accountsObject = {
          name: "Account " + (_accounts.length + 1),
          avatar: "./account.png",
          balance,
          address: _address,
          privateKey: addressObj.privateKey,
          network: "evmChain",
          isImported: true,
        };
        _accounts.push(_accountsObject);

        //Bitcoin test account and main net account
        const address = generateBitcoinTestAddressFromPrivateKeyWIF(mnemonic);
        console.log(address);
        let _accountsObjectTest = {
          name: "Account " + (_accounts.length + 1),
          avatar: "./account.png",
          balance,
          address: address.address,
          privateKey: address.privateKey,
          network: "bitcoinTest",
          isImported: false,
        };
        _accounts.push(_accountsObjectTest);
        //MainNet
        const mainAddress = generateBitcoinMainAddressFromPrivateKey(mnemonic);
        console.log(mainAddress);
        let _accountsObjectMain = {
          name: "Account " + (_accounts.length + 1),
          avatar: "./account.png",
          balance,
          address: mainAddress.address,
          privateKey: mainAddress.privateKey,
          network: "bitcoinMain",
          isImported: false,
        };
        _accounts.push(_accountsObjectMain);
        setSelectedAccount(_accounts[0]);
        setAccounts(_accounts);
        return _accounts;
      } else {
        // console.log("generating accounts");
        _seedPhrase = _seedPhrase.replace(/  +/g, " ");
        const seed = bip39.mnemonicToSeedSync(_seedPhrase);
        const hdwallet = hdkey.fromMasterSeed(seed);
        const wallet_hdpath = "m/44'/60'/0'/0/";
        let _accounts = [];
        for (let i = 0; i < 1; i++) {
          const wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
          const _address = "0x" + wallet.getAddress().toString("hex");
          let privKey = arrayToPrivateKey(wallet.getPrivateKey());
          let balance = await checkBalance(_address);
          let _accountsObject = {
            name: "Account " + (_accounts.length + 1),
            avatar: "./account.png",
            balance,
            address: _address,
            privateKey: privKey,
            network: "evmChain",
            isImported: false,
          };
          _accounts.push(_accountsObject);
        }

        //Bitcoin test account and main net account
        const address = generateBitcoinTestAddress(mnemonic);
        let btcTestBalance = await bitcoinTestBalance(address.address);

        let _accountsObjectTest = {
          name: "Account " + (_accounts.length + 1),
          avatar: "./account.png",
          btcTestBalance,
          address: address.address,
          privateKey: address.privateKey,
          network: "bitcoinTest",
          isImported: false,
        };
        _accounts.push(_accountsObjectTest);
        const mainAddress = generateBitcoinMainAddress(mnemonic);
        let btcMainBalance = await bitcoinMainBalance(mainAddress.address);
        let _accountsObjectMain = {
          name: "Account " + (_accounts.length + 1),
          avatar: "./account.png",
          btcMainBalance,
          address: mainAddress.address,
          privateKey: mainAddress.privateKey,
          network: "bitcoinMain",
          isImported: false,
        };
        _accounts.push(_accountsObjectMain);

        setSelectedAccount(_accounts[0]);
        setAccounts(_accounts);
        return _accounts;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const generateAccountsForImport = async (privateKey, chain) => {
    if (
      String(privateKey).startsWith("0x") ||
      String(privateKey).length === 64
    ) {
      let _accounts = accounts;
      if (chain === "mainnet" || chain === "goeril" || chain === "bscMainNet" || chain === "bscTestNet") {
        let addressObj = new Web3().eth.accounts.privateKeyToAccount(
          "0x" + privateKey
        );
        let _address = addressObj.address;
        let balance = await checkBalance(_address);
        let _accountsObject = {
          name: "Account " + (_accounts.length + 1),
          avatar: "./account.png",
          balance,
          address: _address,
          privateKey: addressObj.privateKey,
          network: "evmChain",
          isImported: true,
        };
        _accounts.push(_accountsObject);
      } else if (chain === "bitcoinTestNet") {
        //Bitcoin test account and main net account
        const address = generateBitcoinTestAddressFromPrivateKeyWIF(privateKey);
        console.log(address);
        let _accountsObjectTest = {
          name: "Account " + (_accounts.length + 1),
          avatar: "./account.png",
          balance,
          address: address.address,
          privateKey: address.privateKey,
          network: "bitcoinTest",
          isImported: false,
        };
        _accounts.push(_accountsObjectTest);
      } else if (chain === "bitcoin") {
        //MainNet
        const mainAddress = generateBitcoinMainAddressFromPrivateKey(privateKey);
        console.log(mainAddress);
        let _accountsObjectMain = {
          name: "Account " + (_accounts.length + 1),
          avatar: "./account.png",
          balance,
          address: mainAddress.address,
          privateKey: mainAddress.privateKey,
          network: "bitcoinMain",
          isImported: false,
        };
        _accounts.push(_accountsObjectMain);
      }
      setSelectedAccount(_accounts[0]);
      setAccounts(_accounts);
      return _accounts;
    }
  }

  async function updateAssets() {
    if (!selectedAccount || !selectedChain) {
      return 0;
    }
    setIsSwitchLoading(true);

    // if (!isSwitchLoading)
    //   loadingMessage == null && setLoadingMessage("Loading");
    web3.current = await getWeb3(selectedChain);
    // fetching latest transactions of selected account
    let trxs = await getTransactions(selectedChain, selectedAccount.address, setTransactions, setNotifications, countOfUnreadNotifications, setCountOfUnreadNotifications);
    // fetching balance of the user
    let balance = await checkBalance(selectedAccount.address);
    setSelectedAccount({ ...selectedAccount, balance });
    setIsSwitchLoading(false);
    setTimeout(() => {
      setLoadingMessage(null);
    }, 1000);
  }

  async function transferMoney() {
    await prepareTransaction(parseEther(transferAmount.toString()), transferAddress, selectedChain, setTransactionObject);
  }

  async function signTransaction() {
    // To get back to the state of the wallet so that user can continue navigating the wallet
    setTransactionObject(null);
    setSendIntent(false);

    // signing transaction
    _signTransactionAndBroadcast(
      transactionObject,
      selectedAccount.privateKey,
      selectedChain,
      setTransactionObject,
      () => {
        setTimeout(() => {
          setLoadingMessage(null);
        }, 1000);
        updateAssets();
      },
      Toast
    );
  }

  const importAccount = () => {
    console.log("private key", privateKey, selectedChain);
    if (privateKey) {
      privateKey;
      generateAccountsForImport(privateKey, selectedChain);
      setShowImportModal(false);
    }
  };

  // use Effects
  /**/
  useEffect(() => {
    // setIsSwitchLoading(true);
    updateAssets();
    // if(loadingMessage == null)
    // setImage()

    console.log("Cur:", selectedChain);
    if (selectedChain === "bitcoinTestNet" || selectedChain === "bitcoin") {
      setImage("./BTC.png");
    } else if (selectedChain === "mainnet" || selectedChain === "goerli") {
      setImage("./ETH.png");
    } else if (selectedChain === "bscMainNet" || selectedChain === "bscTestNet") {
      setImage("./BNB.png");
    }

    if (String(selectedChain).localeCompare("bitcoinTestNet") === 0) {
      setExplorerURL("https://live.blockcypher.com/btc-testnet/address/");
    } else if (String(selectedChain).localeCompare("bitcoin") === 0) {
      setExplorerURL("https://live.blockcypher.com/btc/address/");
    } else if (String(selectedChain).localeCompare("mainnet") === 0) {
      setExplorerURL("https://etherscan.io/address/");
    } else if (String(selectedChain).localeCompare("goerli") === 0) {
      setExplorerURL("https://goerli.etherscan.io/address/");
    } else if (String(selectedChain).localeCompare("bscMainNet") === 0) {
      setExplorerURL("https://bscscan.com/address/");
    } else if (String(selectedChain).localeCompare("bscTestNet") === 0) {
      setExplorerURL("https://testnet.bscscan.com/address/");
    }
    // setIsSwitchLoading(false);
  }, [selectedChain]);

  useEffect(() => {
    generateAccounts(mnemonic);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      loadingMessage != null && setLoadingMessage(null);
    }
  }, [selectedAccount, selectedChain]);

  useEffect(() => {
    if (!selectedAccount || !selectedAccount.address) return;
    getTransactions(selectedChain, selectedAccount.address, setTransactions, setNotifications, countOfUnreadNotifications, setCountOfUnreadNotifications);
  }, [selectedAccount]);

  return (
    <VStack
    // spacing={5}
    >
      {/*  Top Bar */}
      <>
        <HStack width={"40vw"} justify={"space-between"} top={"25vp"}>
          {/* Wallet logo */}
          <VStack spacing={5} width={"100%"} height={"80%"} top={"25vp"} justify={"center"}>
            <Img
              // height={"100px"}
              width={"300px"}
              // borderRadius={"50%"}
              src={"./indexx-wallet-new1.png"}
            />
          </VStack>
        </HStack>
        <HStack>
          {/* Networks Selection */}
          {/* <Box padding={"20px"} fontWeight={"500"}>
            <select
              style={{
                background: "transparent",
                cursor: "pointer",
                padding: "5px",
                borderRadius: "20px",
                marginRight: "45px"
              }}
              onChange={async (e) => {
                setLoadingMessage("Switching to " + capitalize(e.target.value));
                setSelectedChain(e.target.value);
              }}
              placeholder={capitalize(selectedChain)}
            >
              {chains.map((chain) => {
                return (
                  <option
                    style={{
                      background: "black",
                      color: "white",
                      cursor: "pointer",
                    }}
                    key={"chain" + chain.name}
                    value={chain.name}
                  >
                    {capitalize(chain.label)}
                  </option>
                );
              })}
            </select>
          </Box> */}
          {/* Accounts Selection */}
          <Box>
            {/* <Button
              _hover={{ bg: "transparent" }}
              bg={"transparent"}
              onClick={() => setShowAccounts(true)}
              style={{ marginLeft: "-65px" }}
            >
              <Img
                height={8}
                src={selectedAccount?.avatar}
              // borderRadius={"50%"}
              />
            </Button> */}

            {/* {showAccounts && (
              <>
                <ModalWrapper>
                  <VStack
                    height={"max-content"}
                    position={"relative"}
                    zIndex={2}
                    bg={"white"}
                    width={"70vw"}
                    borderRadius={"20px"}
                    paddingTop={"5vh"}
                    paddingBottom={"40px"}
                  // overflowY={"scroll"}
                  >
                    {accounts?.map((account) => {
                      return (
                        <AccountInstance
                          selector={async (account) => {
                            setShowAccounts(false);
                            setLoadingMessage("Switching Account");
                            let balance = await checkBalance(account.address);
                            setLoadingMessage("Getting account details");

                            setSelectedAccount({ ...account, balance });
                            setTimeout(() => {
                              setLoadingMessage(null);
                            }, 2000);
                          }}
                          copyable={false}
                          account={account}
                          showDetails={true}
                          chain={selectedChain}
                        />
                      );
                    })}
                    <br></br>
                    <br></br>

                    <Button
                      style={{ width: "270px" }}
                      color="white"
                      variant="solid"
                      bg="black"
                      _hover={{ bg: "black" }}
                      onClick={() => setShowAccounts(false)}
                    >
                      Complete
                    </Button>
                  </VStack>
                </ModalWrapper>
              </>
            )} */}

            {showAccountDetails && (
              <>
                <ModalWrapper>
                  <VStack height={"75vh"} position={"absolute"} zIndex={2} bg={"white"} width={"40vw"} borderRadius={"20px"} paddingTop={"5vh"}>
                    <Text>
                      <b>Address:</b> {selectedAccount?.address}
                      <b>Private Key:</b> {selectedAccount?.privateKey}
                    </Text>

                    <br></br>
                    <br></br>

                    <Button style={{ width: "270px" }} colorScheme={"red"} onClick={() => window.open("https://google.com")}>
                      Import Account
                    </Button>

                    <br></br>
                    <br></br>
                    <Button style={{ width: "270px" }} color="white" variant="solid" bg="black" _hover={{ bg: "black" }} onClick={() => setShowAccountDetails(false)}>
                      Complete
                    </Button>
                  </VStack>
                </ModalWrapper>
              </>
            )}
          </Box>
        </HStack>
      </>

      {loadingMessage != null ? (
        <VStack align={"center"} width={"50vw"} height={"80vw"} spacing={10}>
          <Spinner thickness="5px" speed="0.5s" emptyColor="gray.200" color="green.500" size="xl" />
          <Heading>{loadingMessage}</Heading>
        </VStack>
      ) : (
        <>
          <HStack spacing={35} justifyItems={"center"}>
            {/* <HStack
              onClick={() => {
                setIsConnected((prev) => !prev);
                Toast({
                  title: !isConnected ? `Connected` : "Disconnected",
                  description: `Current website is connected to the wallet`,
                  type: !isConnected ? "success" : "error",
                });
              }}
              cursor={"pointer"}
              padding={"10px"}
              borderRadius={"20px"}
              _hover={{ bg: "rgba(255,255,255,0.2)" }}
            >
              <Switch id="isChecked" isConnected />
              <Text width={"max-content"}>
                {" "}
                {isConnected ? "Connected" : "Connect Now"}
              </Text>
            </HStack> */}

            <div>
              <Box
                // padding={"20px"}
                fontWeight={"500"}
                justifyContent={"center"}
              >
                {isSleeping ? (
                  <select
                    disabled
                    style={{
                      background: "transparent",
                      cursor: "pointer",
                      padding: "5px",
                      borderRadius: "20px",
                      // marginLeft: "220px"
                      // marginRight: "45px"
                    }}
                    onChange={async (e) => {
                      // setLoadingMessage(
                      //   "Switching to " + capitalize(e.target.value)
                      // );
                      // setLoadingMessage("Switching");
                      setIsSwitchLoading(true);
                      console.log(e.target, "value");
                      console.log("Switching to " + capitalize(e.target.value));
                      setSelectedChain(e.target.value);
                      console.log("Changed to: ", selectedChain);
                    }}
                    defaultValue={capitalize(selectedChain)}
                  >
                    {chains.map((chain) => {
                      return (
                        <option
                          style={{
                            background: "white",
                            color: "black",
                            cursor: "pointer",
                          }}
                          key={"chain" + chain.name}
                          value={chain.name}
                        >
                          {capitalize(chain.label)}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <select
                    style={{
                      background: "transparent",
                      cursor: "pointer",
                      padding: "5px",
                      borderRadius: "20px",
                      // marginLeft: "220px"
                      // marginRight: "45px"
                    }}
                    onChange={async (e) => {
                      // setLoadingMessage(
                      //   "Switching to " + capitalize(e.target.value)
                      // );
                      // setLoadingMessage("Switching");
                      setIsSwitchLoading(true);
                      console.log(e.target, "value");
                      console.log("Switching to " + capitalize(e.target.value));
                      setSelectedChain(e.target.value);
                      console.log("Changed to: ", e.target.value);
                      if (String(e.target.value).localeCompare("bitcoinTestNet") === 0) {
                        let reqAcc = accounts.filter(x => x.network === "bitcoinTest")
                        console.log(reqAcc);
                        setSelectedAccount(reqAcc[0])
                      } else if (String(e.target.value).localeCompare("bitcoin") === 0) {
                        let reqAcc = accounts.filter(x => x.network === "bitcoinMain")
                        console.log(reqAcc);
                        setSelectedAccount(reqAcc[0])
                      } else if (String(e.target.value).localeCompare("mainnet") === 0) {
                        let reqAcc = accounts.filter(x => x.network === "evmChain")
                        console.log(reqAcc);
                        setSelectedAccount(reqAcc[0])
                      } else if (String(e.target.value).localeCompare("goerli") === 0) {
                        let reqAcc = accounts.filter(x => x.network === "evmChain")
                        console.log(reqAcc);
                        setSelectedAccount(reqAcc[0])
                      } else if (String(e.target.value).localeCompare("bscMainNet") === 0) {
                        let reqAcc = accounts.filter(x => x.network === "evmChain")
                        console.log(reqAcc);
                        setSelectedAccount(reqAcc[0])
                      } else if (String(e.target.value).localeCompare("bscTestNet") === 0) {
                        let reqAcc = accounts.filter(x => x.network === "evmChain")
                        console.log(reqAcc);
                        setSelectedAccount(reqAcc[0])
                      }
                    }}
                    defaultValue={capitalize(selectedChain)}
                  >
                    {chains.map((chain) => {
                      return (
                        <option
                          style={{
                            background: "white",
                            color: "black",
                            cursor: "pointer",
                          }}
                          key={"chain" + chain.name}
                          value={chain.name}
                        >
                          {capitalize(chain.label)}
                        </option>
                      );
                    })}
                  </select>
                )}
              </Box>
            </div>

            <Button _hover={{ bg: "transparent" }} bg={"transparent"} onClick={() => setShowAccounts(true)}>
              <Img bg={"white"} height={"34px"} width={"27.3px"} src={"./man-icon.png"} />
            </Button>
          </HStack>

          <VStack spacing={10}>
            {isSwitchLoading ? (
              <Spinner />
            ) : (
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "500",
                    marginTop: "-5px",
                    float: "left",
                    marginRight: "10px",
                    // paddingLeft: "20px",
                    // paddingTop: "20%"
                  }}
                >
                  {/* {isBalanceLoading ? (
                    <Spinner />
                  ) : (
                    <> */}
                      {selectedAccount?.balance} {currencyOf[selectedChain]}
                    {/* </>
                  )} */}
                </h2>
                <Img height={"30px"} width={"30px"} float={"left"} src={image} />
              </div>
            )}
            <br></br>
            <br></br>
            <HStack spacing={155}>
              {/* <Button colorScheme="brand" style={{ width: "140px" }} onClick={() => setBuyIntent(true)}>
                Buy
              </Button> */}
              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={<Image width={"81px"} height={"78px"} src={"./buysell1.png"} />}
                  onClick={() => setBuyIntent(true)}
                  //onClick={() => <BuyMethods buyMethods={buyMethods}/>}
                />
                <Text>Buy/Sell</Text>
              </VStack>
              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={<Image width={"81px"} height={"78px"} src={"./receive1.png"} />}
                  onClick={() => {
                    console.log(accounts);
                    if (String(selectedChain).localeCompare("bitcoinTestNet") === 0) {
                      let reqAcc = accounts.filter(x => x.network === "bitcoinTest")
                      console.log(reqAcc);
                      setSelectedAccount(reqAcc[0])
                    } else if (String(selectedChain).localeCompare("bitcoin") === 0) {
                      let reqAcc = accounts.filter(x => x.network === "bitcoinMain")
                      console.log(reqAcc);
                      setSelectedAccount(reqAcc[0])
                    } else if (String(selectedChain).localeCompare("mainnet") === 0) {
                      let reqAcc = accounts.filter(x => x.network === "evmChain")
                      console.log(reqAcc);
                      setSelectedAccount(reqAcc[0])
                    } else if (String(selectedChain).localeCompare("goerli") === 0) {
                      let reqAcc = accounts.filter(x => x.network === "evmChain")
                      console.log(reqAcc);
                      setSelectedAccount(reqAcc[0])
                    } else if (String(selectedChain).localeCompare("bscMainNet") === 0) {
                      let reqAcc = accounts.filter(x => x.network === "evmChain")
                      console.log(reqAcc);
                      setSelectedAccount(reqAcc[0])
                    } else if (String(selectedChain).localeCompare("bscTestNet") === 0) {
                      let reqAcc = accounts.filter(x => x.network === "evmChain")
                      console.log(reqAcc);
                      setSelectedAccount(reqAcc[0])
                    }
                    setReceiveIntent(true);
                  }}
                />
                <Text>Receive</Text>
              </VStack>

              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={<Image width={"81px"} height={"78px"} src={"./send1.png"} />}
                  onClick={() => {
                    setSendIntent(true);
                  }}
                />
                <Text>Send</Text>
              </VStack>

              <VStack spacing={5}>
                <IconButton isDisabled={isSleeping} icon={<Image width={"81px"} height={"78px"} src={"./swap1.png"} />} onClick={() => window.open("https://dex.indexx.ai")} />
                <Text>Swap</Text>
              </VStack>
            </HStack>
            <br></br>
            <br></br>
            <HStack spacing={155}>
              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={<Image width={"81px"} height={"78px"} src={"./add1.png"} />}
                  onClick={() => {
                    setShowImportModal(true);
                  }}
                />
                <Text>Import</Text>
              </VStack>

              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={
                    <>
                      {countOfUnreadNotifications[selectedChain] > 0 ? (
                        <Image width={"88px"} height={"89px"} src={"./notification_unread.png"} />
                      ) : (
                        <Image width={"81px"} height={"78px"} src={"./notif1.png"} />
                      )}
                      {/* <Box as={'span'} color={'white'} position={'absolute'} top={'-45px'} left={'-7px'} fontSize={'1.4rem'}
                      bgColor={'#F66137'} borderRadius={'llg'} zIndex={9999} p={'1px'}>
                      {1}
                    </Box> */}
                    </>
                  }
                  onClick={async () => {
                    await updateAssets();
                    setShowNotifications(true);
                  }}
                />
                <Text>Notifications</Text>
              </VStack>

              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={<Image width={"81px"} height={"78px"} src={"./assets1.png"} />}
                  onClick={() => {
                    if (String(selectedChain).localeCompare("bitcoinTestNet") === 0) {
                      underBitcoinDevelopmentToast()
                    } else if (String(selectedChain).localeCompare("bitcoin") === 0) {
                      underBitcoinDevelopmentToast();
                    } else if (String(selectedChain).localeCompare("mainnet") === 0) {
                      setShowAssets(true);
                    } else if (String(selectedChain).localeCompare("goerli") === 0) {
                      setShowAssets(true);
                    } else if (String(selectedChain).localeCompare("bscMainNet") === 0) {
                      setShowAssets(true);
                    } else if (String(selectedChain).localeCompare("bscTestNet") === 0) {
                      setShowAssets(true);
                    }
                  }}
                />
                <Text>Assets</Text>
              </VStack>

              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={<Image width={"81px"} height={"78px"} src={"./transactions1.png"} />}
                  onClick={() => {
                    setShowTxs(true);
                  }}
                />
                <Text>Transactions</Text>
              </VStack>
            </HStack>
            <br></br>
            <br></br>
            <HStack spacing={145}>
              <VStack spacing={5}>
                <IconButton isDisabled={isSleeping} icon={<Image width={"81px"} height={"78px"} src={"./fingerprint1.png"} />} onClick={underDevelopmentToast} />
                <Text>Fingerprint</Text>
              </VStack>

              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={<Image width={"81px"} height={"78px"} src={"./facerecog1.png"} />}
                  onClick={() => {
                    setShowFaceRecogition(true);
                  }}
                />
                <Text>Face Recogition</Text>
              </VStack>

              <VStack spacing={5}>
                <IconButton
                  isDisabled={isSleeping}
                  icon={<Image width={"81px"} height={"78px"} src={"./scan1.png"} />}
                  onClick={() => {
                    console.log(isSleeping);
                    window.open(explorerURL + selectedAccount?.address);
                  }}
                />
                <Text>Scan</Text>
              </VStack>

              <VStack spacing={5}>
                {isSleeping ? (
                  <IconButton
                    icon={<Image width={"81px"} height={"78px"} src={"./sleeping1.png"} />}
                    onClick={() => {
                      setIsSleeping(!isSleeping);
                      location.reload();
                      console.log(isSleeping);
                    }}
                  />
                ) : (
                  <IconButton
                    icon={<Image width={"81px"} height={"78px"} src={"./non-sleeping1.png"} />}
                    onClick={() => {
                      setIsSleeping(!isSleeping);
                      console.log(isSleeping);
                    }}
                  />
                )}
                <Text>Sleeping Beauty</Text>
              </VStack>
            </HStack>
          </VStack>
        </>
      )}
      {buyIntent && (
        <ModalWrapper>
          <VStack
            // height={"101vh"}
            // position={"absolute"}
            height={"max-content"}
            position={"relative"}
            zIndex={2}
            bg={"white"}
            width={"100vw"}
            paddingTop={"5vh"}
            overflowY={"scroll"}
            spacing={10}
          >
            <Img width={"300px"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <br></br>
            {buyMethods.map((item) => {
              return <PaymentMethodInstance payment={item} key={"payment" + item.title} />;
            })}
            <Button
              style={{ width: "384px" }}
              color="white"
              variant="solid"
              bg="black"
              _hover={{ bg: "black" }}
              padding={"20px"}
              onClick={() => setBuyIntent(false)}
            >
              Complete
            </Button>
          </VStack>
        </ModalWrapper>
      )}

      {receiveIntent && (
        <ModalWrapper>
          <VStack
            // height={"101vh"}
            // position={"absolute"}
            height={"max-content"}
            position={"relative"}
            zIndex={2}
            bg={"white"}
            width={"100vw"}
            spacing={10}
            paddingBottom={"20px"}
          >
            <Img width={"300px"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <h1 style={{ fontSize: "24px" }}> Receive Funds</h1>

            <QRCodeCanvas
              id="qrCode"
              value={selectedAccount?.address}
              size={100}
              level={"H"}
              // style={{ marginLeft: 92 }}
              // imageSettings={
              //   {
              //     src: image,
              //     height: 20,
              //     width: 20,
              //     // excavate: true
              //   }
              // }
            />
            <Text>{selectedAccount?.address} </Text>
            <HStack spacing={10}>
              <Button style={{ width: "200px" }} colorScheme="brand" onClick={onCopy}>
                {hasCopied ? "Copied!" : "Copy"}
              </Button>
              <Button
                style={{ width: "200px" }}
                color="white"
                variant="solid"
                bg="black"
                _hover={{ bg: "black" }}
                onClick={() => {
                  setReceiveIntent(false);
                }}
              >
                Complete
              </Button>
            </HStack>
          </VStack>
        </ModalWrapper>
      )}

      {sendIntent && transactionObject == null && (
        <ModalWrapper>
          <VStack height={"max-content"} position={"relative"} zIndex={2} bg={"white"} width={"100vw"} spacing={10} paddingBottom={"20px"}>
            <Img width={"300px"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <br></br>
            <h1 style={{ fontSize: "24px" }}> Transfer Funds</h1>

            <Input
              type={"text"}
              style={{ color: "black" }}
              maxWidth="548px"
              maxHeight="48px"
              placeholder={"Destination Address"}
              onChange={(e) => {
                setTransferAddress(e.target.value);
              }}
            />
            <Input
              type={"text"}
              style={{ color: "black" }}
              maxWidth="548px"
              maxHeight="48px"
              placeholder={"Amount to transfer"}
              onChange={(e) => {
                setTransferAmount(e.target.value);
              }}
            />
            <HStack>
              <Button style={{ width: "270px" }} colorScheme="brand" onClick={transferMoney}>
                Send
              </Button>
              <Button
                style={{ width: "270px" }}
                // colorScheme={"red"}
                color="white"
                variant="solid"
                bg="black"
                _hover={{ bg: "black" }}
                onClick={() => {
                  setSendIntent(false);
                }}
              >
                Complete
              </Button>
            </HStack>
          </VStack>
        </ModalWrapper>
      )}

      {transactionObject && (
        <ModalWrapper>
          <VStack height={"max-content"} position={"relative"} zIndex={2} bg={"white"} width={"100vw"} spacing={10} paddingBottom={"20px"}>
            <Img width={"300px"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <br></br>
            <h1 style={{ fontSize: "24px" }}> Approve Transfer</h1>

            <HStack>
              <Text> From : </Text>
              <br></br>
              <Text>{selectedAccount?.address}</Text>
            </HStack>
            <HStack>
              <Text> To : </Text>
              <br></br>
              <Text>{transferAddress}</Text>
            </HStack>
            <HStack>
              <Text> Amount : </Text> <br></br>
              <Text>
                {transferAmount} {currencyOf[selectedChain]}
              </Text>
            </HStack>

            <HStack spacing={10}>
              <Button
                colorScheme={"red"}
                style={{ width: "270px" }}
                onClick={() => {
                  setTransactionObject(null);
                }}
              >
                Reject
              </Button>
              <Button style={{ width: "270px" }} colorScheme="brand" onClick={signTransaction}>
                Accept
              </Button>
            </HStack>
          </VStack>
        </ModalWrapper>
      )}

      {showImportModal && (
        <ModalWrapper>
          <VStack height={"max-content"} position={"relative"} zIndex={2} bg={"white"} width={"100vw"} spacing={10} paddingBottom={"20px"}>
            <Img width={"300px"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <br></br>
            <h1 style={{ fontSize: "24px" }}> Import Account</h1>

            <div style={{
              width: "548px",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              alignContent: "center"
            }}>
              <p style={{ color: "black" }}>
                {" "}
                Imported accounts will not be associated with your originally
                created with indexx.ai account.
              </p>
            </div>
            <Input
              type={"password"}
              style={{ color: "black" }}
              width={"548px"}
              placeholder={"Enter Private key"}
              onChange={(e) => {
                setPrivateKey(e.target.value);
              }}
            />

            <HStack>
              <Button style={{ width: "270px" }} colorScheme="brand" onClick={() => importAccount()}>
                Import
              </Button>

              <Button style={{ width: "270px" }} color="white" variant="solid" bg="black" _hover={{ bg: "black" }} onClick={() => setShowImportModal(false)}>
                Complete
              </Button>
            </HStack>
            <br></br>
            <br></br>
          </VStack>
        </ModalWrapper>
      )}

      {showAssets && (
        <ModalWrapper>
          <VStack
            height={"max-content"}
            position={"relative"}
            zIndex={2}
            bg={"white"}
            width={"100vw"}
            spacing={10}
            // marginBottom={"140px"}
            paddingTop={"20px"}
          >
            <Img width={"300px"} position={"relative"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <br></br>
            <h1 style={{ fontSize: "24px" }}> Your Digital Asset</h1>

            <Tabs>
              <TabList width={"40vw"} justifyContent={"space-between"}>
                <Tab>Tokens</Tab>
                <Tab>NFT</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={10}>
                    {tokens[selectedChain].length > 0 &&
                      tokens[selectedChain].map((item) => {
                        return (
                          <AssetTemplate
                            onClick={underDevelopmentToast}
                            key={item.address + item.name}
                            asset={item}
                            chain={selectedChain}
                            userAddress={selectedAccount ? selectedAccount.address : null}
                          />
                        );
                      })}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={10}>
                    {transactions?.length == 0 ? (
                      <>
                        <Text>No NFTs to be shown</Text>
                      </>
                    ) : (
                      <>
                        <VStack spacing={5}>
                          {transactions?.map((asset) => {
                            return <NFTsInstance key={asset.hash.toString()} asset={asset} selectedChain={selectedChain} />;
                          })}
                        </VStack>
                      </>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Button
              style={{ width: "512px" }}
              color="white"
              variant="solid"
              bg="black"
              _hover={{ bg: "black" }}
              onClick={() => setShowAssets(false)}
            >
              Complete
            </Button>
          </VStack>
        </ModalWrapper>
      )}

      {showTxs && (
        <ModalWrapper>
          <VStack
            // height={"101vh"}
            // position={"absolute"}
            height={"max-content"}
            position={"relative"}
            zIndex={2}
            bg={"white"}
            width={"100vw"}
            spacing={10}
            paddingBottom={"20px"}
          >
            <Img width={"300px"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <br></br>
            <VStack spacing={10}>
              <h1 style={{ fontSize: "24px" }}> Recent Transactions</h1>

              {transactions.length == 0 ? (
                <>
                  <Text>No Recent Transactions</Text>
                </>
              ) : (
                <>
                  <VStack spacing={5}>
                    {transactions.map((asset) => {
                      return <TransactionInstance key={asset.hash.toString()} asset={asset} selectedChain={selectedChain} />;
                    })}
                  </VStack>
                </>
              )}
            </VStack>
            <Button
              style={{ width: "512px" }}
              color="white"
              variant="solid"
              bg="black"
              _hover={{ bg: "black" }}
              onClick={() => {
                setShowTxs(false);
              }}
            >
              Complete
            </Button>
          </VStack>
        </ModalWrapper>
      )}

      {showNotifications && (
        <ModalWrapper>
          <VStack
            // height={"101vh"}
            // position={"absolute"}
            zIndex={2}
            bg={"white"}
            width={"70vw"}
            spacing={10}
            paddingBottom={"20px"}
          >
            <Img width={"300px"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <br></br>
            <VStack spacing={10}>
              <h1 style={{ fontSize: "24px" }}>Notifications</h1>

              {notifications.length === 0 ? (
                <>
                  <Text>No Recent Notifications</Text>
                </>
              ) : (
                <>
                  <VStack spacing={5}>
                    {notifications.map((asset) => {
                      return (
                        <NotificationInstance
                          key={asset.hash.toString()}
                          asset={asset}
                          selectedChain={selectedChain}
                          countOfUnreadNotifications={countOfUnreadNotifications}
                          setCountOfUnreadNotifications={setCountOfUnreadNotifications}
                        />
                      );
                    })}
                  </VStack>
                </>
              )}
            </VStack>
            <Button
              style={{ width: "578px" }}
              color="white"
              variant="solid"
              bg="black"
              _hover={{ bg: "black" }}
              onClick={() => {
                setShowNotifications(false);
              }}
            >
              Complete
            </Button>
          </VStack>
        </ModalWrapper>
      )}

      {showFaceRecogition && (
        <ModalWrapper>
          <VStack
            // height={"101vh"}
            // position={"absolute"}
            zIndex={2}
            bg={"white"}
            width={"70vw"}
            spacing={10}
            paddingBottom={"20px"}
          >
            <Img width={"300px"} src={"./indexx-wallet-new1.png"} />
            <br></br>
            <br></br>
            <VStack spacing={10}>
              <h1 style={{ fontSize: "24px" }}>Face Recogition Ids</h1>

              {notifications.length === 0 ? (
                <>
                  <Text>No Recent Notifications</Text>
                </>
              ) : (
                <>
                  <VStack spacing={5}>
                    {notifications.map((asset) => {
                      return (
                        <NotificationInstance
                          key={asset.hash.toString()}
                          asset={asset}
                          selectedChain={selectedChain}
                          countOfUnreadNotifications={countOfUnreadNotifications}
                          setCountOfUnreadNotifications={setCountOfUnreadNotifications}
                        />
                      );
                    })}
                  </VStack>
                </>
              )}
            </VStack>
            <Button
              style={{ width: "200px" }}
              color="white"
              variant="solid"
              bg="black"
              _hover={{ bg: "black" }}
              onClick={() => {
                setShowFaceRecogition(false);
              }}
            >
              Complete
            </Button>
          </VStack>
        </ModalWrapper>
      )}

      {showAccounts && (
        <>
          <ModalWrapper>
            <VStack
              height={"max-content"}
              position={"relative"}
              zIndex={2}
              bg={"white"}
              width={"70vw"}
              borderRadius={"20px"}
              paddingTop={"5vh"}
              paddingBottom={"40px"}
              // overflowY={"scroll"}
            >
              {accounts?.map((account) => {
                return (
                  <AccountInstance
                    selector={async (account) => {
                      setShowAccounts(false);
                      setLoadingMessage("Switching Account");
                      let balance = await checkBalance(account.address);
                      setLoadingMessage("Getting account details");
                      console.log("balance", account)
                      setSelectedAccount({ ...account, balance });
                      setTimeout(() => {
                        setLoadingMessage(null);
                      }, 2000);
                    }}
                    copyable={false}
                    account={account}
                    showDetails={true}
                    chain={selectedChain}
                  />
                );
              })}
              <br></br>
              <br></br>

              <Button style={{ width: "270px" }} color="white" variant="solid" bg="black" _hover={{ bg: "black" }} onClick={() => setShowAccounts(false)}>
                Complete
              </Button>
            </VStack>
          </ModalWrapper>
        </>
      )}
    </VStack>
  );
}

export default AccountManager;
