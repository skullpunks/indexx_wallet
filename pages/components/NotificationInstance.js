import { Box, Button, Checkbox, HStack, Img, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getMinimalAddress } from "./AccountInstance";
import { capitalize } from "../api/Utilities";
import { roundToTwoNonZero } from "../api/Transaction";

// function NotificationInstance({  id, isChecked, handleCheckboxChange }) {
// function NotificationInstance({ asset, selectedChain, id, isChecked, handleCheckboxChange }) {
function NotificationInstance({ asset, selectedChain, countOfUnreadNotifications, setCountOfUnreadNotifications }) {
  // console.log(id,isChecked);
  const [explorerURL, setExplorerURL] = useState("");
  
  useEffect(() => {
    if (String(selectedChain).localeCompare("bitcoinTestNet") === 0) {
      setExplorerURL("https://live.blockcypher.com/btc-testnet/tx/" + asset?.hash);
    } else if (String(selectedChain).localeCompare("bitcoin") === 0) {
      setExplorerURL("https://live.blockcypher.com/btc/tx/" + asset?.hash);
    } else if (String(selectedChain).localeCompare("mainnet") === 0) {
      setExplorerURL("https://etherscan.io/tx/" + asset?.hash);
    } else if (String(selectedChain).localeCompare("goerli") === 0) {
      setExplorerURL("https://goerli.etherscan.io/tx/" + asset?.hash);
    } else if (String(selectedChain).localeCompare("bscMainNet") === 0) {
      setExplorerURL("https://bscscan.com/tx/" + asset?.hash);
    } else if (String(selectedChain).localeCompare("bscTestNet") === 0) {
      setExplorerURL("https://testnet.bscscan.com/tx/" + asset?.hash);
    }
  }, []);
  if (!asset) {
    return <></>;
  } else {
    console.log("asset", asset);
  }
  return (
    <HStack key={asset.hash.toString()} width={"max-content"} borderRadius={"5px"} bg={"white"} color={"black"} spacing={10} padding={"15px"} justify={"space-between"}>
      <Box bg={"black"} color={"white"} borderRadius={"50%"} padding={"10px"}>
        {String(selectedChain).localeCompare("goerli") === 0 || String(selectedChain).localeCompare("mainnet") === 0
          ? asset.asset === null
            ? String(asset.category).toUpperCase()
            : asset.asset
          : asset.contractAddress === ""
          ? "BNB"
          : "BEP20"}
      </Box>

      <VStack align={"left"}>
        <Text fontWeight={"700"}> {getMinimalAddress(asset.from)}</Text>
        <HStack justify={"center"} width={"15vw"} spacing={5}>
          <Img height={5} src="https://png.pngtree.com/png-vector/20190419/ourmid/pngtree-vector-down-arrow-icon-png-image_956433.jpg" alt="down arrow" />
          <Text textDecoration={"underline"}>{asset.value ? asset.value : 0 }</Text>
        </HStack>
        <Text fontWeight={"700"}>{getMinimalAddress(asset.to)}</Text>
      </VStack>
      {/* todo */}
      <Checkbox
        size="lg"
        colorScheme="blue"
        defaultChecked={asset.isChecked}
        onChange={(event) => {
          console.log("check: ", event.target.checked);

          const curCountOfUnreadNotifications = countOfUnreadNotifications[selectedChain];
          if (event.target.checked)
            setCountOfUnreadNotifications({
              ...countOfUnreadNotifications,
              [selectedChain]: curCountOfUnreadNotifications - 1,
            });
          else setCountOfUnreadNotifications({ ...countOfUnreadNotifications, [selectedChain]: curCountOfUnreadNotifications + 1 });
          // console.log("notificaitons netw in noti", selectedChain, countOfUnreadNotifications);

          let checkBoxVals = localStorage.getItem("checkBoxVal");
          checkBoxVals = JSON.parse(checkBoxVals);
          checkBoxVals[asset.hash] = event.target.checked;
          // console.log("Notificaiton setting: ", checkBoxVals);
          localStorage.setItem("checkBoxVal", JSON.stringify(checkBoxVals));
          // console.log("Notificaiton setted: ", localStorage.getItem("checkBoxVal"));

          // console.log("Notificaiton check Prev: ", curCountOfUnreadNotifications);
          // }
        }}
      >
        Seen
      </Checkbox>
      {/* <Checkbox key={id} id={id} isChecked={isChecked} onChange={handleCheckboxChange}>
       seen
      </Checkbox> */}
      <Button width={"max-content"} onClick={() => window.open(explorerURL)} colorScheme="brand">
        View Details
      </Button>
      {/* <div
      // style={{
      //   marginLeft: "185px"
      // }}
      >
        <Button onClick={() => window.open(explorerURL)} colorScheme="brand">
          View Details
        </Button>
      </div> */}
    </HStack>
  );
}

export default NotificationInstance;
