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
  // const faceio = new faceIO("fioa1cfa");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [copied, setCopied] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  // const [faceIO,setFaceIO]=useState();
  const [faceIoObject, setFaceIoObect] = useState();
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
      // faceioInstance = new faceIO("fioab466");

      faceioInstance = new faceIO("fioa1cfa");
      console.log(faceioInstance);
      // faceioInstance = new faceIO("fioab466");
    }
  };

  const handleRegister = async () => {
    console.log("Handle face auth")
    let faceio;
    if (!faceIoObject) {
      faceio = new faceIO("fioa1cfa")
      setFaceIoObect(faceio);
    } else {
      faceio = faceIoObject;
    }
    // const faceio=faceioInstance
    console.log(faceioInstance);
    console.log(faceio);
    faceio.enroll({
      "locale": "auto", // Default user locale
      "userConsent": false, // Set to true if you have already collected user consent
      "payload": {
        /* The payload we want to associate with this particular user
        * which is forwarded back to us on each of his future authentication...
        */
        "whoami": 123456, // Example of dummy ID linked to this particular user
        "email": "john.doe@example.com"
      }
    }).then(userInfo => {
      // User Successfully Enrolled!
      alert(
        `User Successfully Enrolled! Details:
			Unique Facial ID: ${userInfo.facialId}
			Enrollment Date: ${userInfo.timestamp}
			Gender: ${userInfo.details.gender}
			Age Approximation: ${userInfo.details.age}`
      );
      console.log(userInfo);
      // handle success, save the facial ID, redirect to dashboard...
    }).catch(errCode => {
      // handle enrollment failure. Visit:
      // https://faceio.net/integration-guide#error-codes
      // for the list of all possible error codes
      handleError(errCode);

      // If you want to restart the session again without refreshing the current TAB. Just call:
      faceio.restartSession();
      // restartSession() let you enroll the same user again (in case of failure)
      // without refreshing the entire page.
      // restartSession() is available starting from the PRO plan and up, so think of upgrading your app
      // for user usability.
    });
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
  function handleLogin() {
    console.log("Login");
    let faceio;
    if (!faceIoObject) {
      faceio = new faceIO("fioa1cfa")
      setFaceIoObect(faceio);
    } else {
      faceio = faceIoObject;
    }
    faceio.authenticate({
      "locale": "auto" // Default user locale
    }).then(userData => {
      console.log("Success, user recognized")
      // Grab the facial ID linked to this particular user which will be same
      // for each of his successful future authentication. FACEIO recommend
      // that your rely on this ID if you plan to uniquely identify
      // all enrolled users on your backend for example.
      console.log("Linked facial Id: " + userData.facialId)
      // Grab the arbitrary data you have already linked (if any) to this particular user
      // during his enrollment via the payload parameter the enroll() method takes.
      console.log("Associated Payload: " + JSON.stringify(userData.payload))
      // {"whoami": 123456, "email": "john.doe@example.com"} set via enroll()
    }).catch(errCode => {
      // handle authentication failure. Visit:
      // https://faceio.net/integration-guide#error-codes
      // for the list of all possible error codes
      handleError(errCode);

      // If you want to restart the session again without refreshing the current TAB. Just call:
      faceio.restartSession();
      // restartSession() let you authenticate the same user again (in case of failure) 
      // without refreshing the entire page.
      // restartSession() is available starting from the PRO plan and up, so think of upgrading your app
      // for user usability.
    });
  }
  function handleError(errCode) {
    // Log all possible error codes during user interaction..
    // Refer to: https://faceio.net/integration-guide#error-codes
    // for a detailed overview when these errors are triggered.
    switch (errCode) {
      case fioErrCode.PERMISSION_REFUSED:
        console.log("Access to the Camera stream was denied by the end user");
        break;
      case fioErrCode.NO_FACES_DETECTED:
        console.log("No faces were detected during the enroll or authentication process");
        break;
      case fioErrCode.UNRECOGNIZED_FACE:
        console.log("Unrecognized face on this application's Facial Index");
        break;
      case fioErrCode.MANY_FACES:
        console.log("Two or more faces were detected during the scan process");
        break;
      case fioErrCode.FACE_DUPLICATION:
        console.log("User enrolled previously (facial features already recorded). Cannot enroll again!");
        break;
      case fioErrCode.PAD_ATTACK:
        console.log("Presentation (Spoof) Attack (PAD) detected during the scan process");
        break;
      case fioErrCode.FACE_MISMATCH:
        console.log("Calculated Facial Vectors of the user being enrolled do not matches");
        break;
      case fioErrCode.WRONG_PIN_CODE:
        console.log("Wrong PIN code supplied by the user being authenticated");
        break;
      case fioErrCode.PROCESSING_ERR:
        console.log("Server side error");
        break;
      case fioErrCode.UNAUTHORIZED:
        console.log("Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information");
        break;
      case fioErrCode.TERMS_NOT_ACCEPTED:
        console.log("Terms & Conditions set out by FACEIO/host application rejected by the end user");
        break;
      case fioErrCode.UI_NOT_READY:
        console.log("The FACEIO Widget could not be (or is being) injected onto the client DOM");
        break;
      case fioErrCode.SESSION_EXPIRED:
        console.log("Client session expired. The first promise was already fulfilled but the host application failed to act accordingly");
        break;
      case fioErrCode.TIMEOUT:
        console.log("Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)");
        break;
      case fioErrCode.TOO_MANY_REQUESTS:
        console.log("Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications");
        break;
      case fioErrCode.EMPTY_ORIGIN:
        console.log("Origin or Referer HTTP request header is empty or missing");
        break;
      case fioErrCode.FORBIDDDEN_ORIGIN:
        console.log("Domain origin is forbidden from instantiating fio.js");
        break;
      case fioErrCode.FORBIDDDEN_COUNTRY:
        console.log("Country ISO-3166-1 Code is forbidden from instantiating fio.js");
        break;
      case fioErrCode.SESSION_IN_PROGRESS:
        console.log("Another authentication or enrollment session is in progress");
        window.location.reload();
        break;
      case fioErrCode.NETWORK_IO:
      default:
        console.log("Error while establishing network connection with the target FACEIO processing node");
        break;
    }
  }

  return (
    <>
      {/* <script src="https://cdn.faceio.net/fio.js"></script>
      <script type="text/javascript"></script> */}
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
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
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
