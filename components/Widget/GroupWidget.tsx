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
import { ItemStorageRelationProps } from "./ItemStorageRelationWidget";
import imagePlaceholder from "public/images/image-placeholder.png";
import Router from "next/router";
import { UserGroupRelationProps } from "./UserGroupRelationWidget";
import { ItemProps } from "./ItemWidget";
import { StorageProps } from "./StorageWidget";

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
  console.log(group.image);
  return (
    <Card
      variant={"outline"}
      onClick={() =>
        Router.push({
          pathname: "/group/" + group.id + "/explore",
        })
      }
    >
      <CardBody>
        <AspectRatio ratio={1}>
          <Image
            src={group.image ? `/api/${group.image}` : imagePlaceholder.src}
            alt={group.description}
            borderRadius="md"
          />
        </AspectRatio>
        <Stack mt="6" spacing="3">
          <Heading size="md" textAlign={"center"}>
            {group.name}
          </Heading>
          <Show above="lg">
            <Text textAlign={"left"}>
              {group.description ? group.description : "No description."}
            </Text>
          </Show>
        </Stack>
      </CardBody>
    </Card>
  );
}
