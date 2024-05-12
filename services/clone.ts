import { ItemStorageRelationProps, UserGroupRelationProps } from "types/db";

export function cloneItemStorageRelationProps(obj: ItemStorageRelationProps) {
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

export function cloneUserGroupRelationProps(obj: UserGroupRelationProps) {
  const ret: UserGroupRelationProps = {
    user: obj.user,
    userId: obj.userId,
    group: obj.group,
    groupId: obj.groupId,
    perm: obj.perm,
    inverted: obj.inverted,
  };
  return ret;
}
