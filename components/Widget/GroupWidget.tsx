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
  Stack,
  Text,
} from "@chakra-ui/react";
import BaseWidget from "./BaseWidget";
import { RelationProps } from "./RelationWidget";
import imagePlaceholder from "public/images/image-placeholder.png";
import Router from "next/router";

export type GroupProps = {
  id: number;
  name: string;
  description: string;
  image: string;
};
type GroupWidgetProps = {
  group: GroupProps;
};

export default function GroupWidget({ group }: GroupWidgetProps) {
  return (
    <Card
      variant={"outline"}
      onClick={() =>
        Router.push({
          pathname: "/group/" + group.id,
        })
      }
    >
      <CardBody>
        <AspectRatio ratio={1}>
          <Image
            src={
              !group.image
                ? imagePlaceholder.src
                : "data:image/jpeg;base64," + group.image
            }
            alt={group.description}
            borderRadius="md"
          />
        </AspectRatio>
        <Stack mt="6" spacing="3">
          <Heading size="md" textAlign={"center"}>
            {group.name}
          </Heading>
          <Text textAlign={"left"}>
            {group.description ? group.description : "No description."}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
