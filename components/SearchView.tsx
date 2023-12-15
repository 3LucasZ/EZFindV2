import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Checkbox,
  Flex,
  IconButton,
  Input,
  useDimensions,
} from "@chakra-ui/react";
import Router from "next/router";
import { ReactNode, useState, useRef } from "react";

type SearchViewProps = {
  setIn: PairProps[];
  setOut?: PairProps[];
  url?: string;
  isAdmin: boolean;
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

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(elementRef, true);
  const yOffset = dimensions == null ? 0 : dimensions.borderBox.y;
  const [checked, setChecked] = useState(false);
  const [query, setQuery] = useState("");
  const [subset, setSubset] = useState(checked ? setOut : setIn);

  function filtered(pairset: PairProps[], q: string) {
    console.log(pairset);
    console.log(q);
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
        {props.url && props.isAdmin && (
          <IconButton
            ml={2}
            mr={2}
            colorScheme="teal"
            aria-label="edit"
            icon={<AddIcon />}
            onClick={() =>
              Router.push({
                pathname: props.url,
              })
            }
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
        ref={elementRef}
        flexDir="column"
        gap="2"
        overflowY="auto"
        px={[2, "5vw", "10vw", "15vw"]}
        h="100%"
      >
        {subset.length == 0 ? (
          <Center>No data available to display.</Center>
        ) : (
          subset.map((pair) => pair.widget)
        )}
      </Flex>
      <Box h={"calc(100px + 2 * env(safe-area-inset-bottom))"}></Box>
    </>
  );
}
