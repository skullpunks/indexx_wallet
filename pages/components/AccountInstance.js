import { Button, Heading, HStack, Img, Text, useClipboard, VStack } from "@chakra-ui/react";
import copy from "copy-to-clipboard";
import { useEffect, useState } from "react";
export function getMinimalAddress(_address, upperLimit = 36) {
  let minAddress =
    _address?.toString().slice(0, 8) +
    "..." +
    _address?.toString().slice(upperLimit);
  return minAddress;
}
function AccountInstance({
  account,
  selector,
  color,
  hover_bg,
  size,
  copyable,
  showDetails,
  chain
}) {
  const [showCopy, setShowCopy] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [explorerURL, setExplorerURL] = useState("");
  const placeholder = "text to be copied...";

  const { onCopy, value, setValue, hasCopied } = useClipboard(account?.privateKey);
  const { onCopy2, value2, setValue2, hasCopied2 } = useClipboard(account?.address);
  //setValue(account?.privateKey)
  console.log("account", account)

  useEffect(()  => {
    if(String(chain).localeCompare("bitcoinTestNet") === 0) {
      setExplorerURL("https://live.blockcypher.com/btc-testnet/address/" + account?.address);
    } else if(String(chain).localeCompare("bitcoin") ===0 ) {
      setExplorerURL("https://live.blockcypher.com/btc/address/" + account?.address);
    } else if(String(chain).localeCompare("mainnet") === 0) {
      setExplorerURL("https://etherscan.io/address/" + account?.address);
    } else if(String(chain).localeCompare("goerli") === 0) {
      setExplorerURL("https://goerli.etherscan.io/address/" + account?.address);
    } else if(String(chain).localeCompare("bscMainNet") === 0) {
      setExplorerURL("https://bscscan.com/address/" + account?.address);
    } else if(String(chain).localeCompare("bscTestNet") === 0) {
      setExplorerURL("https://testnet.bscscan.com/address/" + account?.address);
    }

    // setValue(account?.privateKey)
    // setValue2(account?.address)
  }, [])
  if (!account) return <></>;
  return (
    <>
      <>
        <HStack
          key={account?.address}
          onClick={() => {
            if (!isCopied && copyable) {
              console.log("copying...");
              copy(account.address);
              setIsCopied(true);
            }
            selector(account);
          }}
          onMouseOver={() => {
            copyable ? showCopy == false && setShowCopy(true) : "";
            // console.log("copy");
          }}
          onMouseLeave={() => {
            copyable ? showCopy == true && setShowCopy(false) : "";
            // console.log("copy");
          }}
          _hover={{
            bg: hover_bg ? hover_bg : "rgba(0,0,0,0.1)",
            color: "white",
            cursor: "pointer",
          }}
          padding={size == "sm" ? "5px" : "20px"}
          spacing={5}
          borderRadius={"10px"}
        >
          {!copyable && (
            <Img
              height={size == "sm" ? "20px" : "20px"}
              // borderRadius={"50%"}
              src={"./new_indexx_wallet1.PNG"}
            />
          )}

          <VStack>
            <Heading
              fontSize={size == "sm" ? "12px" : "20px"}
              color={color ? color : "black"}
            >
              {account?.name}
            </Heading>
            <Text
              fontSize={size == "sm" ? "14px" : "18px"}
              color={color ? color : "black"}
            >
              {getMinimalAddress(account?.address)}
            </Text>
          </VStack>
          {showCopy == true && (
            <Text
              position={"absolute"}
              top={"35vh"}
              fontSize={"12px"}
              color={"black"}
              bg={"white"}
              borderRadius={"10px"}
              padding={"5px"}
            >
              {isCopied ? "Copied" : "Copy to Clipboard"}
            </Text>
          )}


        </HStack>
        {showDetails &&
        <> 
          <Button
            _hover={{ bg: "transparent" }}
            bg={"transparent"}
            onClick={() => setShowAccountDetails(true)}
            style={{ color: "black" }}
          >
            Show Account Details
          </Button> 
          <Button
            _hover={{ bg: "transparent" }}
            bg={"transparent"}
            onClick={() => window.open(explorerURL)}
            style={{ color: "black" }}
          >
            View Account on Explorer
          </Button>
        </>
        }
      </>
      {showAccountDetails && (
        <>
          <Text style={{ color: "black", fontSize: "small" }}>
            <b>Address:</b> {account?.address}
            <Button onClick={onCopy2}>{hasCopied2 ? "Copied!" : "Copy"}</Button> <br></br>
            <b>Private Key:</b> {account?.privateKey}  <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button>
          </Text>

          <br></br>
          <br></br>

          {/* <Button
            style={{ width: "270px" }}
            colorScheme={"red"}
            onClick={() => window.open("https://google.com")}
          >
            Import Account
          </Button> */}
          {/* <ModalWrapper>
            <VStack
              height={"75vh"}
              position={"absolute"}
              zIndex={2}
              bg={"white"}
              width={"40vw"}
              borderRadius={"20px"}
              paddingTop={"5vh"}
            >
              <Text>
                <b>Address:</b> {account?.address}
                <b>Private Key</b> {account?.privateKey}
              </Text>

              <br></br>
              <br></br>
              <Button
                style={{ width: "270px" }}
                colorScheme={"red"}
                onClick={() => setShowAccountDetails(false)}
              >
                Close
              </Button>
            </VStack>
          </ModalWrapper> */}
        </>

      )}
    </>
  );
}

export default AccountInstance;
