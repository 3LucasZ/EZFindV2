import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  Icon,
  useBreakpointValue,
  AspectRatio,
} from "@chakra-ui/react";

import { MouseEventHandler, useState } from "react";
import { IconType } from "react-icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Carousel() {
  const slides = [
    "https://images.pexels.com/photos/2599537/pexels-photo-2599537.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/2714581/pexels-photo-2714581.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/2878019/pexels-photo-2878019.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    "https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/3124111/pexels-photo-3124111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  ];
  const [cur, setCur] = useState(0);
  const cnt = slides.length;

  const prev = () => {
    setCur((s) => (s === 0 ? cnt - 1 : s - 1));
  };

  const next = () => {
    setCur((s) => (s === cnt - 1 ? 0 : s + 1));
  };

  const variant =
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
    ml: `-${cur * (100 / variant)}%`,
  };

  return (
    <Flex px={"2"} alignItems="center" justifyContent="center">
      <Flex w="full" overflow="hidden" pos="relative">
        <Flex h="200px" w="full" {...carouselStyle}>
          {slides.map((slide, sid) => (
            <Box
              key={`slide-${sid}`}
              minH="100%"
              minW={`${100 / variant}%`}
              p="3"
            >
              <Box borderRadius={"md"} h="100%" alignContent={"center"}>
                <AspectRatio ratio={1}>
                  <Image src={slide} />
                </AspectRatio>
              </Box>
            </Box>
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
type CarouselControlProps = {
  onClick: MouseEventHandler;
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  icon: IconType;
};
function CarouselControl(props: CarouselControlProps) {
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
      onClick={props.onClick}
      _hover={{
        opacity: 0.6,
        bg: "black",
        cursor: "pointer",
      }}
      opacity={0.3}
      bg={"black"}
      borderRadius={"full"}
    />
  );
}
