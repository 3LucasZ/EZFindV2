import { GroupProps } from "components/Widget/GroupWidget";
import { UserProps } from "components/Widget/UserWidget";
import { ItemProps, StorageProps } from "./db";

export type ItemProps = {
  id: number;
  name: string;
  description: string;
  storageRelations: ItemStorageRelationProps[];
  image: string;
  link: string;
  group: GroupProps;
};
export type StorageProps = {
  id: number;
  name: string;
  description: string;
  itemRelations: ItemStorageRelationProps[];
  image: string;
  group: GroupProps;
};
export type UserGroupRelationProps = {
  user: UserProps;
  userId: string;
  group: GroupProps;
  groupId: number;
  perm: number;
};
export type ItemStorageRelationProps = {
  item: ItemProps;
  itemId: number;
  storage: StorageProps;
  storageId: number;
  count: number;
  inverted?: boolean = false;
};
