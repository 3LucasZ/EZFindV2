import { Stack, Text } from "@chakra-ui/react";

type WidgetTitlesProps = {
  title: string;
  subtitle?: string;
  column: boolean;
};
export default function WidgetTitles(props: WidgetTitlesProps) {
  return (
    <Stack
      w="100%"
      direction={props.column ? "column" : "row"}
      gap={props.column ? 0 : 2}
    >
      <Text
        w={props.column ? "100%" : "40%"}
        noOfLines={1} //do not render more than one line
        wordBreak={"break-all"} //ellipsis in the middle of word, not only on new word
      >
        {props.title}
      </Text>
      <Text
        w={props.column ? "100%" : "60%"}
        fontSize={props.column ? "sm" : "md"}
        color={props.column ? "grey" : "black"}
        noOfLines={1}
        wordBreak={"break-all"}
      >
        {props.subtitle}
      </Text>
    </Stack>
  );
}
