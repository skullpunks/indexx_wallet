import { Box, Button, HStack, Img, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getMinimalAddress } from "./AccountInstance";
import { capitalize } from "../api/Utilities";

function NotificationInstance({ asset, selectedChain }) {
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

  }, [])
  if (!asset) {
    return <></> }
    else {
      console.log('asset', asset)
    } ;
  return (
    <HStack
      key={asset.hash.toString()}
      width={"40vw"}
      borderRadius={"5px"}
      bg={"white"}
      color={"black"}
      spacing={10}
      padding={"15px"}
      justify={"space-between"}
    >
      <Box bg={"black"} color={"white"} borderRadius={"50%"} padding={"10px"}>
        {(String(selectedChain).localeCompare("goerli") === 0 || String(selectedChain).localeCompare("mainnet") === 0) ?
          (asset.asset === null ? String(asset.category).toUpperCase() : asset.asset)
          : (asset.contractAddress === "" ? "BNB" : "BEP20")}
      </Box>

      <VStack align={"left"}>
        <Text fontWeight={"700"}> {getMinimalAddress(asset.from)}</Text>
        <HStack justify={"center"} width={"15vw"} spacing={5}>
          <Img
            height={5}
            src="https://png.pngtree.com/png-vector/20190419/ourmid/pngtree-vector-down-arrow-icon-png-image_956433.jpg"
            alt="down arrow"
          />
          <Text textDecoration={"underline"}>
            {asset.value ? asset.value : 0}
          </Text>
        </HStack>
        <Text fontWeight={"700"}>{getMinimalAddress(asset.to)}</Text>
      </VStack>
      <div
      // style={{
      //   marginLeft: "185px"
      // }}
      >
        <Button onClick={() => window.open(explorerURL)} colorScheme="brand">
          View Details
        </Button>
      </div>
    </HStack>
  );
}

export default NotificationInstance;
