import { ItemProps, StorageProps, UserGroupRelationProps } from "./db";
import { MouseEventHandler } from "react";
import { User } from "next-auth";

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
  user: User;
  userId: string;
  group: GroupProps;
  groupId: number;
  perm: number;
  inverted?: boolean = false;
};
export type ItemStorageRelationProps = {
  item: ItemProps;
  itemId: number;
  storage: StorageProps;
  storageId: number;
  count: number;
  inverted?: boolean = false;
};
export type GroupProps = {
  id: number;
  name: string;
  description: string;
  image?: string;
  minPerm: number;

  //relations
  userRelations?: UserGroupRelationProps[];
  items?: ItemProps[];
  storages?: StorageProps[];
};
