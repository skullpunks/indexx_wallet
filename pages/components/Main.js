import { Box, Center } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AccountManager from "./AccountManager";
import SeedPhraseManager from "./SeedPhraseGenerator";
import Unlock from "./Unlock";

function Main() {
  const [unlocked, setUnlocked] = useState(false);
  const [mnemonic, setMnemonic] = useState(null);
  useEffect(() => {
    let _mnemonic = localStorage.getItem("mnemonic");
    if (_mnemonic && _mnemonic !== "null") {
      setMnemonic(_mnemonic);
    }
  }, []);

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
          <Unlock unlocker={setUnlocked} />
        ) : (
          <Box>
            <AccountManager mnemonic={mnemonic} />
          </Box>
        )}
        </>
    //   </Box>
    // </Center>
  );
}

export default Main;
