import { ItemProps } from "./ItemWidget";
import { StorageProps } from "./StorageWidget";

export type RelationProps = {
  item: ItemProps;
  itemId: number;
  storage: StorageProps;
  storageId: number;
  count: number;
};
