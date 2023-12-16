import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  SmallAddIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  GridItem,
  IconButton,
  Link,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";

type BaseWidgetProps = {
  href: string;
  title: string;
  bg: string;
  handleRemove: () => Promise<void>;
  safeRemove: boolean;
  handleAdd: () => Promise<void>;
  invert: boolean;
  showAction: boolean;
};

export default function BaseWidget({
  href,
  title,
  bg,
  handleRemove,
  safeRemove,
  handleAdd,
  invert,
  showAction,
}: BaseWidgetProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex h={8}>
      <Link
        bg={bg}
        color="white"
        href={href}
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
        w="100%"
        h="100%"
        pointerEvents={href ? "auto" : "none"}
        px={5}
        borderRadius={"md"}
        roundedRight={showAction ? "none" : "auto"}
      >
        <Text noOfLines={1} h={6}>
          {title}
        </Text>
      </Link>

      {showAction && (
        <IconButton
          onClick={invert ? handleAdd : safeRemove ? onOpen : handleRemove}
          bg={invert ? "green.300" : "red.300"}
          _hover={{ bg: invert ? "green.400" : "red.400" }}
          color="white"
          aria-label={invert ? "add" : "delete"}
          icon={invert ? <SmallAddIcon /> : <SmallCloseIcon />}
          h={8}
          w={8}
          roundedLeft="none"
          borderRadius="md"
        />
      )}
      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        name={title}
        handleDelete={handleRemove}
      />
    </Flex>
  );
}
