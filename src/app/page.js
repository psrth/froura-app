"use client";

import {
  Button,
  Flex,
  Image,
  Input,
  Text,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = () => {
    if (email === "demo@ycombinator.com" && password === "Abcd1234!")
      window.location = "/dashboard";
    else {
      toast({
        title: "Login failed.",
        description: "Please check your password..",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Flex
        flexDir="row"
        height="100vh"
        width="100vw"
        bg="#F4F4F4"
        padding="30px 50px"
        justifyContent="space-between"
      >
        <Flex
          flexDir="column"
          bg="white"
          padding="40px"
          borderRadius="20px"
          m="auto"
          width="500px"
        >
          <Flex flexDir="column">
            <Image src="https://i.imgur.com/wjRdp6k.png" width="150px" />
            <Text mt="30px" fontSize="32px" fontWeight="600">
              login
            </Text>
            <Text mb="20px" fontSize="22px">
              welcome back to froura.
            </Text>
            <Text mt="15px">email address</Text>
            <Input
              mt="5px"
              placeholder="john.doe@example.com"
              size="md"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Text mt="15px">password</Text>
            <InputGroup mt="5px" size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button mt="40px" onClick={loginHandler}>
              Login
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
