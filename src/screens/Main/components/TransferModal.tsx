import { transfer } from "@app/api/api";
import Input from "@app/components/UI/Input";
import { useAuth } from "@app/context/AuthContext";
import { useColors } from "@app/context/ColorContex";
import { RootState } from "@app/redux/store";
import {
  faCheck,
  faQuestion,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  FormControl,
  HStack,
  Modal,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";

interface IProps {
  isOpen: boolean;
  onToggle: () => void;
  onPress: () => void;
}

const TransferModal: React.FC<IProps> = ({ isOpen, onToggle, onPress }) => {
  const {
    currentAddress,
    allAddresses,
    balances,
    txId,
    txStatus,
    txResult,
    expectedTick,
    setExpectedTick,
    setTxStatus,
  } = useAuth();
  const { bgColor, main } = useColors();
  const { tick } = useSelector((state: RootState) => state.app);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const modal1 = useDisclose();
  const modal2 = useDisclose();

  const handleTransfer = () => {
    if (toAddress == "" || amount == "" || amount == "0") {
      Toast.show({ type: "error", text1: "Invalid address or amount!" });
      return;
    }
    setTxStatus("open");
    const expectedTick = parseInt(tick) + 5;
    setExpectedTick(expectedTick);
    transfer(
      toAddress,
      allAddresses.indexOf(currentAddress),
      amount,
      expectedTick
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onToggle}
        avoidKeyboard
        size="lg"
        _backdrop={{
          _dark: {
            bg: "coolGray.600",
          },
          _light: {
            bg: "warmGray.50",
          },
          opacity: 0.8,
        }}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body bgColor={bgColor}>
            <VStack justifyContent={"center"} py={6} space={2}>
              {/* <TokenSelect onChnage={() => {}}></TokenSelect> */}
              <Text>Send Address</Text>
              <Input
                onChangeText={setToAddress}
                placeholder="Send to address"
                type="text"
                w={"full"}
              ></Input>
              <Text>Amount</Text>
              <Input
                onChangeText={setAmount}
                placeholder="Amount"
                type="text"
                w={"full"}
              ></Input>
              <Text>{balances[currentAddress]}</Text>
            </VStack>
            <HStack justifyContent={"center"} space={3}>
              <Button
                onPress={onToggle}
                w={"1/2"}
                rounded={"md"}
                _pressed={{ opacity: 0.6 }}
                bgColor={"red.500"}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  onToggle();
                  modal1.onToggle();
                }}
                w={"1/2"}
                rounded={"md"}
                _pressed={{ opacity: 0.6 }}
                bgColor={main.celestialBlue}
                //   isDisabled={addingStatus}
              >
                Send
              </Button>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <ConfirmModal
        icon={faQuestion}
        isOpen={modal1.isOpen}
        onToggle={modal1.onToggle}
        onPress={() => {
          handleTransfer();
          modal1.onToggle();
          modal2.onToggle();
        }}
      >
        <VStack fontSize={"xl"} textAlign={"center"} px={2}>
          <FormControl>
            <FormControl.Label>To Address</FormControl.Label>
            <Text ml={3}>{toAddress}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Amount</FormControl.Label>
            <Text ml={3}>{amount} QU</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Token</FormControl.Label>
            <Text ml={3}>QU</Text>
          </FormControl>
        </VStack>
      </ConfirmModal>
      <ConfirmModal
        icon={txStatus == "Success" ? faCheck : faShare}
        isOpen={modal2.isOpen}
        onToggle={modal2.onToggle}
        onPress={modal2.onToggle}
      >
        <VStack fontSize={"xl"} textAlign={"center"} px={2}>
          <FormControl>
            <FormControl.Label>Status</FormControl.Label>
            <Text ml={3}>{txStatus}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Transaction ID</FormControl.Label>
            <Text ml={3}>{txId}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Current Tick</FormControl.Label>
            <Text ml={3}>{tick}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Expected Tick</FormControl.Label>
            <Text ml={3}>{expectedTick}</Text>
          </FormControl>
        </VStack>
      </ConfirmModal>
    </>
  );
};

export default TransferModal;
