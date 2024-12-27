import {
  Card,
  CardFooter,
  Stack,
  Select,
  Button,
  CircularProgress,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { useRouter } from "next/navigation";
import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";
import { useBasketState, useUserState } from "@/zustand/store";

export default function ProductBasketCard({
  props,
}: {
  props: { id: number };
}): JSX.Element {
  const user = useUserState((state) => state.user);
  const { theme } = useContext(ThemeContext);

  const router = useRouter();

  const { id } = props;
  const maxQuantity = 30;

  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const postBasketItem = useBasketState((state) => state.postBasketItem);

  const renderStatus = (successful: boolean): JSX.Element => {
    return (
      <Box
        color={
          successful
            ? theme.colors.semantic.success
            : theme.colors.semantic.error
        }
      >
        {successful ? <CheckCircleFilled /> : <CloseCircleOutlined />}
      </Box>
    );
  };

  const handleClick = () => {
    setIsLoading(true);
    postBasketItem(id, quantity)
      .catch((error) => {
        setIsSuccessful(false);
        console.error(error);
      })
      .finally(() => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
        if (isSuccessful) {
          router.push("/user/basket");
        }
      });
  };

  return (
    <HStack w="240px" h="fit-content">
        <Select 
          w="30%"
          className="select"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        >
          {Array.from({ length: maxQuantity }).map((_, index: number) => (
            <option value={index + 1} key={index}>
              {index + 1}
            </option>
          ))}
        </Select>
        <Button
          w="70%"
          isDisabled={!user.id}
          className="primary-button"
          rightIcon={
            isLoading ? (
              <CircularProgress size="1em" isIndeterminate />
            ) : showSuccess ? (
              renderStatus(isSuccessful)
            ) : (
              <></>
            )
          }
          onClick={handleClick}
        >
          {!user.id ? "Sign in to add to basket" : "Add to basket"}
        </Button>
    </HStack>
  );
}
