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
    // simulate auth for now
    // URL parameter is unique froura ID
    if (email === "demo@ycombinator.com" && password === "Abcd1234!")
      window.location = "/lm1t7WMk4jTlbFAt";
    else if (email === "parthsharma151@gmail.com" && password === "Abcd1234!")
      window.location = "/h3WqBKDuBAVMMYSf";
    else if (email === "paramkapur2002@gmail.com" && password === "Abcd1234!")
      window.location = "/Tvd5l5of3dOJHLvH";
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
            <Text mt="30px" fontSize="32px" fontWeight="600" color="#002A48">
              login
            </Text>
            <Text mb="20px" fontSize="22px" color="#7A8F9E">
              welcome back to froura.
            </Text>
            <Text mt="15px" color="#7A8F9E">
              email address
            </Text>
            <Input
              mt="5px"
              placeholder="john.doe@example.com"
              size="md"
              onChange={(e) => setEmail(e.target.value)}
              color="#002A48"
            />
            <Text mt="15px" color="#7A8F9E">
              password
            </Text>
            <InputGroup mt="5px" size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                color="#002A48"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button mt="40px" onClick={loginHandler} bg="#002A48" color="white">
              Login
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
