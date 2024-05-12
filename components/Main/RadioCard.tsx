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
  disabled?: boolean;
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
        //--border--
        borderWidth="2px"
        rounded="md"
        // boxShadow="md"
        // _focus={{
        //   boxShadow: "outline",
        // }}
        //--size and spacing--
        px={3}
        py={1}
        flexDir="row"
        h="100%"
        //--checked--
        _checked={{
          borderColor: "blue.400",
          opacity: 1,
        }}
        //--not checked--
        opacity={props.disabled ? 0.3 : 1}
        //--misc--
        cursor="pointer"
      >
        <HStack>
          <Icon as={props.icon} boxSize={4} />
          <Text w="100%" noOfLines={1}>
            {props.name}
          </Text>
          <Show above="sm">
            <Radio isChecked={input.checked} hidden={props.disabled} />
          </Show>
        </HStack>
        <Text noOfLines={2} fontSize={"xs"} color="gray">
          {props.description}
        </Text>
      </Box>
    </Box>
  );
}
