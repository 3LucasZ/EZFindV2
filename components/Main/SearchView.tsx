import {
  Box,
  Center,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

import { FiSearch } from "react-icons/fi";

type SearchViewProps = {
  prompt?: string;
  set: SearchElementProps[];
  isEdit?: boolean;
  invertible?: boolean;
  columns?: number | number[];
};
type SearchElementProps = {
  name: string; //search matching
  rank?: string; //custom sorting (not just based on name)
  inverted?: boolean;
  widget: ReactNode;
};
export default function SearchView(props: SearchViewProps) {
  //sort the set
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

  //state
  const [checked, setInverted] = useState(false);
  const [query, setQuery] = useState("");
  const [subset, setSubset] = useState(filtered(set, query, false));

  // reactive
  useEffect(() => {
    setSubset(filtered(set, query, false));
  }, [props.isEdit, props.set]);

  //functions
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

  //handlers
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSubset(filtered(set, e.target.value, checked));
  };

  console.log("subset", subset);
  console.log("checked", checked);

  //ret
  return (
    <>
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
            isChecked={checked}
            onChange={(e) => {
              setInverted(e.target.checked);
              setSubset(filtered(set, query, e.target.checked));
            }}
          >
            Invert
          </Checkbox>
        )}
      </Flex>
      <Box minH={"8px"}></Box>
      <Divider></Divider>
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
        <Box h={"8px"}></Box>
      </Stack>
      <Box minH={"calc(50px + env(safe-area-inset-bottom))"}></Box>
    </>
  );
}
