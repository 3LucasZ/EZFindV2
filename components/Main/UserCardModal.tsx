import {
  Avatar,
  Badge,
  Box,
  Card,
  Center,
  HStack,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { genGradient } from "services/gradientGenerator";

type UserCardModalProps = {
  //data
  name: string;
  email: string;
  image: string;
  isAdmin: boolean;
  groups: number;
  //control
  isOpen: boolean;
  onClose: () => void;
};
export function UserCardModal(props: UserCardModalProps) {
  const radius = 120;
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      isCentered
      motionPreset="slideInRight"
      size={["xs", "sm"]}
    >
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.200" />
      <ModalContent overflow="hidden">
        <Box
          h={"140px"}
          bgGradient={genGradient(props.name)}
          // style={{
          //   backgroundImage: "url(https://source.unsplash.com/random/?nature)",
          // }}
        />
        <Avatar
          src={props.image} //google hosted image
          boxSize={`${radius}px`}
          borderRadius={"full"}
          mx="auto"
          mt={`-${radius / 2}px`}
        />
        <VStack>
          <Box h="6" />
          <Stat title={props.name} subtitle={props.email} />
          <Badge
            mt={1}
            py={1}
            px={2}
            rounded="lg"
            colorScheme={props.isAdmin ? "purple" : "blue"}
          >
            {props.isAdmin ? "Admin" : "User"}
          </Badge>
          <Box h="8" />
        </VStack>
      </ModalContent>
    </Modal>
  );
}
type StatProps = {
  title: string;
  subtitle: string;
};
function Stat(props: StatProps) {
  return (
    <VStack gap="0">
      <Text fontSize="lg">{props.title}</Text>
      <Text fontSize="md" color="grey">
        {props.subtitle}
      </Text>
    </VStack>
  );
}
/*
<Box h="4" />
          <HStack gap="16">
            <Stat title={"" + props.groups} subtitle={"Groups"} />
            <Stat title={props.isAdmin ? "Admin" : "User"} subtitle={"Role"} />
            </HStack>
*/
