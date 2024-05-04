import {
  Box,
  Icon,
  UseRadioProps,
  useRadio,
  Text,
  HStack,
  Radio,
  Tooltip,
  Show,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

type RadioCardProps = {
  key: string;
  name: string;
  description: string;
  icon: IconType;
  children?: JSX.Element;
  radioProps: UseRadioProps;
};
export default function RadioCard(props: RadioCardProps) {
  const { getInputProps, getRadioProps } = useRadio(props.radioProps);
  const input = getInputProps();
  const checkbox = getRadioProps();
  return (
    <Box as="label" w="33%" h="100%">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="md"
        // boxShadow="md"
        _checked={{
          //   bg: "teal.400",
          //   borderColor: "teal.400",
          borderColor: "blue.400",
          //   color: "white",
        }}
        // _focus={{
        //   boxShadow: "outline",
        // }}
        px={3}
        py={1}
        flexDir="row"
        h="100%"
      >
        <HStack>
          <Icon as={props.icon} boxSize={5} />
          <Text w="100%" noOfLines={1}>
            {props.name}
          </Text>
          <Show above="sm">
            <Radio isChecked={input.checked} />
          </Show>
        </HStack>
        <Text noOfLines={2} fontSize={"xs"} color="gray">
          {props.description}
        </Text>
      </Box>
    </Box>
  );
}
