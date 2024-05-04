import { HamburgerIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import Router from "next/router";
import imagePlaceholder from "public/images/image-placeholder.png";
import { IconType } from "react-icons";
import { FaBoxes, FaHome, FaTools } from "react-icons/fa";

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
        pos="relative"
        float="left"
        left="4"
        boxSize="8"
        color="gray"
      />
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent maxW={[60, 80]} borderRightWidth={"1px"}>
          <DrawerHeader borderBottomWidth="1px" p="2">
            <HStack>
              <AspectRatio ratio={1} minW={"50px"}>
                <Image
                  src={
                    props.image ? `/api/${props.image}` : imagePlaceholder.src
                  }
                  borderRadius="md"
                />
              </AspectRatio>
              <Text fontSize={"xl"} noOfLines={2}>
                {props.title}
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <NavItem
              icon={FaHome}
              name="Home"
              url={`/group/${props.id}/explore`}
            />
            <NavItem
              icon={FaTools}
              name="Items"
              url={`/group/${props.id}/manage-items`}
            />
            <NavItem
              icon={FaBoxes}
              name="Storages"
              url={`/group/${props.id}/manage-storages`}
            />
            <NavItem
              icon={FaHome}
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
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {name}
      </Flex>
    </Box>
  );
};
{
  /* <AspectRatio ratio={1}>
              <Image
                src={props.image ? `/api/${props.image}` : imagePlaceholder.src}
                borderRadius="md"
              />
            </AspectRatio> */
}
