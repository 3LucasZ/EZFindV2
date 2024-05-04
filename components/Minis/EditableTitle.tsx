import AutoResizeTextarea from "components/Minis/AutoResizeTextarea";

//value, onchanged, disabled
export default function EditableTitle({ ...props }) {
  return (
    <AutoResizeTextarea
      maxLength={100}
      fontSize={["2xl", "2xl", "2xl", "3xl", "4xl"]}
      display={"block"}
      _disabled={{ color: "black", borderColor: "white" }}
      textAlign={"center"}
      sx={{ opacity: "1" }}
      py={"5px"}
      {...props}
    />
  );
}
