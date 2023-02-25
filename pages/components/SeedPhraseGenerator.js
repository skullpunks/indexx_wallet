import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Img,
  Input,
  Modal,
  Text,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as bip39 from "@scure/bip39";

import { wordlist } from "@scure/bip39/wordlists/english";
import copy from "copy-to-clipboard";
import Link from "next/link";
import Unlock from "./Unlock";
// import Register from "./Register";

const SeedPhraseManager = () => {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [copied, setCopied] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  let faceioInstance = null;

  const handleNewSeedPhrase = () => {
    const newSeedPhrase = bip39.generateMnemonic(wordlist);
    // const newSeedPhrase =
    //   " asd adsdasdaasdas d asd asd sa das d as das d asd sda sdasdasd asd";
    setSeedPhrase(newSeedPhrase);
    localStorage.setItem("seedPhrase", newSeedPhrase);
  };

  const handleImportSeedPhrase = (e) => {
    setSeedPhrase(e.target.value);
    localStorage.setItem("seedPhrase", e.target.value);
  };

  function CopyHandler() {
    copy(seedPhrase);
    setCopied(true);
    //location.reload();
    localStorage.setItem("seedPhrase", seedPhrase);
  }

  function nextHandler() {
    location.reload();
  }

  async function importFromSeedphrase() {
    setLoader(true);
    if (!seedPhrase || seedPhrase == "") {
      alert("Please Enter Valid Seedphrase");
    }
    localStorage.setItem("mnemonic", seedPhrase);
    location.reload();
  }

  async function onClickedPaste() {
    const text = await navigator.clipboard.readText();
    setSeedPhrase(text);
  }


  useEffect(() => {
    const faceIoScript = document.createElement("script");
    faceIoScript.src = "https://cdn.faceio.net/fio.js";
    faceIoScript.async = true;
    faceIoScript.onload = () => faceIoScriptLoaded();
    document.body.appendChild(faceIoScript);

    return () => {
      document.body.removeChild(faceIoScript);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const faceIoScriptLoaded = () => {
    console.log(faceIO);
    if (faceIO && !faceioInstance) {
      faceioInstance = new faceIO("fioab466");
    }
  };

  const handleRegister = async () => {
    // try {
    //   let response = await faceioInstance.enroll({
    //     locale: "auto",
    //     payload: {
    //       email: "example@gmail.com",
    //     },
    //   });

    //   console.log(` Unique Facial ID: ${response.facialId}
    //   Enrollment Date: ${response.timestamp}
    //   Gender: ${response.details.gender}
    //   Age Approximation: ${response.details.age}`);
    // } catch (error) {
    //   console.log(error);
    // }
    //<Register /> 
  };

  return (
    <>
      <VStack
        paddingTop={"10vh"}
        width={"100%"}
        height={"80%"}
        justify={"center"}
      >
        {!showImportModal && seedPhrase ? (
          <>
            {!showSeedPhrase ?
              <>
                <VStack spacing={10}
                  paddingTop={"25vh"}
                  width={"100%"}
                  height={"80%"}
                  justify={"center"}>
                  <Heading fontSize={30}>Create a new wallet using Facial Recogition</Heading>
                  <Wrap spacing={10}>
                    <WrapItem key={"seed-phrase"}>
                      <Button
                        colorScheme="brand"
                        onClick={handleRegister}
                      >
                        Register
                      </Button>
                    </WrapItem>
                    <Button
                      colorScheme="brand"
                      onClick={() => setShowSeedPhrase(true)}
                    > Create using Seedphrase</Button>
                  </Wrap>
                </VStack>
              </>

              :
              <>
                <VStack spacing={10}
                  width={"100%"}
                  height={"80%"}
                  justify={"center"}>
                  <Img
                    // height={"100px"}
                    width={"300px"}
                    // borderRadius={"50%"}
                    src={"./blue-wallet-expanded.png"}
                  />
                  <Heading fontSize={30}>Seed Phrase</Heading>
                  <p className="wallet-image4">Copy the seed phrase and keep it in a secure place(There you will see a 12 word seed phrase. This is really important and usually not a good idea to store digitally, so take your time and write it down) then click on copy button</p>
                  <br></br>

                  <Wrap spacing={10}>
                    <WrapItem key={"seed-phrase"}>
                      <Wrap spacing={12} width={"40vw"}>
                        {seedPhrase.split(" ").map((word) => {
                          return (
                            <WrapItem key={"seed-item" + word}>
                              <Box
                                minW={"90px"}
                                padding={"10px"}
                                border={"1px solid grey"}
                                borderRadius={"2px"}
                              >
                                <Text>{word}</Text>
                              </Box>
                            </WrapItem>
                          );
                        })}
                      </Wrap>
                    </WrapItem>

                  </Wrap>

                  <WrapItem key={"copy-btn"} >
                    <Button
                      disabled={copied}
                      onClick={CopyHandler}
                      colorScheme="brand"
                      width={"194px"}
                      borderRadius={"2px"}
                    // style={{color:"#2E54B3"}}
                    >
                      {copied ? "Copied" : "Copy"}
                    </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      onClick={nextHandler}
                      colorScheme="brand"
                      width={"194px"}
                      borderRadius={"2px"}
                    //  style={{color:"#2E54B3"}}
                    >
                      Next
                    </Button>
                  </WrapItem>
                </VStack>
              </>
            }
          </>
        ) : (
          <>
            {!showImportModal && (
              <VStack
                paddingTop={"25vh"}
                width={"100%"}
                height={"80%"}
                justify={"center"}
              >

                <Img
                  height={"50px"}
                  width={"324px"}
                  // borderRadius={"50%"}
                  src={"./blue-wallet-expanded.png"}
                />
                <br></br>
                <br></br>
                <br></br>
                <HStack>
                  <Button
                    colorScheme="brand"
                    // 
                    width={"194px"}
                    borderRadius={"2px"}
                    onClick={() => !showImportModal && setShowImportModal(true)}
                  >
                    + Import Wallet
                  </Button>
                  <Button
                    colorScheme="brand"
                    width={"194px"}
                    borderRadius={"2px"} onClick={handleNewSeedPhrase}>
                    Create New Wallet
                  </Button>
                </HStack>
              </VStack>
            )}
          </>
        )}
        {showImportModal && (
          <FormControl width={"30vw"}>
            <VStack spacing={10}
              width={"100%"}
              height={"80%"}
              justify={"center"}>
              <Img
                // height={"100px"}
                width={"300px"}
                // borderRadius={"50%"}
                src={"./blue-wallet-expanded.png"}
              />
              <FormLabel>Enter Seed Phrase</FormLabel>
              <p style={
                {
                  fontFamily: 'Inter',
                  fontWeight: 300,
                  fontSize: "20px",
                  lineHeight: "18px",
                  textAlign: "center"
                }
              }> Key in the seed phase in order or click paste directly. When done, click confirm. </p>
              <Input onChange={handleImportSeedPhrase} value={seedPhrase} />
              <HStack>
                <Button colorScheme="brand" width={"194px"}
                  borderRadius={"2px"} onClick={onClickedPaste}>
                  Paste
                </Button>
                <Button colorScheme="brand" width={"194px"}
                  borderRadius={"2px"} onClick={importFromSeedphrase} >
                  Next
                </Button>
              </HStack>
            </VStack>
          </FormControl>
        )}
      </VStack>
    </>
  );
};

export default SeedPhraseManager;
