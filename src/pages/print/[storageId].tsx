import {
  Text,
  Button,
  Center,
  Heading,
  SimpleGrid,
  Stack,
  Link,
  Image as ChImage,
  Box,
  Flex,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useQRCode } from "next-qrcode";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Select } from "chakra-react-select";
import Layout from "components/Layout/Layout";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { fixate, genXML } from "services/genXML";
import Header from "components/Header";
import { UserProps } from "components/Widget/UserWidget";

type Props = {
  url: string;
  xml: string;
  id: number;
  name: string;
};

type LabelWriterPrinter = {
  id: number;
  name: string;
  modelName: string;
  isConnected: boolean;
  isLocal: boolean;
  isTwinTurbo: boolean;
};

const StoragePage: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  //rest
  const [img, setImg] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [printers, setPrinters] = useState<LabelWriterPrinter[]>([]);
  const [options, setOptions] = useState<{ value: number; label: string }[]>(
    []
  );
  const [value, setValue] = useState<{ value: number; label: string }>();
  //UI
  const NoDymoUI = (
    <Stack spacing={3}>
      <Center>
        <Heading>Dymo</Heading>
      </Center>
      <Text fontSize="2xl">
        Sorry, you can not use the automatic DYMO print feature. We could not
        detect the DYMO Connect service on your device. Please checkout
        <Box color="teal.500" onClick={() => Router.push("/help")}>
          {" our instructions "}
        </Box>
        on how to enable the service. Thank you!
      </Text>
    </Stack>
  );
  //useEffect
  useEffect(() => {
    const fetchData = async () => {
      const Dymo = require("dymojs"),
        dymo = new Dymo();
      //dymo
      await dymo //get sticker preview as h265 string
        .renderLabel(props.xml)
        .then((imageData: string) => {
          setImg(imageData.slice(1, -1));
        })
        .catch((err: any) => {
          setImg("");
        });
      await dymo //get service connection status
        .getStatus()
        .then((dymoStatus: string) => {
          setStatus(dymoStatus);
        })
        .catch((err: any) => {
          setStatus("");
        });
      await dymo //get connected printers
        .getPrinters()
        .then((dymoPrintersXML: string) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(dymoPrintersXML, "text/xml");
          const printers: LabelWriterPrinter[] = [];
          Array.from(
            {
              length: xmlDoc.getElementsByTagName("LabelWriterPrinter").length,
            },
            (x, i) => {
              const name =
                xmlDoc.getElementsByTagName("LabelWriterPrinter")[i]
                  .childNodes[0].childNodes[0].nodeValue;
              const modelName =
                xmlDoc.getElementsByTagName("LabelWriterPrinter")[i]
                  .childNodes[1].childNodes[0].nodeValue;
              const isConnected =
                xmlDoc.getElementsByTagName("LabelWriterPrinter")[i]
                  .childNodes[2].childNodes[0].nodeValue == "True";
              const isLocal =
                xmlDoc.getElementsByTagName("LabelWriterPrinter")[i]
                  .childNodes[3].childNodes[0].nodeValue == "True";
              const isTwinTurbo =
                xmlDoc.getElementsByTagName("LabelWriterPrinter")[i]
                  .childNodes[4].childNodes[0].nodeValue == "True";
              printers.push({
                id: i,
                name: name!,
                modelName: modelName!,
                isConnected: isConnected,
                isLocal: isLocal,
                isTwinTurbo: isTwinTurbo,
              });
            }
          );
          setPrinters(printers);
          const options = printers.map((printer) => ({
            value: printer.id,
            label: printer.name,
          }));
          setOptions(options);
          setValue(options[0]);
          console.log(options[0]);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    fetchData().catch((e) => {
      console.error("An error occured while fetching the data: ", e);
    });
  }, []);

  const { Image } = useQRCode();

  // console.log("url", props.url);
  // console.log("id", props.id);
  // console.log("xml", props.xml);

  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Box overflowY="auto">
        <SimpleGrid columns={[1, 2]} spacing={10} px={5}>
          {/* DYMO Printing */}
          {img == "" ? (
            NoDymoUI
          ) : (
            <Flex flexDir="column">
              <Center>
                <Heading>Dymo</Heading>
              </Center>
              <Center>
                <Text>Quickly and easily print using a Dymo Printer.</Text>
              </Center>
              <SimpleGrid columns={[1, 1, 2]} spacing="8px">
                <Center>
                  <ChImage
                    padding="4"
                    bgColor="teal.100"
                    borderRadius="3vmin"
                    src={"data:image/png;base64, " + img}
                    alt="label"
                  />
                </Center>
                <Stack spacing={3}>
                  <Select value={value} options={options} />
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      console.log("Print");
                      const Dymo = require("dymojs"),
                        dymo = new Dymo();
                      dymo
                        .print(value?.label, props.xml)
                        .then((response: any, result: any) => {
                          console.log(
                            "Response: ",
                            response,
                            "result: ",
                            result
                          );
                        })
                        .catch(() => {
                          Router.push({ pathname: "/print/" + props.id });
                        });
                    }}
                  >
                    Print
                  </Button>
                  <Box
                    bg={status ? "green.400" : "tomato"}
                    color="white"
                    borderRadius="md"
                    p={2}
                    textAlign={"center"}
                  >
                    {status
                      ? "DYMO Service Connected"
                      : "DYMO Service Disconnected"}
                  </Box>
                  <Box
                    bg={
                      value != null && printers[value.value].isConnected
                        ? "green.400"
                        : "tomato"
                    }
                    p={2}
                    color="white"
                    borderRadius="md"
                    textAlign={"center"}
                  >
                    {value != null && printers[value.value].isConnected
                      ? "Printer Connected"
                      : "Printer Disconnected"}
                  </Box>
                </Stack>
              </SimpleGrid>
            </Flex>
          )}
          {/* Manual Printing */}
          <Flex flexDir="column">
            <Center>
              <Heading>Manual</Heading>
            </Center>
            <Center>
              <Text>
                To manually print a QR code, take a screenshot of the image
                below and print it.
              </Text>
            </Center>
            <Box h="8px" />
            <Center>
              <Box
                borderColor="black"
                borderWidth={2}
                width="max-content"
                p={10}
              >
                <Image
                  text={props.url}
                  options={{
                    type: "image/jpeg",
                    quality: 0.3,
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: {
                      dark: "#4FD1C5FF",
                      light: "#FFFFFFFF",
                    },
                  }}
                />

                <Center>
                  <Text fontSize="2xl" whiteSpace="pre-line" textAlign="center">
                    {fixate(props.name)}
                  </Text>
                </Center>
              </Box>
            </Center>
          </Flex>
        </SimpleGrid>
        <Box minH={"calc(58px + env(safe-area-inset-bottom))"}></Box>
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const storage = await prisma.storage.findUnique({
    where: {
      id: Number(context.params?.storageId),
    },
    include: {
      itemRelations: true,
    },
  });

  const domain = context.req.headers.host;
  const path = "/storage/" + storage?.id;
  const url = "https://" + domain + path;
  const xml: string = genXML(url, "" + storage?.name);
  if (storage == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {
      url,
      xml,
      id: storage?.id,
      name: storage?.name,
    },
  };
};

export default StoragePage;
