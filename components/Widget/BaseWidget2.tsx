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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";

type BaseWidgetProps = {
  href: string;
  title: string;
  bg: string;
  count: number;
  handleRemove: () => Promise<void>;
  safeRemove: boolean;
  handleAdd: () => Promise<void>;
  invert: boolean;
  showAction: boolean;
  editing: boolean;
};

export default function BaseWidget({
  href,
  title,
  bg,
  count,
  handleRemove,
  safeRemove,
  handleAdd,
  invert,
  showAction,
  editing,
}: BaseWidgetProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(editing);
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
      <Box bg="orange.200" color="white" px={5}>
        {editing ? (
          <NumberInput defaultValue={15} min={10} max={20}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        ) : (
          <Text>{count}</Text>
        )}
      </Box>
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
