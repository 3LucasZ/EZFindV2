import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Grid,
  Heading,
  Image,
  Show,
  Stack,
  Text,
} from "@chakra-ui/react";
import BaseWidget from "./BaseWidget";
import { ItemStorageRelationProps } from "types/db";
import imagePlaceholder from "public/images/image-placeholder.png";
import Router from "next/router";
import { UserGroupRelationProps } from "types/db";
import { ItemProps } from "types/db";
import { StorageProps } from "types/db";
import { genGradient } from "services/gradientGenerator";

export type GroupProps = {
  id: number;
  name: string;
  description: string;
  image?: string;
  minPerm: number;

  //relations
  userRelations?: UserGroupRelationProps[];
  items?: ItemProps[];
  storages?: StorageProps[];
};
type GroupWidgetProps = {
  group: GroupProps;
};

export default function GroupWidget({ group }: GroupWidgetProps) {
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
      boxShadow={"md"}
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
          <Text fontSize="md" textAlign={"center"} noOfLines={2}>
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
