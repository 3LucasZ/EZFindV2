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
