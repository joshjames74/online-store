"use client";
import { RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";
import CheckoutPage from "@/components/checkout/checkout-page";
import { useBasketState } from "@/zustand/store";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";


export default function Page(): JSX.Element {
  const basket = useBasketState((state) => state.basket);

  if (!basket || !basket.items?.length) {
    return (
      <>
        <title>Checkout</title>
        <Box w="full" display="flex" justifyContent="center">
          <Text>Basket is empty</Text>
          <Link href="/">
            <Text>Click here to shop for products</Text>
          </Link>
        </Box>
      </>
    );
  }

  return (
    <RenderPageIfLoggedIn>
      <>
        <title>Checkout</title>
        <Box w="full" display="flex" justifyContent="center" marginTop="1em">
          <CheckoutPage params={{ basket: basket }} />
        </Box>
      </>
    </RenderPageIfLoggedIn>
  );
}
