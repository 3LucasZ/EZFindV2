import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  AspectRatio,
  Image,
  HStack,
  Text,
  Box,
  Flex,
  Icon,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Router from "next/router";
import imagePlaceholder from "public/images/image-placeholder.png";
import { IconType } from "react-icons";
import { BsBoxes } from "react-icons/bs";
import { FaBoxes, FaHome, FaTools } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { FiHome, FiPackage, FiSettings, FiTool } from "react-icons/fi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

type NavDrawerProps = {
  image?: string;
  title: string;
  id: number;
};
export default function NavDrawer(props: NavDrawerProps) {
  //drawer properties
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <HamburgerIcon
        onClick={onOpen}
        pos="absolute"
        float="left"
        left="4"
        boxSize="8"
        color="gray"
      />
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay bg={""} />
        <DrawerContent maxW={[60, 80]} borderRightWidth={"1px"}>
          <DrawerHeader borderBottomWidth="1px" p="0">
            <VStack>
              <AspectRatio ratio={1} w="100%">
                <Image
                  src={
                    props.image ? `/api/${props.image}` : imagePlaceholder.src
                  }
                  // rounded="lg"
                />
              </AspectRatio>
              {/* <Text textAlign={"center"} fontWeight={"normal"}>
                {props.title}
              </Text> */}
            </VStack>
          </DrawerHeader>
          <DrawerBody px="2">
            <NavItem
              icon={FiHome}
              name="Home"
              url={`/group/${props.id}/explore`}
            />
            <NavItem
              icon={FiTool}
              name="Items"
              url={`/group/${props.id}/manage-items`}
            />
            <NavItem
              icon={FiPackage}
              name="Storages"
              url={`/group/${props.id}/manage-storages`}
            />
            <NavItem
              icon={FiSettings}
              name="Settings"
              url={`/group/${props.id}/settings`}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
type NavItemProps = {
  icon: IconType;
  name: string;
  url: string;
};
const NavItem = ({ icon, name, url }: NavItemProps) => {
  return (
    <Box
      onClick={() => Router.push(url)}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        rounded="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "blue.400",
          color: "white",
        }}
      >
        {icon && <Icon mr="4" as={icon} boxSize={6} />}
        <Text fontSize={"xl"}>{name}</Text>
      </Flex>
    </Box>
  );
};
{
  /* <AspectRatio ratio={1}>
  <Image
    src={props.image ? `/api/${props.image}` : imagePlaceholder.src}
    rounded="md"
  />
</AspectRatio> */
}
{
  /* <HStack>
  <AspectRatio ratio={1} minW={"50px"}>
    <Image
      src={
        props.image ? `/api/${props.image}` : imagePlaceholder.src
      }
      rounded="md"
    />
  </AspectRatio>
  <Text fontSize={"xl"} noOfLines={2}>
    {props.title}
  </Text>
</HStack> */
}
