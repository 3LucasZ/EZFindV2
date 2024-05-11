import { ItemStorageRelationProps } from "types/db";

export function clone(obj: ItemStorageRelationProps) {
  const ret: ItemStorageRelationProps = {
    item: obj.item,
    itemId: obj.itemId,
    storage: obj.storage,
    storageId: obj.storageId,
    count: obj.count,
    inverted: obj.inverted,
  };
  return ret;
}
