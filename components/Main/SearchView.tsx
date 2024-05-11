import { AddIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Checkbox,
  Divider,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { debugMode } from "services/constants";

import { FiSearch } from "react-icons/fi";

type SearchViewProps = {
  prompt?: string;
  setIn: PairProps[];
  setOut?: PairProps[];
  isAdmin?: boolean | undefined;
  isEdit?: boolean;
  columns?: number | number[];
};
type PairProps = {
  name: string; //search matching
  rank?: string; //sorting
  widget: ReactNode;
};
export default function SearchView(props: SearchViewProps) {
  //sort setIn, setOut
  const setIn = props.setIn.sort(function (a, b) {
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
  const setOut = props.setOut
    ? props.setOut.sort(function (a, b) {
        if (a.rank == undefined) a.rank = a.name;
        if (b.rank == undefined) b.rank = b.name;
        if (a.rank < b.rank) {
          return -1;
        }
        if (a.rank > b.rank) {
          return 1;
        }
        return 0;
      })
    : [];
  //state
  const [checked, setChecked] = useState(false);
  const [query, setQuery] = useState("");
  const [subset, setSubset] = useState(checked ? setOut : setIn);
  //functions
  function filtered(pairset: PairProps[], q: string) {
    return pairset.filter((pair) => {
      return q === "" || pair.name.toLowerCase().includes(q.toLowerCase());
    });
  }
  //handlers
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    checked
      ? setSubset(filtered(setOut, e.target.value))
      : setSubset(filtered(setIn, e.target.value));
  };
  //reactive
  useEffect(() => {
    setSubset(checked ? setOut : setIn);
  }, [props.isEdit, props.setIn, props.setOut]);
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
        {props.setOut && (
          <Checkbox
            colorScheme="red"
            isChecked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              e.target.checked
                ? setSubset(filtered(setOut, query))
                : setSubset(filtered(setIn, query));
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
            {subset.map((pair) => pair.widget)}
          </SimpleGrid>
        )}
        <Box h={"8px"}></Box>
      </Stack>
      <Box minH={"calc(50px + env(safe-area-inset-bottom))"}></Box>
    </>
  );
}
