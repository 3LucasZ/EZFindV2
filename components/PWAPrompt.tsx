import { Box, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiPlusSquare, FiX } from "react-icons/fi";
import { IoShareOutline } from "react-icons/io5";

export default function PWAPrompt() {
  //can not call navigator on server side since it is strictly a web API.
  //we wrap it inside useEffect to force it to be called on the client only.
  //default true so that it never "accidentally" shows
  const [invisible, setInvisible] = useState(true);
  useEffect(() => {
    const isIos =
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    console.log("isIos:", isIos);
    const isInStandaloneMode =
      "standalone" in window.navigator && window.navigator.standalone == true;
    console.log("isStandalone:", isInStandaloneMode);
    const isCancelled = localStorage.getItem("isCancelled") === "true";
    console.log("isCancelled:", isCancelled);
    setInvisible(!isIos || isInStandaloneMode || isCancelled);
  });

  return (
    <Box
      pos="fixed"
      bottom={invisible ? "-80px" : "calc(12px + env(safe-area-inset-bottom))"}
      left="12px"
      right="12px"
      maxW="400px"
      mx="auto"
      //bg="gray.200"
      bg="white"
      borderColor={"gray.300"}
      borderWidth={"1px"}
      borderRadius={"xl"}
      px="2"
      py="1"
      zIndex={5}
      transition={"all 0.05s linear"}
    >
      <Text>
        To install this webapp on your device: tap
        {/* {" "} */}
        <Icon
          as={IoShareOutline}
          color="#007AFF"
          boxSize={7}
          verticalAlign={"bottom"}
          pb="2px"
        />
        {/* {" "} */}
        and then click "Add to Homescreen"
        {/* {" "} */}
        {/* <Icon as={FiPlusSquare} boxSize={6} verticalAlign={"bottom"} pb="0px" /> */}
        .
      </Text>
      <Box
        w="20px"
        h="20px"
        bg="red.400"
        pos={"absolute"}
        top={"-10px"}
        right={"-10px"}
        borderRadius={"full"}
        alignItems={"center"}
        onClick={() => {
          setInvisible(!invisible);
          localStorage.setItem("isCancelled", "true");
        }}
      >
        <Icon
          as={FiX}
          color="white"
          position={"absolute"}
          m="auto"
          left={0}
          right={0}
          top={0}
          bottom={0}
        />
      </Box>
    </Box>
  );
}
