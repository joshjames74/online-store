import {
  Card,
  CardFooter,
  Stack,
  Select,
  Button,
  CircularProgress,
  Box,
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

  const [quantity, setQuantity] = useState<number>(0);
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
    <Card minW="2xs" maxW="2xl" h="fit-content" shadow="none">
      <CardFooter>
        <Stack w="full">
          <Select
            placeholder="Select quantity"
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
            isDisabled={!user.id}
            rightIcon={
              isLoading ? (
                <CircularProgress size="1em" isIndeterminate />
              ) : showSuccess ? (
                renderStatus(isSuccessful)
              ) : (
                <></>
              )
            }
            bgColor={theme.colors.accent.primary}
            onClick={handleClick}
          >
            {!user.id ? "Sign in to add to basket" : "Add to basket"}
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
}
