import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Checkbox,
  Flex,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { debugMode } from "services/constants";

type SearchViewProps = {
  setIn: PairProps[];
  setOut?: PairProps[];
  onAdd?: Function;
  isAdmin: boolean;
  editing: boolean;
};
type PairProps = {
  name: string;
  widget: ReactNode;
};
export default function SearchView(props: SearchViewProps) {
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

  const [checked, setChecked] = useState(false);
  const [query, setQuery] = useState("");
  const [subset, setSubset] = useState(checked ? setOut : setIn);
  console.log("editing", props.editing);
  console.log("hi");
  function filtered(pairset: PairProps[], q: string) {
    if (debugMode) console.log(pairset);
    if (debugMode) console.log(q);

    return pairset.filter((pair) => {
      return q === "" || pair.name.toLowerCase().includes(q.toLowerCase());
    });
  }

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    checked
      ? setSubset(filtered(setOut, e.target.value))
      : setSubset(filtered(setIn, e.target.value));
  };
  return (
    <>
      <Flex gap={2} pb={5} px={[2, "5vw", "10vw", "15vw"]}>
        <Input
          variant="filled"
          placeholder="Search"
          type="search"
          value={query}
          onChange={handleSearchQueryChange}
        />
        {props.onAdd && props.isAdmin && (
          <IconButton
            ml={2}
            mr={2}
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
      <Flex
        flexDir="column"
        gap="2"
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
      <Box h={"calc(100px + 2 * env(safe-area-inset-bottom))"}></Box>
    </>
  );
}
