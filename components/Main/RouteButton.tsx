import {
  Card,
  CardBody,
  Heading,
  Center,
  Link,
  Icon,
  Button,
  Box,
} from "@chakra-ui/react";
import Router from "next/router";
import { IconType } from "react-icons";

type RouteButtonProps = {
  route: string;
  text: string;
  color: string;
  hoverColor: string;
  icon: IconType;
};

export const RouteButton = ({
  route,
  text,
  color,
  hoverColor,
  icon,
}: RouteButtonProps) => {
  let hoverState = {
    bg: hoverColor,
  };

  return (
    <Center>
      <Box
        onClick={() => Router.push(route)}
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
      >
        <Card
          border="1px"
          borderColor={color}
          rounded="20px"
          _hover={hoverState}
        >
          <CardBody>
            <Center>
              <Heading size="md" noOfLines={1} textColor={color}>
                {text}
              </Heading>
            </Center>
            <Center>
              <Icon as={icon} boxSize={150} color={color} pt={5} />
            </Center>
          </CardBody>
        </Card>
      </Box>
    </Center>
  );
};
