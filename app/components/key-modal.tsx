import {
  USER_PRIVATE_KEY_SECURE_LOCAL_STORAGE_KEY,
  USER_PUBLIC_KEY_SECURE_LOCAL_STORAGE_KEY,
} from "@/lib/constants";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Alert,
  Input,
  Textarea,
} from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { UserContext } from "../context/UserContextProvider";
import CreateKeyInstructionImage from "@/assets/create-key-instruction.png";
import NextImage from "next/image";

export const KeyModal = () => {
  const { setPrivateKey, setAccessKey } = useContext(UserContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [accessKeyInput, setAccessKeyInput] = useState("");

  useEffect(() => {
    const storedPrivateKey = secureLocalStorage.getItem(
      USER_PRIVATE_KEY_SECURE_LOCAL_STORAGE_KEY,
    ) as string;
    const storedAccessKey = secureLocalStorage.getItem(
      USER_PUBLIC_KEY_SECURE_LOCAL_STORAGE_KEY,
    ) as string;
    console.log(storedPrivateKey, storedAccessKey);
    if (!storedPrivateKey || !storedAccessKey) {
      onOpen();
    } else {
      setPrivateKey(storedPrivateKey);
      setAccessKey(storedAccessKey);
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={"xl"}
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add your keys to continue
            </ModalHeader>
            <ModalBody>
              <p>
                We use your API key to sign your requests to the Kalshi API and
                to retrieve your account information securely.
              </p>{" "}
              <p>
                To find your keys, go to &#34;Account & Security&#34;, then
                scroll all the way down to the &#34;API Keys&#34; section. Then
                create an API key.
              </p>
              <NextImage
                src={CreateKeyInstructionImage}
                alt="API Keys"
                className="border-2 border-black rounded-xl"
              />
              <Alert
                color={"warning"}
                title={`Never share your private key with anyone. We securely encrypt and store your private key on your local device.`}
              />
              <Input
                label={"API Key Id"}
                placeholder={"Enter your Key Id"}
                onChange={(e) => setAccessKeyInput(e.target.value)}
              />
              <Textarea
                label={"Private Key"}
                placeholder={`-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
`}
                onChange={(e) => setPrivateKeyInput(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  setPrivateKey(privateKeyInput);
                  setAccessKey(accessKeyInput);
                  secureLocalStorage.setItem(
                    USER_PRIVATE_KEY_SECURE_LOCAL_STORAGE_KEY,
                    privateKeyInput,
                  );
                  secureLocalStorage.setItem(
                    USER_PUBLIC_KEY_SECURE_LOCAL_STORAGE_KEY,
                    accessKeyInput,
                  );
                  onClose();
                }}
                isDisabled={!privateKeyInput || !accessKeyInput}
              >
                Store Keys
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
