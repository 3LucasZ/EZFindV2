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
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import imageCompression from "browser-image-compression";
import { debugMode } from "services/constants";
type PageProps = {
  onClose: () => void;
  isOpen: boolean;
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
          setPreviewImage(reader.result);
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
  async function uploadImage() {
    Buffer.from(previewImage, "base64");
  }
  return (
    <Modal
      onClose={() => {
        setPreviewImage("");
        props.onClose();
      }}
      isOpen={props.isOpen}
      isCentered
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
          {!previewImage ? (
            <Box
              bg="white"
              w="100%"
              aspectRatio={1}
              borderColor="gray.300"
              borderStyle="dashed"
              borderWidth="2px"
              rounded="md"
              textAlign={"center"}
            >
              <Icon as={IoCloudUploadOutline} mt="6" boxSize={"50%"} />
              <Heading fontSize="lg" color="gray.700" fontWeight="bold" mt="4">
                Click to Upload Image
              </Heading>
            </Box>
          ) : (
            <Box
              w="100%"
              aspectRatio={1}
              backgroundImage={previewImage}
              backgroundRepeat={"no-repeat"}
              backgroundSize={"contain"}
              backgroundPosition={"center"}
              rounded="md"
              borderColor="gray.300"
              borderStyle="dashed"
              borderWidth={"2px"}
            />
          )}
        </Box>
        <IconButton
          aria-label={""}
          colorScheme="green"
          icon={<CheckIcon />}
          isDisabled={!previewImage}
          display={previewImage ? "block" : "none"}
        />
      </ModalContent>
    </Modal>
  );
}
