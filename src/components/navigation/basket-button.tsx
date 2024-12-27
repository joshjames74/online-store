"use client";
import { useBasketState } from "@/zustand/store";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, HStack, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";


export default function BasketButton(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const basket = useBasketState((state) => state.basket);

  useEffect(() => {
    setCount(basket?.metadata?.count || 0);
  }, [basket]);

  return (
    <Link href={"/user/basket"}>
      <Button className="secondary-button" gap="0.5em">
          <ShoppingCartOutlined />
          {count && count > 0 ? count : <></>}
      </Button>
    </Link>
  );
}
