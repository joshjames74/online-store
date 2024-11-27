"use client";
import { getBasketByUserId } from "@/api/request/basketRequest";
import { UserContext } from "@/contexts/user-context";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, HStack, Link, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

export default function BasketButton(): JSX.Element {
  const { user } = useContext(UserContext);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadCount = () => {
    if (!user || !user.id) {
      return;
    }
    setIsLoading(true);
    getBasketByUserId(user.id)
      .then((res) => {
        setCount(res.metadata.count);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadCount();
  }, []);

  useEffect(() => {
    loadCount();
  }, [user]);

  return (
    <Link href={"/user/basket"}>
      <Button fontSize="2xl">
        <HStack>
          <ShoppingCartOutlined />
          <Text display={count && count > 0 ? "block" : "none"} fontSize="md">
            ({count && count > 0 ? count : <></>})
          </Text>
        </HStack>
      </Button>
    </Link>
  );
}
