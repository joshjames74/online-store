import {
  Card,
  CardHeader,
  Heading,
  Divider,
  CardFooter,
  Stack,
  Select,
  Button,
  CircularProgress,
  Box,
} from "@chakra-ui/react";
import styles from "./product-page.module.css";
import { useContext, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { getBasketByUserId, postBasketItem } from "@/api/request/basketRequest";
import { useRouter } from "next/navigation";
import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";
import { useUserState } from "@/zustand/store";

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

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await postBasketItem({
        usrId: user.id,
        productId: id,
        quantity: quantity,
      });
    } catch (error) {
      setIsSuccessful(false);
      console.error(error);
    } finally {
      await getBasketByUserId(user.id, "reload");
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
      if (isSuccessful) {
        router.push("/user/basket");
      }
    }
  };

  return (
    <Card minW="2xs" className={styles.basket_container}>
      <CardHeader>
        <Heading fontSize="lg" fontWeight="semibold">
          Add to basket
        </Heading>
      </CardHeader>
      <Divider color={theme.colors.border.background} />
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
            // to do: change to if authenticated
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
            bgColor={theme.colors.accent.secondary}
            onClick={handleClick}
          >
            {!user.id ? "Sign in to add to basket" : "Add to basket"}
          </Button>
          <Button bgColor={theme.colors.accent.primary}>Buy now</Button>
        </Stack>
      </CardFooter>
    </Card>
  );
}
