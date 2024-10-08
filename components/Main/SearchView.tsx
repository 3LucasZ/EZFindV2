import {
  Box,
  Center,
  Checkbox,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";

import { FiSearch } from "react-icons/fi";

type SearchViewProps = {
  prompt?: string;
  set: SearchElementProps[];
  invertible?: boolean;
  columns?: number | number[];
};
type SearchElementProps = {
  name: string; //search matching
  rank?: string; //custom sorting (not just based on name)
  inverted?: boolean; //whether to show or not during invert
  widget: ReactNode;
};

export default function SearchView(props: SearchViewProps) {
  //--state--
  const [inverted, setInverted] = useState(false);
  const [query, setQuery] = useState("");

  //--sort the set by rank--
  const set = props.set.sort(function (a, b) {
    if (a.rank == undefined) a.rank = a.name;
    if (b.rank == undefined) b.rank = b.name;
    if (a.rank < b.rank) {
      return -1;
    }
    if (a.rank > b.rank) {
      return 1;
    }
    return 0;
  });
  const subset = filtered(set, query, inverted);

  //--functions--
  function filtered(
    set: SearchElementProps[],
    query: string,
    inverted: boolean
  ) {
    return set.filter((pair) => {
      return (
        ((inverted && pair.inverted) || (!inverted && !pair.inverted)) &&
        (query === "" || pair.name.toLowerCase().includes(query.toLowerCase()))
      );
    });
  }

  //--handlers--
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  //--ret--
  return (
    <>
      <Box minH={"8px"}></Box>
      <Flex gap={"8px"} w={["95%", "90%", "80%", "70%"]} alignSelf={"center"}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            variant="filled"
            placeholder={props.prompt ? props.prompt : "Search"}
            type="search"
            value={query}
            onChange={handleSearchQueryChange}
          />
        </InputGroup>

        {props.invertible && (
          <Checkbox
            colorScheme="red"
            isChecked={inverted}
            onChange={(e) => {
              setInverted(e.target.checked);
            }}
          >
            Invert
          </Checkbox>
        )}
      </Flex>
      <Box h={"8px"}></Box>
      {/* <Divider></Divider> */}
      <Stack
        overflowY="auto"
        sx={{ "::-webkit-scrollbar": { display: "none" } }} //remove annoying scrollbar
        flexDir={"column"}
        w={["95%", "90%", "80%", "70%"]}
        alignSelf={"center"}
      >
        <Box maxH={"8px"}></Box>
        {subset.length == 0 ? (
          <Center>No data available to display.</Center>
        ) : (
          <SimpleGrid gap="8px" columns={props.columns ? props.columns : 1}>
            {subset.map((pair) => {
              return pair.widget;
            })}
          </SimpleGrid>
        )}
        <Box minH={"8px"}></Box>
        <Box minH={"60px"}></Box>
      </Stack>
    </>
  );
}
