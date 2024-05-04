import { Box, Flex, Text, Image, IconButton, Icon } from "@chakra-ui/react";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Carousel() {
  const slides = [
    {
      img: "https://images.pexels.com/photos/2599537/pexels-photo-2599537.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      img: "https://images.pexels.com/photos/2714581/pexels-photo-2714581.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      img: "https://images.pexels.com/photos/2878019/pexels-photo-2878019.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    },
    {
      img: "https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      img: "https://images.pexels.com/photos/3124111/pexels-photo-3124111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = slides.length;

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };

  const carouselStyle = {
    transition: "all .5s",
    ml: `-${currentSlide * 100}%`,
  };

  return (
    <Flex px={"2"} alignItems="center" justifyContent="center">
      <Flex w="full" overflow="hidden" pos="relative">
        <Flex h="200px" w="full" {...carouselStyle}>
          {slides.map((slide, sid) => (
            <Box key={`slide-${sid}`} boxSize="full" flex="none">
              <Image
                src={slide.img}
                alt="carousel image"
                boxSize="full"
                backgroundSize="cover"
              />
            </Box>
          ))}
        </Flex>
        <Icon
          left="0"
          top="50%"
          position={"absolute"}
          onClick={prevSlide}
          aria-label={""}
          as={FiChevronLeft}
          boxSize={10}
          color="white"
        />
        <Icon
          right="0"
          top="50%"
          position="absolute"
          onClick={nextSlide}
          aria-label={""}
          as={FiChevronRight}
          boxSize={10}
          color="white"
        />
      </Flex>
    </Flex>
  );
}
