import { Image } from "@chakra-ui/image";
import { Flex, Text } from "@chakra-ui/layout";
import { useState } from "react";

function App() {
  return (
    <Flex
      flexDir="row"
      height="100vh"
      width="100vw"
      bg="#F4F4F4"
      padding="30px 50px"
    >
      <Flex flexDir="column" width="40%" height="fit-content">
        <Image src="https://i.imgur.com/wjRdp6k.png" width="150px" />

        <Flex flexDir="column">
          <Text>Overview</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
