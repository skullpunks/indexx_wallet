import { Box, Button, HStack, IconButton, Image, Img, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getMinimalAddress } from "./AccountInstance";
import { capitalize } from "../api/Utilities";
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import axios from "axios";
Moralis.start({
  apiKey: '4uNCwknwfDf2GaE6Zm8TWQK5qRcH5QOOxQJCf6GibK1jSUS6ctI9pgGzKBpug5q6',
  // ...and any other configuration
});
function NFTsInstance({ asset, selectedChain }) {
  const [explorerURL, setExplorerURL] = useState("");
  const [chain, setChain] = useState();
  const [IPFSURL, setIPFSURL] = useState();
  const [NFTname, setNFTname] = useState();
  const [OrgNFTname, setOrgNFTname] = useState();
  const [openseaURL, setOpenseaURL] = useState();
  const [openseaBaseURL, setOpenseaBaseURL] = useState();

  useEffect(() => {
    //Filter asset arr with property having both erc721 and erc1155
    console.log(asset, 'in nft')
    //asset = asset.filter((item) => (item.category === "erc1155" || item.category === "erc721"));
    if (String(selectedChain).localeCompare("bitcoinTestNet") === 0) {
      setExplorerURL("https://live.blockcypher.com/btc-testnet/tx/" + asset?.hash);
      //setChain()
    } else if (String(selectedChain).localeCompare("bitcoin") === 0) {
      setExplorerURL("https://live.blockcypher.com/btc/tx/" + asset?.hash);
    } else if (String(selectedChain).localeCompare("mainnet") === 0) {
      setExplorerURL("https://etherscan.io/tx/" + asset?.hash);
      setChain(EvmChain.ETHEREUM);
      setOpenseaBaseURL("https://opensea.io/assets/ethereum");
    } else if (String(selectedChain).localeCompare("goerli") === 0) {
      setExplorerURL("https://goerli.etherscan.io/tx/" + asset?.hash);
      setChain(EvmChain.GOERLI);
      setOpenseaBaseURL("https://testnets.opensea.io/assets/goerli");
    } else if (String(selectedChain).localeCompare("bscMainNet") === 0) {
      setExplorerURL("https://bscscan.com/tx/" + asset?.hash);
      setChain(EvmChain.BSC);
    } else if (String(selectedChain).localeCompare("bscTestNet") === 0) {
      setExplorerURL("https://testnet.bscscan.com/tx/" + asset?.hash);
      setChain(EvmChain.BSC_TESTNET);
    }

  }, [])

  const getNFTdata = async (contractAddress, NFTTokenId, chainData) => {
    try {

      const res = await axios.get(`https://deep-index.moralis.io/api/v2/nft/${contractAddress}/${NFTTokenId}?chain=goerli&format=decimal`, {
        headers: {
          Accept: "application/json",
          "X-API-Key": '4uNCwknwfDf2GaE6Zm8TWQK5qRcH5QOOxQJCf6GibK1jSUS6ctI9pgGzKBpug5q6'
        }
      });
      console.log(res.data)
      setNFTname(res.data.name)
      const resIPFS = await axios.get(res.data.token_uri)
      console.log(resIPFS.data)
      const nftImage = resIPFS.data.image.replace("://", '/');
      console.log(nftImage)
      setIPFSURL('https://ipfs.io/' + nftImage)
      setOrgNFTname(resIPFS.data.name);
      setOpenseaURL(`${openseaBaseURL}/${contractAddress}/${NFTTokenId}`)
      return;
      // const response = await Moralis.EvmApi.nft.getNFTMetadata({
      //   address,
      //   chain,
      //   tokenId,
      // });

      // console.log(response?.result);
    } catch (e) {
      console.error(e);
    }

  }
  if (!asset) {
    return <></>
  } else if ((asset?.category === "internal" || asset?.category === "external" || asset?.category === "erc20")) {
    return <></>;
  }
  else {
    console.log('asset', asset?.category, selectedChain)
    console.log('cADD', asset?.rawContract?.address)
    console.log('cADD', asset?.tokenId, parseInt(asset?.tokenId, 16), chain)
    if (chain !== undefined) {
      getNFTdata(asset?.rawContract?.address, parseInt(asset?.tokenId, 16), chain)
    }
  };
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
        {NFTname}
      </Box>

      <VStack align={"left"}>
        <HStack justify={"center"} width={"15vw"} spacing={5}>
          <Img
            src={IPFSURL}
            alt="down arrow"
          />
          <Text textDecoration={"underline"}>
            {OrgNFTname}
          </Text>
        </HStack>
      </VStack>
      <div
      // style={{
      //   marginLeft: "185px"
      // }}
      >
        {/* <Button onClick={() => window.open(explorerURL)} colorScheme="brand">
          View Details
        </Button> */}


        <IconButton
          icon={<Image
            src={"./scan1.png"} width={"30px"} height={"30px"} />}
          onClick={() => window.open(explorerURL)}
        //onClick={() => <BuyMethods buyMethods={buyMethods}/>}
        />

        <IconButton
          icon={<Image src={"./opensea.png"} width={"30px"} height={"30px"} />}
          onClick={() => window.open(openseaURL)}
        //onClick={() => <BuyMethods buyMethods={buyMethods}/>}
        />
      </div>
    </HStack>
  );
}

export default NFTsInstance;
