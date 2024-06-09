"use client";

import {
  IconButton,
  Button,
  Image,
  Modal,
  Box,
  Flex,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Avatar,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function Home() {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);

  const UserMessage = (props) => {
    return (
      <Flex flexDir="row" mt="20px">
        <Avatar
          src={props.img}
          name={props.name}
          boxSize="30px"
          borderRadius="200px"
          mr="20px"
        />
        <Flex flexDir="column">
          <Text fontSize="16px" fontWeight="600" color="#002A48">
            {props.name}
          </Text>
          <Text fontWeight="400" fontSize="18px" color="#526C7F">
            {props.msg}
          </Text>
        </Flex>
      </Flex>
    );
  };

  const AgentMessage = (props) => {
    return (
      <Flex flexDir="row" mt="20px">
        <Avatar bg="#002A48" boxSize="30px" borderRadius="200px" mr="20px" />
        <Flex flexDir="column">
          <Text fontSize="16px" fontWeight="600" color="#002A48">
            {props.name}
          </Text>
          <Text fontWeight="400" fontSize="18px" color="#526C7F">
            {props.msg}
          </Text>
          <Flex flexDir="column" p="20px">
            {props.steps.map((st, k) => (
              <Flex flexDir="row" m="5px 0" alignItems="center">
                <Box
                  bg="green"
                  height="20px"
                  width="20px"
                  borderRadius="100%"
                  mr="10px"
                ></Box>
                <Text color="#526C7F">{st.text}</Text>
              </Flex>
            ))}
          </Flex>
          <Text fontWeight="400" fontSize="18px" color="#526C7F">
            {props.msg_conf}
          </Text>
        </Flex>
      </Flex>
    );
  };

  const updateMessages = (newMessages) => {
    setMessages([...messages, ...newMessages]);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

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
                  icon={<FiPlus boxSize="20px" />}
                  bg="white"
                  height="30px"
                  width="30px"
                  maxH="30px"
                  maxW="30px"
                  minW="30px"
                  onClick={onOpen}
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
                  bg="#526C7F"
                  opacity="0.2"
                  m="10px 0"
                />
                <Flex flexDir="row" width="100%" justifyContent="space-between">
                  <Text fontSize="16px" fontWeight="400">
                    {tr.title}
                  </Text>
                  <Text fontSize="16px" fontWeight="600">
                    ${tr.amount}
                  </Text>
                </Flex>
                <Text color="#5D5D5D" fontSize="14px">
                  {tr.payee}, {tr.time}
                </Text>
              </Flex>
            ))}
            <Flex
              width="100%"
              height="1px"
              bg="black"
              opacity="0.2"
              m="10px 0"
            />
          </Flex>
        </Flex>
        {/* END LEFT COLUMN */}

        {/* RIGHT COLUMN */}
        <Flex
          flexDir="column"
          width="55%"
          bg="white"
          height="90vh"
          borderRadius="20px"
          boxShadow="sm"
          padding="40px 80px"
          justifyContent="space-between"
        >
          <Flex flexDir="column">
            <Text fontSize="20px" fontWeight="400" color="#526C7F">
              froura assistant
            </Text>
            <Flex
              width="100%"
              height="1px"
              bg="#526C7F"
              opacity="0.2"
              m="10px 0"
            />
            <Flex
              flexDir="column"
              height="fit-content"
              maxHeight="65vh"
              overflow="scroll"
            >
              {messages.map((m, e) => (
                <>
                  {m.type === "user" ? (
                    <UserMessage img={m.img} name={m.name} msg={m.msg} />
                  ) : null}
                  {m.type === "agent" ? (
                    <AgentMessage
                      name={m.name}
                      msg={m.msg}
                      steps={m.steps}
                      msg_conf={m.msg_conf}
                    />
                  ) : null}
                </>
              ))}
            </Flex>
          </Flex>
          <Input
            padding="10px 20px"
            border="1px solid"
            borderColor="#CBD3D9"
            variant="outline"
            borderRadius="30px"
            placeholder="How can I help?"
            onClick={() =>
              updateMessages([
                {
                  type: "user",
                  name: "Parth Sharma",
                  img: "https://avatars.githubusercontent.com/u/45586386?v=4",
                  msg: "Can you order me a hamburger from McDonald’s?",
                },
                {
                  type: "agent",
                  name: "froura.ai",
                  msg: "Sure! Just give me a second to process that request. I’ll connect with Doordash and send you a request to approve the final payment.",
                  steps: [
                    {
                      text: "Connecting to DoorDash",
                      status: "Completed",
                    },
                    {
                      text: "Sending DoorDash order and customer details",
                      status: "Progress",
                    },
                    {
                      text: "Raising a payment request",
                      status: "Pending",
                    },
                    {
                      text: "Waiting for confirmation of payment receipt",
                      status: "Pending",
                    },
                  ],
                  msg_conf:
                    "Done! Your order is placed. It should arrive within 30 minutes.",
                },
              ])
            }
          />
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>hello</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

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
