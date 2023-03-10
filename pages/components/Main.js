import { Box, Button, Center, Img, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AccountManager from "./AccountManager";
import Congrats from "./Congrats";
import SeedPhraseManager from "./SeedPhraseGenerator";
import Unlock from "./Unlock";

function Main() {
  const [unlocked, setUnlocked] = useState(false);
  const [mnemonic, setMnemonic] = useState(null);
  const [allDone, setAllDone] = useState(false);
  const [hiddenCongrats, setHiddenCongrats] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);
  useEffect(() => {
    let _mnemonic = localStorage.getItem("mnemonic");
    if (_mnemonic && _mnemonic !== "null") {
      setMnemonic(_mnemonic);
    }
    console.log(allDone)
  }, []);



  async function doneClicked() {
    console.log('I am here')
    setAllDone(true);
    setHiddenCongrats(false);
  };

  return (
    // <Center>
    //   <Box
    //     color={"white"}
    //     bg={"black"}
    //     width={"50vw"}
    //     height={"90vh"}
    //     padding={"20px"}
    //     borderRadius={"20px"}
    //     overflowY={"scroll"}
    //     sx={{
    //       "::-webkit-scrollbar": {
    //         display: "none",
    //       },
    //     }}
    //   >
    <>
      {!mnemonic ? (
        <SeedPhraseManager />
      ) : !unlocked ? (
        <Unlock unlocker={setUnlocked} firstTime={setIsFirstTime} />
      ) : ((unlocked && isFirstTime && hiddenCongrats) &&
        <VStack
          width={"100%"}
          height={"75vh"}
          justify={"center"}>
          <Img
            src={"./art1.png"} />
          <p>Congratulations!</p>
          <p>You just created an account! </p>
          <Button
            style={{ width: "200px" }}
            colorScheme="brand"
            onClick={doneClicked}
          >
            All done
          </Button>
        </VStack>)
      }
      {((allDone && isFirstTime) &&
        <Box>
          (<AccountManager mnemonic={mnemonic} />)
        </Box>
      )}
      {((unlocked && !isFirstTime) &&
        <Box>
          (<AccountManager mnemonic={mnemonic} />)
        </Box>
      )}
    </>
    //   </Box>
    // </Center>
  );
}

export default Main;
