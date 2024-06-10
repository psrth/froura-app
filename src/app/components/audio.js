"use client";
import { useState, useRef } from "react";
import { Button, Flex, Heading, Stack, IconButton } from "@chakra-ui/react";
import OpenAI from "openai";
import { FiMic, FiStopCircle } from "react-icons/fi";

const openai = new OpenAI({
  apiKey: "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",
  organization: "org-7WHC72tdw1X87LDTd3DXoEkO",
  dangerouslyAllowBrowser: true,
});

const AudioRecorder = ({ setTranscribedText }) => {
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [transcription, setTranscription] = useState("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const options = { mimeType: "audio/webm" };
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      const chunks = [];
      recorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });

      recorder.addEventListener("stop", () => {
        const blob = new Blob(chunks);
        setRecordedBlob(blob);
        chunks.length = 0;

        // Call transcription function here
        transcribeAudio(blob);
      });

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    const stream = mediaStreamRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setRecording(false);
    }
  };

  const playRecordedAudio = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });
      const response = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
      });
      if (response.text) {
        console.log(response);
        setTranscription(response.text);
        setTranscribedText(response.text);
      } else {
        throw new Error("Empty transcription response");
      }
    } catch (error) {
      console.error("Error transcribing audio:", error.message);
    }
  };

  return (
    <IconButton
      onClick={recording ? stopRecording : startRecording}
      borderRadius="100%"
      bg={recording ? "red" : "#002A48"}
      color="white"
      icon={recording ? <FiStopCircle /> : <FiMic />}
      _hover={{
        bg: recording ? "red.500" : "#7A8F9E",
      }}
    />
  );
};

export default AudioRecorder;
