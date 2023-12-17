import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Checkbox,
  Flex,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { debugMode } from "services/constants";

type SearchViewProps = {
  setIn: PairProps[];
  setOut?: PairProps[];
  onAdd?: Function;
  isAdmin: boolean;
  isEdit: boolean;
};
type PairProps = {
  name: string;
  widget: ReactNode;
};
export default function SearchView(props: SearchViewProps) {
  //sort setIn, setOut
  const setIn = props.setIn.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  const setOut = props.setOut
    ? props.setOut.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
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
    if (debugMode) console.log(pairset);
    if (debugMode) console.log(q);
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
      <Flex gap={"8px"} px={[2, "5vw", "10vw", "15vw"]}>
        <Input
          variant="filled"
          placeholder="Search"
          type="search"
          value={query}
          onChange={handleSearchQueryChange}
        />
        {props.onAdd && props.isAdmin && (
          <IconButton
            colorScheme="teal"
            aria-label="edit"
            icon={<AddIcon />}
            onClick={() => props.onAdd && props.onAdd()}
          />
        )}
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
      <Flex
        flexDir="column"
        gap="8px"
        overflowY="auto"
        px={[2, "5vw", "10vw", "15vw"]}
        h="100%"
      >
        {subset.length == 0 ? (
          <Center>No data available to display.</Center>
        ) : (
          subset.map((pair) => {
            return pair.widget;
          })
        )}
      </Flex>
      <Box minH={"calc(58px + env(safe-area-inset-bottom))"}></Box>
    </>
  );
}
