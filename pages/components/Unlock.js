import {
  Box,
  Button,
  Heading,
  Img,
  Input,
  useToast,
  VStack,
  Checkbox, CheckboxGroup
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

function Unlock({ unlocker, firstTime }) {
  const [password, setPassword] = useState("");
  const [confirmingPassword, setConfirmingPassword] = useState(null);
  const [originalPassword, setOriginalPassword] = useState(null);
  const toast = useToast();
  const [checkedItems, setCheckedItems] = useState([false, false]);

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked
  function Toast(message) {
    toast({
      title: message.title,
      description: message.description,
      status: message.type,
      duration: 2000,
      isClosable: true,
    });
  }

  async function unlock() {
    console.log(allChecked)

    if (!originalPassword && password != confirmingPassword) {
      if (!allChecked) {
        Toast({
          title: `Authentication Error`,
          description: `Please agree to the Terms of Use`,
          type: "error",
        });

        return 0;
      }
      Toast({
        title: `Authentication Error`,
        description: `Passwords do not match!`,
        type: "error",
      });

      return 0;
    } else if (password === originalPassword || !originalPassword) {
      if (!originalPassword) localStorage.setItem("password", password);
      Toast({
        title: `Authentication Success`,
        description: `You are Authenticated`,
        type: "success",
      });

      unlocker(true);

    } else {
      Toast({
        title: `Authentication Error`,
        description: `Password is incorrect`,
        type: "error",
      });

      return 0;
    }
  }
  useEffect(() => {
    let _pass = localStorage.getItem("password");
    if (!_pass || _pass == "null") {
      setOriginalPassword(null);
      // localStorage.setItem("password",password);
    } else {
      setOriginalPassword(_pass);
    }
  }, []);

  return (
    <VStack
      paddingTop={"20vh"}
      width={"100%"}
      height={"80%"}
      justify={"space-between"}
    >
      <VStack spacing={5}
        width={"100%"}
        height={"80%"}
        justify={"center"}>
        <Img
          // height={"100px"}
          width={"300px"}
          // borderRadius={"50%"}
          src={"./blue-wallet-expanded.png"}
        />
        {!originalPassword ? <Heading fontSize={"24px"}>Create Password</Heading>
          :
          <Heading fontSize={"24px"}>Password</Heading>
        }
      </VStack>

      <VStack spacing={10}>
        <Input
          width={"100%"}
          border={"1px solid grey"}
          colorScheme="brand"
          placeholder={(!originalPassword ? "New password (8 Characters min)" : "Password")}
          type={"password"}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!originalPassword && (
          <>
            <Input
              width={"100%"}
              border={"1px solid grey"}
              colorScheme="brand"
              placeholder={"Confirm Password"}
              type={"password"}
              onChange={(e) => {
                setConfirmingPassword(e.target.value)
                firstTime(true)
              }
              }
            />
            <Checkbox
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}>I have read and agree to the Terms of Use</Checkbox>
          </>
        )}

        <Button style={{ width: "270px" }} onClick={unlock} colorScheme="brand">
          Unlock
        </Button>
      </VStack>
    </VStack>
  );
}

export default Unlock;
