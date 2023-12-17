import { GridItem, Link, Text } from "@chakra-ui/react";

type BaseWidgetProps = {
  href?: string;
  title: string;
  bg: string;
  bgHover?: string;
  colSpan: number;
};

export default function BaseWidget({
  href,
  title,
  bg,
  colSpan,
  bgHover,
}: BaseWidgetProps) {
  return (
    <GridItem
      h={8}
      colSpan={colSpan}
      px={4}
      bg={bg}
      color="white"
      display="flex"
      overflow={"hidden"}
      _hover={{ bg: bgHover }}
    >
      <Link
        href={href}
        position="relative"
        display={"flex"}
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
        zIndex={1000}
        w="100%"
        h="100%"
        pointerEvents={href ? "auto" : "none"}
      >
        <Text noOfLines={1} h={6}>
          {title}
        </Text>
      </Link>
    </GridItem>
  );
}
