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
import { ItemProps } from "./ItemWidget";
import { StorageProps } from "./StorageWidget";
import Router from "next/router";
import { UserProps } from "./UserWidget";
import { GroupProps } from "./GroupWidget";
import WidgetTitle from "components/Minis/WidgetTitle";
import AddRemoveButton from "components/Minis/AddRemoveButton";

export type UserGroupRelationProps = {
  user: UserProps;
  userId: string;
  group: GroupProps;
  groupId: number;
  perm: number;
};

export type UserGroupRelationWidgetProps = {
  user: UserProps;
  perm: number;
  isInvert: boolean;
  isEdit: boolean;
  handleRemove?: Function;
  handleAdd?: Function;
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
        bg={perm == 0 ? "pink.200" : perm == 1 ? "purple.300" : "purple.600"}
        color="white"
        size={"sm"}
        onChange={(e) => {
          const num = parseInt(e.target.value);
          handleUpdate &&
            handleUpdate(Number.isNaN(num) ? 0 : parseInt(e.target.value));
        }}
        value={perm}
        pointerEvents={isEdit ? "auto" : "none"}
        iconColor={isEdit ? "white" : "gray.300"}
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
