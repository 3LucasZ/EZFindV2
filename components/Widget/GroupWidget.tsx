import {
  AspectRatio,
  Box,
  Card,
  CardBody,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Router from "next/router";
import { genGradient } from "services/gradientGenerator";
import { btnBase } from "services/constants";
import { GroupProps } from "types/db";
import { AddIcon } from "@chakra-ui/icons";
import { poster } from "services/poster";

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
          {group.image!.length > 5 ? (
            <Image src={`/api/${group.image}`} alt={group.description} />
          ) : (
            <></>
          )}
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
export function MaskedGroupWidget({
  authorized,
}: {
  authorized: boolean | undefined;
}) {
  const toaster = useToast();
  return (
    <Box
      onClick={async () => {
        const body = JSON.stringify("");
        const res = await poster("/api/create-group", body, toaster);
        if (res.status == 200)
          await Router.push({
            pathname: "/group/" + (await res.json()) + "/explore",
          });
      }}
      mx={1} //copy card in all attrib
      mb={2} //ensure consistent spacing, due to added mx above
      //--shadow, outline, border
      borderStyle={"dashed"}
      borderWidth={"5px"}
      borderRadius={"lg"}
      borderColor="gray.300"
      //--color
      color="black"
      _hover={{ bgColor: "gray.100" }}
      transition="background-color 0.3s"
      hidden={authorized ? false : true}
      //align
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <AddIcon color="gray.400" boxSize={12} />
    </Box>
  );
}
