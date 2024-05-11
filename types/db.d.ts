import { GroupProps } from "components/Widget/GroupWidget";
import { ItemStorageRelationProps } from "components/Widget/ItemStorageRelationWidget";
import { UserProps } from "components/Widget/UserWidget";

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
