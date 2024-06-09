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
  Avatar,
  Input,
  useDisclosure,
  Spinner,
  useToast,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiPlus, FiSend } from "react-icons/fi";
import moment from "moment";

export default function Home({ params }) {
  const toast = useToast();
  // -------
  // STATE
  // -------
  const [wallet, setWallet] = useState();
  const [transactions, setTransactions] = useState();
  const [deposit, setDeposit] = useState();
  const [dashTrigger, setDashTrigger] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [thread, setThread] = useState();

  // -------
  // AUTHORIZATION LOGIC
  // -------
  const slug = params.id;
  let token = "";

  if (slug === "lm1t7WMk4jTlbFAt")
    token = "6a8f8fd0ec2e17936d116080a735f0fb43e89628"; // YC token
  if (slug === "h3WqBKDuBAVMMYSf")
    token = "b678e62a6a777c58521347f7e4dd97d89276be57"; // Parth token
  if (slug === "Tvd5l5of3dOJHLvH")
    token = "5d9624c6e73b82888ba5dc01f5aae04b78d77840"; // Param token

  // -------
  // UTIL FUNCTIONS
  // -------
  function inUSD(amount) {
    let formattedAmount = (amount / 100).toFixed(2);
    return `$${formattedAmount}`;
  }

  function depositHandler() {
    depositMoney(deposit);
    setDashTrigger(dashTrigger + 1);
    onClose();
  }

  function sendUserMessage() {
    if (userMessage) {
      setMessages([
        ...messages,
        {
          type: "user",
          name: "Parth Sharma",
          img: "https://avatars.githubusercontent.com/u/45586386?v=4",
          msg: userMessage,
        },
      ]);
      let msgcontent = userMessage;
      setUserMessage("");
      postUserMessage(msgcontent);
    }
  }

  // -------
  // API FUNCTIONS
  // -------
  function getUserWallet() {
    fetch("https://api.froura.xyz/api/gateway/wallets/me/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
    })
      .then((response) =>
        response.json().then((data) => ({
          data: data,
          status: response.status,
        }))
      )
      .then((res) => {
        if (res.status < 300) {
          setWallet(res.data.balance);
        } else {
          toast({
            title: "An error occurred. Please try again.",
            position: "top-right",
            status: "error",
            isClosable: true,
          });
        }
      });
  }

  function getUserTransactions() {
    fetch("https://api.froura.xyz/api/gateway/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
    })
      .then((response) =>
        response.json().then((data) => ({
          data: data,
          status: response.status,
        }))
      )
      .then((res) => {
        if (res.status < 300) {
          setTransactions(res.data);
        } else {
          toast({
            title: "An error occurred. Please try again.",
            position: "top-right",
            status: "error",
            isClosable: true,
          });
        }
      });
  }

  function depositMoney(amount) {
    fetch("https://api.froura.xyz/api/gateway/transactions/deposit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        amount: amount * 100,
        transaction_type: "credit",
        description: "Manual deposit to wallet",
      }),
    })
      .then((response) =>
        response.json().then((data) => ({
          data: data,
          status: response.status,
        }))
      )
      .then((res) => {
        if (res.status < 300) {
          toast({
            title: "Money deposited in wallet successfully.",
            position: "top-right",
            status: "success",
            isClosable: true,
          });
        } else {
          toast({
            title: "An error occurred. Please try again.",
            position: "top-right",
            status: "error",
            isClosable: true,
          });
        }
      });
  }

  function postUserMessage(msgcontent) {
    fetch("https://api.froura.xyz/api/agent/assistant/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        message: msgcontent,
      }),
    })
      .then((response) =>
        response.json().then((data) => ({
          data: data,
          status: response.status,
        }))
      )
      .then((res) => {
        if (res.status < 300) {
          console.log(res.data);
        } else {
          toast({
            title: "An error occurred. Please try again.",
            position: "top-right",
            status: "error",
            isClosable: true,
          });
        }
      });
  }

  // -------
  // useEffect
  // -------
  useEffect(() => {
    getUserWallet();
    getUserTransactions();
  }, [dashTrigger]);

  // -------
  // MODAL LOGIC
  // -------
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(false);

  // -------
  // CHATBOT LOGIC
  // -------

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

  return (
    <>
      {wallet ? (
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
                    {inUSD(wallet)}
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
              {transactions ? (
                <Flex
                  flexDir="column"
                  height="35vh"
                  minH="35vh"
                  maxH="35vh"
                  overflow="scroll"
                >
                  {transactions
                    .slice()
                    .reverse()
                    .map((tr, id) => (
                      <Flex flexDir="column" cursor="pointer" key={id}>
                        <Flex
                          width="100%"
                          height="1px"
                          bg="#526C7F"
                          opacity="0.2"
                          m="10px 0"
                        />
                        <Flex
                          flexDir="row"
                          width="100%"
                          justifyContent="space-between"
                        >
                          <Text fontSize="16px" fontWeight="400">
                            {tr.description}
                          </Text>
                          <Text fontSize="16px" fontWeight="600">
                            {tr.transaction_type === "credit" ? "+" : "-"}
                            {inUSD(tr.amount)}
                          </Text>
                        </Flex>
                        <Text color="#5D5D5D" fontSize="14px">
                          {tr.transaction_type.toUpperCase()},{" "}
                          {moment(tr.timestamp).fromNow()}
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
              ) : (
                <Spinner />
              )}
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
            <InputGroup>
              <Input
                padding="10px 20px"
                border="1px solid"
                borderColor="#CBD3D9"
                variant="outline"
                borderRadius="30px"
                placeholder="How can I help?"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
              />
              <InputRightElement>
                <Icon as={FiSend} color="black" onClick={sendUserMessage} />
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Flex>
      ) : (
        <Spinner m="auto" />
      )}
      {/* <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent p="20px">
          <ModalHeader alignSelf="center" fontSize="22px">
            Payment Request Alert
          </ModalHeader>

          <ModalBody m="auto" textAlign="center" fontSize="18px">
            "froura assistant" has requested to spend $12.99 on DOORDASH-LLC for
            McChicken Burger at 8:46PM, 9th June, 2024.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose} width="50%">
              Approve
            </Button>
            <Button colorScheme="red" width="50%" onClick={onClose}>
              Deny
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent p="20px" borderRadius="20px">
          <ModalHeader fontSize="22px">Manual Deposits</ModalHeader>

          <ModalBody fontSize="16px">
            This is a sandbox that adds money to your froura wallet instead of
            using Stripe. Please enter an amount to add here:
            <InputGroup mt="20px">
              <InputLeftAddon>USD</InputLeftAddon>
              <Input
                type="number"
                onChange={(e) => setDeposit(e.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter mt="20px">
            <Button colorScheme="gray" mr={3} onClick={onClose} width="50%">
              Cancel
            </Button>
            <Button
              colorScheme="green"
              width="50%"
              onClick={depositHandler}
              isDisabled={!deposit}
            >
              Add Money
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// {
//   type: "agent",
//   name: "froura.ai",
//   msg: "Sure! Just give me a second to process that request. I’ll connect with Doordash and send you a request to approve the final payment.",
//   steps: [
//     {
//       text: "Connecting to DoorDash",
//       status: "Completed",
//     },
//     {
//       text: "Sending DoorDash order and customer details",
//       status: "Progress",
//     },
//     {
//       text: "Raising a payment request",
//       status: "Pending",
//     },
//     {
//       text: "Waiting for confirmation of payment receipt",
//       status: "Pending",
//     },
//   ],
//   msg_conf:
//     "Done! Your order is placed. It should arrive within 30 minutes.",
// },
