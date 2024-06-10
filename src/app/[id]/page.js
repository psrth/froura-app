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
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  FiDollarSign,
  FiEdit,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSend,
} from "react-icons/fi";
import moment from "moment";
import AudioRecorder from "../components/audio";
import ReactMarkdown from "react-markdown";

export default function Home({ params }) {
  const toast = useToast();
  const flexRef = useRef(null);

  // -------
  // STATE
  // -------
  const [wallet, setWallet] = useState();
  const [transactions, setTransactions] = useState();
  const [deposit, setDeposit] = useState();
  const [dashTrigger, setDashTrigger] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [thread, setThread] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [consent, setConsent] = useState();
  const [thinking, setThinking] = useState(false);
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState();
  const [phone, setPhone] = useState("");

  // -------
  // AUTHORIZATION LOGIC
  // -------
  const slug = params.id;
  let token = "";
  let user = "";
  let pp = "";

  if (slug === "lm1t7WMk4jTlbFAt") {
    user = "YCombinator";
    token = "6a8f8fd0ec2e17936d116080a735f0fb43e89628"; // YC token
    pp = "https://i.imgur.com/A4GDHkl.png";
  }
  if (slug === "h3WqBKDuBAVMMYSf") {
    user = "Parth Sharma";
    token = "b678e62a6a777c58521347f7e4dd97d89276be57"; // Parth token
    pp = "https://avatars.githubusercontent.com/u/45586386?v=4";
  }
  if (slug === "Tvd5l5of3dOJHLvH") {
    user = "Param Kapur";
    token = "5d9624c6e73b82888ba5dc01f5aae04b78d77840"; // Param token
    pp = "https://i.imgur.com/BftfnT3.jpeg";
  }

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
          name: user,
          img: pp,
          msg: userMessage,
        },
      ]);
      let msgcontent = userMessage;
      setUserMessage("");
      postUserMessage(msgcontent);
      setThinking(true);
    }
  }

  function customUserMessageSend(transmsg) {
    setMessages([
      ...messages,
      {
        type: "user",
        name: user,
        img: pp,
        msg: transmsg,
      },
    ]);
    setTranscribedText("");
    postUserMessage(transmsg);
    setThinking(true);
  }

  const scrollToBottom = () => {
    if (flexRef.current) {
      flexRef.current.scroll({
        top: flexRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

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

  function getUserDetails() {
    fetch("https://api.froura.xyz/api/users/me/", {
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
          setAddress(res.data.address);
          setZip(res.data.zip_code);
          setPhone(res.data.phone_number);
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

  function handleUpdateUserDetails() {
    fetch("https://api.froura.xyz/api/users/update_me/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        address: address,
        zip_code: zip,
        phone_number: phone,
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
          onClose3();
          toast({
            title: "User details updated successfully.",
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
    if (thread)
      fetch("https://api.froura.xyz/api/agent/assistant/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({
          message: msgcontent,
          thread_id: thread,
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
            setThinking(false);
            console.log(res.data);
            setMessages((messages) => [
              ...messages,
              {
                type: "agent",
                name: "froura.ai",
                img: "https://i.imgur.com/GxlJK0O.png",
                msg: res.data[0].content_blocks[0].text,
              },
            ]);

            setDashTrigger(dashTrigger + 1);
          } else {
            toast({
              title: "An error occurred. Please try again.",
              position: "top-right",
              status: "error",
              isClosable: true,
            });
          }
        });
    else
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
            setThinking(false);
            console.log(res.data);
            setMessages((messages) => [
              ...messages,
              {
                type: "agent",
                name: "froura.ai",
                img: "https://i.imgur.com/GxlJK0O.png",
                msg: res.data[0].content_blocks[0].text,
              },
            ]);
            setThread(res.data[0].thread_id);
            setDashTrigger(dashTrigger + 1);
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

  function checkConsents() {
    fetch("https://api.froura.xyz/api/gateway/payment-verifications/", {
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
          if (res.data) {
            if (res.data[0]) {
              setConsent(res.data[0]);
              onOpen2();
            }
          }
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

  function consentPayment(val) {
    fetch(
      "https://api.froura.xyz/api/gateway/payment-verifications/" +
        consent.id +
        "/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({
          consent_given: val,
        }),
      }
    )
      .then((response) =>
        response.json().then((data) => ({
          data: data,
          status: response.status,
        }))
      )
      .then((res) => {
        if (res.status < 300) {
          if (res.data) {
            toast({
              title: "Payment successful.",
              position: "top-right",
              status: "success",
              isClosable: true,
            });

            onClose2();
          }
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
  // useEffects
  // -------
  useEffect(() => {
    getUserWallet();
    getUserTransactions();
  }, [dashTrigger]);

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (transcribedText !== "") {
      customUserMessageSend(transcribedText);
    }
  }, [transcribedText]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkConsents();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // -------
  // MODAL LOGIC
  // -------
  const { isOpen, onOpen, onClose } = useDisclosure(); // deposits
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure(); // payment requests
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();
  const [show, setShow] = useState(false); // context

  // -------
  // CHATBOT LOGIC
  // -------

  const UserMessage = (props) => {
    return (
      <Flex flexDir="row" mt="20px">
        <Avatar src={props.img} boxSize="30px" borderRadius="200px" mr="20px" />
        <Flex flexDir="column">
          <Text fontSize="16px" fontWeight="600" color="#002A48">
            {props.name}
          </Text>
          <ReactMarkdown>{props.msg}</ReactMarkdown>
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
                    mt="40px"
                  >
                    {inUSD(wallet)}
                  </Text>

                  <Tooltip label="Manual deposit">
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
                  </Tooltip>
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
            <Flex flexDir="column" mt="40px">
              <Text color="#3B3B3B" fontWeight="700" fontSize="22px">
                Recent Transactions
              </Text>
              {transactions ? (
                <Flex
                  flexDir="column"
                  height="40vh"
                  minH="40vh"
                  maxH="40vh"
                  overflow="scroll"
                >
                  {transactions
                    .slice()
                    .reverse()
                    .map((tr, id) => (
                      <Flex flexDir="column" key={id}>
                        <Flex
                          width="100%"
                          height="1px"
                          bg="#526C7F"
                          opacity="0.2"
                          m="10px 0"
                        />
                        <Flex flexDir="row">
                          <Box
                            height="40px"
                            width="40px"
                            display="flex"
                            bg="#E2E2E2"
                            borderRadius="7px"
                            mr="10px"
                          >
                            <Icon
                              as={FiDollarSign}
                              boxSize="20px"
                              m="auto"
                              color="#3B3B3B"
                            />
                          </Box>
                          <Flex flexDir="column" width="100%">
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
                              {moment(tr.timestamp).fromNow()}
                            </Text>
                          </Flex>
                        </Flex>
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
              <Flex flexDir="row" width="100%" justifyContent="space-between">
                <Text fontSize="20px" fontWeight="500" color="#526C7F">
                  froura assistant
                </Text>
                <Flex flexDir="row">
                  <Tooltip label="Edit context">
                    <IconButton
                      icon={<FiEdit2 size="12px" />}
                      height="30px"
                      width="30px"
                      minH="30px"
                      maxH="30px"
                      maxW="30px"
                      minW="30px"
                      padding="0px"
                      mr="5px"
                      onClick={onOpen3}
                    />
                  </Tooltip>
                  <Tooltip label="New session">
                    <IconButton
                      icon={<FiRefreshCw size="12px" />}
                      height="30px"
                      width="30px"
                      minH="30px"
                      maxH="30px"
                      maxW="30px"
                      minW="30px"
                      padding="0px"
                      onClick={() => {
                        setMessages([]);
                        setThread("");
                      }}
                    />
                  </Tooltip>
                </Flex>
              </Flex>
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
                ref={flexRef}
              >
                {messages.map((m, key) => (
                  <UserMessage
                    key={key}
                    img={m.img}
                    name={m.name}
                    msg={m.msg}
                  />
                ))}
                {thinking ? (
                  <>
                    <Flex flexDir="row" mt="20px">
                      <Avatar
                        src="https://i.imgur.com/GxlJK0O.png"
                        boxSize="30px"
                        borderRadius="200px"
                        mr="20px"
                      />
                      <Flex flexDir="column">
                        <Text fontSize="16px" fontWeight="600" color="#002A48">
                          froura.ai
                        </Text>

                        <Spinner mt="5px" boxSize="20px" />
                      </Flex>
                    </Flex>
                  </>
                ) : null}
              </Flex>
            </Flex>
            <Flex flexDir="row">
              <InputGroup
                mr="10px"
                border="1px solid"
                borderColor="#CBD3D9"
                borderRadius="30px"
              >
                <Input
                  padding="10px 20px"
                  border="none"
                  borderRadius="30px"
                  placeholder="How can I help?"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendUserMessage();
                      setUserMessage("");
                    }
                  }}
                />
                <InputRightElement
                  cursor="pointer"
                  bg="white"
                  borderRadius="20px"
                  border="0px"
                >
                  <Icon as={FiSend} color="black" onClick={sendUserMessage} />
                </InputRightElement>
              </InputGroup>
              <AudioRecorder setTranscribedText={setTranscribedText} />
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Spinner m="auto" />
      )}
      {/* ============= */}
      {/* PAYMENT VERIFICATION */}
      {/* ============= */}
      <Modal
        isOpen={isOpen2}
        onClose={onClose2}
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

          {consent && consent.order ? (
            <ModalBody m="auto" textAlign="center" fontSize="18px">
              "froura assistant" has requested to pay{" "}
              {inUSD(consent.order.amount)} to {consent.order.payee.name} at{" "}
              {moment(consent.order.created_at).calendar()}
            </ModalBody>
          ) : null}

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => consentPayment(true)}
              width="50%"
            >
              Approve
            </Button>
            <Button
              colorScheme="red"
              width="50%"
              onClick={() => consentPayment(false)}
            >
              Deny
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* ============= */}
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
      {/* ============= */}
      <Modal isOpen={isOpen3} onClose={onClose3} size="md" isCentered>
        <ModalOverlay />
        <ModalContent p="20px" borderRadius="20px">
          <ModalHeader fontSize="22px">Update User Details</ModalHeader>

          <ModalBody fontSize="16px">
            <Text fontWeight="400" fontSize="16px">
              The froura assistant uses these details to facilitate events like
              deliveries and confirmation invoices.
            </Text>
            <Flex flexDir="column" mt="15px">
              <Text fontWeight="600" fontSize="16px">
                Address
              </Text>
              <InputGroup mt="5px">
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </InputGroup>
            </Flex>

            <Flex flexDir="column" mt="10px">
              <Text fontWeight="600" fontSize="16px">
                Zip Code
              </Text>
              <InputGroup mt="5px">
                <Input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </InputGroup>
            </Flex>

            <Flex flexDir="column" mt="10px">
              <Text fontWeight="600" fontSize="16px">
                Phone Number
              </Text>
              <InputGroup mt="5px">
                <Input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </InputGroup>
            </Flex>
          </ModalBody>

          <ModalFooter mt="20px">
            <Button colorScheme="gray" mr={3} onClick={onClose3} width="50%">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              width="50%"
              onClick={handleUpdateUserDetails}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* ============= */}
    </>
  );
}
