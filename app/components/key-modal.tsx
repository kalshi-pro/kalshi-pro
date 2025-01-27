import {
  USER_PRIVATE_KEY_SECURE_LOCAL_STORAGE_KEY,
  USER_PUBLIC_KEY_SECURE_LOCAL_STORAGE_KEY,
} from '@/lib/constants';
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
} from '@heroui/react';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContextProvider';
import CreateKeyInstructionImage from '@/assets/create-key-instruction.png';
import NextImage from 'next/image';

export const KeyModal = () => {
  const { setPrivateKey, setAccessKey, setKeysSet, setRendered } = useContext(UserContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [accessKeyInput, setAccessKeyInput] = useState('');

  useEffect(() => {
    const storedPrivateKey = localStorage.getItem(
      USER_PRIVATE_KEY_SECURE_LOCAL_STORAGE_KEY,
    ) as string;
    const storedAccessKey = localStorage.getItem(
      USER_PUBLIC_KEY_SECURE_LOCAL_STORAGE_KEY,
    ) as string;

    if (!storedPrivateKey || !storedAccessKey) {
      onOpen();
    } else {
      setPrivateKey(storedPrivateKey);
      setAccessKey(storedAccessKey);
      setKeysSet(true);
    }
    setRendered(true);
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={'4xl'} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white">
              Add your keys to continue
            </ModalHeader>
            <ModalBody className="text-white">
              <div className="flex h-full w-full flex-col items-start justify-center gap-4 sm:flex-row">
                <div className="flex w-3/5 flex-col gap-4 text-gray-300">
                  <p>
                    We use your API key to sign your requests to the Kalshi API and to retrieve your
                    account information securely.
                  </p>
                  <p>
                    To find your keys, go to &#34;Account & Security&#34;, then scroll all the way
                    down to the &#34;API Keys&#34; section. Then create an API key.
                  </p>
                  <NextImage
                    src={CreateKeyInstructionImage}
                    alt="API Keys"
                    className="rounded-xl border-2 border-black"
                  />
                </div>

                <div className="flex w-2/5 flex-col gap-4">
                  <Alert
                    color={'warning'}
                    title={`Never share your private key with anyone. We securely encrypt and store your private key on your local device.`}
                  />
                  <Input
                    label={'API Key Id'}
                    placeholder={'Enter your Key Id'}
                    onChange={(e) => setAccessKeyInput(e.target.value)}
                  />
                  <Textarea
                    label={'Private Key'}
                    placeholder={`-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
`}
                    onChange={(e) => setPrivateKeyInput(e.target.value)}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  setPrivateKey(privateKeyInput);
                  setAccessKey(accessKeyInput);
                  localStorage.setItem(USER_PRIVATE_KEY_SECURE_LOCAL_STORAGE_KEY, privateKeyInput);
                  localStorage.setItem(USER_PUBLIC_KEY_SECURE_LOCAL_STORAGE_KEY, accessKeyInput);
                  setKeysSet(true);
                  onClose();
                }}
                isDisabled={!privateKeyInput || !accessKeyInput}
              >
                Add Keys
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
