import { Box, Button, HStack, Img, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { getMinimalAddress } from "./AccountInstance";
import { capitalize } from "../api/Utilities";

function TransactionInstance({ asset, onClick }) {
  if (!asset) return <></>;
  return (
    <HStack
      key={asset.toString()}
      width={"40vw"}
      borderRadius={"5px"}
      bg={"white"}
      color={"black"}
      spacing={10}
      padding={"10px"}
    >
      <Box bg={"black"} color={"white"} borderRadius={"50%"} padding={"10px"}>
        {asset.asset === null ? capitalize(asset.category) : asset.asset}
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
        <Button onClick={onClick} colorScheme={"cyan"}>
          View Details
        </Button>
      </div>
    </HStack>
  );
}

export default TransactionInstance;
