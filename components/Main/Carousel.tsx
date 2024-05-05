import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  Icon,
  useBreakpointValue,
  AspectRatio,
  VStack,
  HStack,
} from "@chakra-ui/react";
import Router from "next/router";

import { MouseEventHandler, useRef, useState } from "react";
import { IconType } from "react-icons";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import { genGradient } from "services/gradientGenerator";

import { throttle } from "lodash";
import _ from "lodash";

type CarouselProps = {
  cards: {
    image: string;
    title: string;
    url: string;
  }[];
};
export default function Carousel({ cards }: CarouselProps) {
  const [cur, setCur] = useState(0);
  const cnt = cards.length;

  const prev = () => {
    setCur((s) => (s === 0 ? cnt - 1 : s - 1));
  };
  const next = () => {
    setCur((s) => (s === cnt - 1 ? 0 : s + 1));
  };

  const cols =
    useBreakpointValue(
      {
        base: 1,
        sm: 2,
        md: 3,
      },
      { fallback: "md", ssr: false }
    ) || 3;

  const carouselStyle = {
    transition: "all .5s",
    ml: `-${cur * (100 / cols)}%`,
  };

  return (
    <Flex px={"2"} alignItems="center" justifyContent="center">
      <Flex w="full" overflow="hidden" pos="relative">
        <Flex h="250px" py="4" w="full" {...carouselStyle}>
          {cards.map((card, id) => (
            <CarouselCard
              image={card.image}
              title={card.title}
              url={card.url}
              id={id}
              cols={cols}
            />
          ))}
        </Flex>
        <CarouselControl
          onClick={prev}
          left="0"
          top="50%"
          icon={FiChevronLeft}
        />
        <CarouselControl
          onClick={next}
          right="0"
          top="50%"
          icon={FiChevronRight}
        />
      </Flex>
    </Flex>
  );
}

type CarouselCardProps = {
  image: string;
  title: string;
  url: string;
  id: number;
  cols: number;
};
function CarouselCard(props: CarouselCardProps) {
  return (
    <Box
      key={`slide-${props.id}`}
      minH="100%"
      minW={`${100 / props.cols}%`}
      px="3"
    >
      <Box
        borderRadius={"lg"}
        // borderWidth={"1px"}
        boxShadow={"md"}
        h="100%"
        alignContent={"center"}
        overflow={"clip"}
      >
        <Box
          minH="75%"
          maxH="75%"
          w="100%"
          bgGradient={genGradient(props.title)}
          alignContent={"center"}
        >
          <Image
            src={props.image ? "/api" + props.image : ""}
            hidden={props.image.length < 5}
            maxH="100%"
            maxW="100%"
          />
        </Box>
        <HStack h="25%" px="3" w="100%">
          <Text
            noOfLines={1}
            w="100%"
            // bgGradient={genGradient(props.title)}
            // bgClip="text"
          >
            {props.title}
          </Text>
          <Icon
            as={FiEye}
            borderRadius={"full"}
            bg="gray.200"
            _hover={{ bg: "gray.300" }}
            p={2}
            boxSize={"8"}
            onClick={() => Router.push(props.url)}
          />
        </HStack>
      </Box>
    </Box>
  );
}

type CarouselControlProps = {
  onClick: MouseEventHandler;
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  icon: IconType;
};
function CarouselControl(props: CarouselControlProps) {
  const throttledOnClick = useRef(throttle(props.onClick, 500));
  return (
    <Icon
      as={props.icon}
      boxSize={10}
      color="white"
      position="absolute"
      left={props.left}
      right={props.right}
      top={props.top}
      mt="-22px"
      onClick={throttledOnClick.current}
      _hover={{
        opacity: 0.6,
        bg: "black",
        cursor: "pointer",
      }}
      opacity={0.3}
      bg={"black"}
      borderRadius={"full"}
      py="1.5"
    />
  );
}

// const slides = [
//   "https://images.pexels.com/photos/2599537/pexels-photo-2599537.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//   "https://images.pexels.com/photos/2714581/pexels-photo-2714581.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//   "https://images.pexels.com/photos/2878019/pexels-photo-2878019.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
//   "https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//   "https://images.pexels.com/photos/3124111/pexels-photo-3124111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
// ];
