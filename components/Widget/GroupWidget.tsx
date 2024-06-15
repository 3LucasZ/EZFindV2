import {
  AspectRatio,
  Card,
  CardBody,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import Router from "next/router";
import { genGradient } from "services/gradientGenerator";
import { btnBase } from "services/constants";
import { GroupProps } from "types/db";

type GroupWidgetProps = {
  group: GroupProps;
  authorized: boolean;
};

export default function GroupWidget({ group, authorized }: GroupWidgetProps) {
  return (
    <Card
      onClick={() =>
        Router.push({
          pathname: "/group/" + group.id + "/explore",
        })
      }
      overflow={"clip"}
      mx={1} //necessary so card shadow is not clipped
      mb={2} //ensure consistent spacing, due to added mx above
      //--shadow, outline, border
      boxShadow={"md"}
      outlineColor="blue.200"
      _hover={{
        // bgColor: "gray.100",
        outlineWidth: "5px",
        outlineStyle: "solid",
      }}
      {...btnBase}
      //--color
      color="black"
      opacity={authorized ? "1" : "0.2"}
      //--state
      pointerEvents={authorized ? "auto" : "none"}
    >
      <CardBody p={0}>
        <AspectRatio ratio={1} bgGradient={genGradient(group.name)}>
          <Image
            src={`/api/${group.image}`}
            alt={group.description}
            hidden={group.image!.length < 5}
          />
        </AspectRatio>
        <Stack spacing="3" py="1" px="1">
          <Text fontSize="md" textAlign={"center"} noOfLines={2} h="47px">
            {group.name}
          </Text>
          {/* <Show above="lg">
            <Text fontSize="xs" textAlign={"left"}>
              {group.description ? group.description : "No description."}
            </Text>
          </Show> */}
        </Stack>
      </CardBody>
    </Card>
  );
}
