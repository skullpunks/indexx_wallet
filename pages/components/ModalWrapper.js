import { Center, Img } from "@chakra-ui/react";
import React from "react";

function ModalWrapper(props) {
  let Children = props?.children;

  return (
    <>
    
      <Center
        height={"max-content"}
        // bg={"rgba(0,0,0,0.4)"}
        bg={"white"}
        position={"absolute"}
        width={"98vw"}
        top={"0"}
        left={"0"}
        paddingBottom={"450px"}
      >
        {Children}
      </Center>
    </>
  );
}

export default ModalWrapper;
