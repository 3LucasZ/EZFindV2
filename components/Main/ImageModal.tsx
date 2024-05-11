import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import imageCompression from "browser-image-compression";
import { debugMode } from "services/constants";
import imagePlaceholder from "public/images/image-placeholder.png";
type PageProps = {
  onClose: () => void;
  isOpen: boolean;
  onUpload: (image: string) => Promise<void>;
  imageStr?: string;
  canUpload: boolean;
};
export default function ImageModal(props: PageProps) {
  //state
  const [newImage, setNewImage] = useState("");
  //functions
  async function loadImage(input: ChangeEvent<HTMLInputElement>) {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function () {
        if (typeof reader.result == "string") {
          setNewImage(reader.result);
        }
      };
      const imageFile = input.target.files[0];
      if (debugMode)
        console.log(`original file size: ${imageFile.size / 1024 / 1024} MB`);
      const options = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(imageFile, options);
        if (debugMode)
          console.log(
            `compressed file size: ${compressedFile.size / 1024 / 1024} MB`
          );
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <Modal
      onClose={() => {
        setNewImage("");
        props.onClose();
      }}
      isOpen={props.isOpen}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent p={6} gap={6}>
        <Box h="100%" w="100%">
          <Input
            type="file"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            aria-hidden="true"
            accept="image/*"
            onChange={(e) => loadImage(e)}
            hidden={!props.canUpload} //PROTECTED
          />
          <Box
            w="100%"
            aspectRatio={1}
            backgroundImage={
              newImage
                ? newImage
                : props.imageStr
                ? `url(/api/${props.imageStr})`
                : `url(${imagePlaceholder.src})`
            }
            // backgroundImage={render}
            backgroundRepeat={"no-repeat"}
            backgroundSize={"contain"}
            backgroundPosition={"center"}
            rounded="lg"
            borderColor="gray.300"
            borderStyle={!newImage && !props.imageStr ? "dashed" : "solid"}
            borderWidth={"2px"}
            textAlign={"center"}
          >
            {!newImage && !props.imageStr && (
              <Text
                fontSize={["sm", "lg"]}
                color="gray.700"
                fontWeight="bold"
                position={"absolute"}
                bottom="20%"
                left="0"
                right="0"
                hidden={!props.canUpload} //PROTECTED
              >
                Click to upload an image
              </Text>
            )}
          </Box>
        </Box>
        <IconButton
          aria-label={""}
          colorScheme="green"
          icon={<CheckIcon />}
          isDisabled={!newImage}
          display={newImage ? "block" : "none"}
          onClick={async (e) => newImage && props.onUpload(newImage)}
        />
      </ModalContent>
    </Modal>
  );
}
