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
  onUpload: (imageStr: string) => Promise<void>;
  imageStr?: string;
};
export default function ImageModal(props: PageProps) {
  //state
  const [previewImage, setPreviewImage] = useState("");
  //functions
  async function loadImage(input: ChangeEvent<HTMLInputElement>) {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function () {
        if (typeof reader.result == "string") {
          setPreviewImage(reader.result.split("base64,")[1]);
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
        setPreviewImage("");
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
          />
          <Box
            w="100%"
            aspectRatio={1}
            backgroundImage={
              !previewImage && !props.imageStr
                ? `url(${imagePlaceholder.src})`
                : "data:image/jpeg;base64," +
                  (previewImage ? previewImage : props.imageStr)
            }
            backgroundRepeat={"no-repeat"}
            backgroundSize={"contain"}
            backgroundPosition={"center"}
            rounded="lg"
            borderColor="gray.300"
            borderStyle={!previewImage && !props.imageStr ? "dashed" : "solid"}
            borderWidth={"2px"}
            textAlign={"center"}
          >
            {!previewImage && !props.imageStr && (
              <Text
                fontSize={["sm", "lg"]}
                color="gray.700"
                fontWeight="bold"
                position={"absolute"}
                bottom="20%"
                left="0"
                right="0"
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
          isDisabled={!previewImage}
          display={previewImage ? "block" : "none"}
          onClick={async (e) => props.onUpload(previewImage)}
        />
      </ModalContent>
    </Modal>
  );
}
