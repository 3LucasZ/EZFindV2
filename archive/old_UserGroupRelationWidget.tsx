import {
  Box,
  Flex,
  IconButton,
  Input,
  Link,
  useToast,
  Text,
  Select,
} from "@chakra-ui/react";
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { ItemProps, UserProps } from "types/db";
import { StorageProps } from "types/db";
import Router from "next/router";
import WidgetTitle from "archive/old_WidgetTitle";
import AddRemoveButton from "components/Composable/AddRemoveButton";
import { MouseEventHandler } from "react";

export type UserGroupRelationWidgetProps = {
  user: UserProps;
  perm: number;
  isInvert: boolean;
  isEdit: boolean;
  handleRemove?: MouseEventHandler<HTMLButtonElement>;
  handleAdd?: MouseEventHandler<HTMLButtonElement>;
  handleUpdate?: Function;
};

export default function UserGroupRelationWidget({
  user,
  perm,
  isInvert,
  isEdit,
  handleRemove,
  handleAdd,
  handleUpdate,
}: UserGroupRelationWidgetProps) {
  const toaster = useToast();
  return (
    //rounded widget
    <Flex w="100%" overflow="hidden" rounded="md" flexDir="row" h="8">
      <WidgetTitle bg="orange.300" title={user.name} />
      <WidgetTitle bg="orange.200" title={user.email} />
      <Select
        rounded={"none"}
        // bg="gray.300"
        bg={perm == 0 ? "purple.200" : perm == 1 ? "purple.500" : "purple.800"}
        color="white"
        size={"sm"}
        onChange={(e) => {
          const num = parseInt(e.target.value);
          handleUpdate &&
            handleUpdate(Number.isNaN(num) ? 0 : parseInt(e.target.value));
        }}
        value={perm}
        pointerEvents={isEdit ? "auto" : "none"}
        iconSize={isEdit ? "md" : "0"}
        display={isInvert ? "none" : ""}
      >
        <option value="0">Viewer</option>
        <option value="1">Editor</option>
        <option value="2">Manager</option>
      </Select>
      <AddRemoveButton
        mode={isEdit ? (isInvert ? 1 : -1) : 0}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
      />
    </Flex>
  );
}
