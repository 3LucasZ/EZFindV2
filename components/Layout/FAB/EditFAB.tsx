import { AddIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Heading,
  Center,
  Link,
  Icon,
  Button,
  IconButton,
  Text,
  Box,
  HStack,
  ComponentWithAs,
  IconProps,
  VStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FAB } from "./FAB";
import { FiCheck, FiEdit2, FiX } from "react-icons/fi";

type EditFABProps = {
  isEdit: boolean;
  onEdit: Function;
  onSave: Function;
  onCancel: Function;
};

export const EditFAB = ({ isEdit, onEdit, onSave, onCancel }: EditFABProps) => {
  return (
    <>
      <FAB icon={FiCheck} onClick={onSave} bottomOffset={isEdit ? 75 : 0} />
      <FAB
        icon={isEdit ? FiX : FiEdit2}
        onClick={isEdit ? onCancel : onEdit}
        bg={isEdit ? "red.300" : ""}
        hoverBg={isEdit ? "red.400" : ""}
      />
    </>
  );
};