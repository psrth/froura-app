import { IconButton } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Divider, Flex, Text } from "@chakra-ui/layout";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/table";

function App() {
  const [show, setShow] = useState(false);

  return (
    <Flex
      flexDir="row"
      height="100vh"
      width="100vw"
      bg="#F4F4F4"
      padding="30px 50px"
    >
      {/* LEFT COLUMN */}
      <Flex flexDir="column" width="40%" height="fit-content">
        <Image src="https://i.imgur.com/wjRdp6k.png" width="150px" />

        {/* CARDS SECTION */}
        <Flex flexDir="column" mt="30px">
          <Text color="#3B3B3B" fontWeight="700" fontSize="22px">
            Overview
          </Text>
          <Flex
            flexDir="column"
            bg="#002A48"
            borderRadius="15px"
            width="100%"
            p="30px 30px"
            zIndex="20"
            mt="10px"
          >
            <Text color="white">wallet balance</Text>
            <Flex
              flexDir="row"
              width="100%"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Text
                color="white"
                fontSize="64px"
                fontWeight="800"
                lineHeight="1"
                mb="0"
                mt="80px"
              >
                $439.20
              </Text>

              <IconButton
                borderRadius="100%"
                icon={<FiPlus boxSize="24px" />}
                bg="white"
                boxSize="30px"
              />
            </Flex>
          </Flex>
          <Flex
            flexDir="row"
            bg="#7A8F9E"
            zIndex="0"
            borderRadius="0 0 15px 15px"
            width="100%"
            p="20px 30px"
            mt="-10px"
          >
            <Text color="white">secret override code:</Text>
            <Text
              color="white"
              ml="10px"
              fontWeight="800"
              onClick={() => setShow(!show)}
              cursor="pointer"
            >
              {show ? "DUBIOUS TIGER" : "***********"}
            </Text>
          </Flex>
        </Flex>
        {/* END CARDS SECTION */}

        {/* TABLE SECTION */}
        <Flex flexDir="column" mt="50px">
          <Text color="#3B3B3B" fontWeight="700" fontSize="22px">
            Recent Transactions
          </Text>
          {transactions.map((tr, id) => (
            <Flex flexDir="column" cursor="pointer">
              <Flex
                width="100%"
                height="1px"
                bg="black"
                opacity="0.2"
                m="10px 0"
              />
              <Flex flexDir="row" width="100%" justifyContent="space-between">
                <Text fontSize="18px" fontWeight="500">
                  {tr.title}
                </Text>
                <Text fontSize="18px" fontWeight="800">
                  ${tr.amount}
                </Text>
              </Flex>
              <Text color="#5D5D5D">
                {tr.payee}, {tr.time}
              </Text>
            </Flex>
          ))}
          <Flex width="100%" height="1px" bg="black" opacity="0.2" m="10px 0" />
        </Flex>
      </Flex>
      {/* END LEFT COLUMN */}
    </Flex>
  );
}

export default App;

const transactions = [
  {
    id: 1,
    title: "Cheeseburger and Fries",
    payee: "McDonald's",
    amount: "12.99",
    time: "2 days ago",
  },
  {
    id: 1,
    title: "Cheeseburger and Fries",
    payee: "McDonald's",
    amount: "12.99",
    time: "2 days ago",
  },
  {
    id: 1,
    title: "Cheeseburger and Fries",
    payee: "McDonald's",
    amount: "12.99",
    time: "2 days ago",
  },
];
