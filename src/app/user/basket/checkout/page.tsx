"use client";
import { RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";
import CheckoutPage from "@/components/checkout/checkout-page";
import { useBasketState, useUserState } from "@/zustand/store";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";


export default function Page(): JSX.Element {

  const user = useUserState((state) => state.user);
  const basket = useBasketState((state) => state.basket);
  const fetchBasket = useBasketState((state) => state.fetchBasket);

  useEffect(() => {
    fetchBasket()
  }, [user]);

  if (!basket || !basket.items?.length) {
    return (
      <Box w="full" display="flex" justifyContent="center">
        <Text>Basket is empty</Text>
        <Link href="/">
          <Text>Click here to shop for products</Text>
        </Link>
      </Box>
    );
  }

  return (
    <RenderPageIfLoggedIn>
      <Box w="full" display="flex" justifyContent="center" marginTop="1em">
        <CheckoutPage params={{ basket: basket }} />
      </Box>
    </RenderPageIfLoggedIn>
  );
}
