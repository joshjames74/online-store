import { RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";
import BasketPage from "@/components/basket/basket-page";
import { Center } from "@chakra-ui/react";

export default function Page(): JSX.Element {
  return (
    <RenderPageIfLoggedIn>
      <Center>
        <title>Basket</title>
        <BasketPage />
      </Center>
    </RenderPageIfLoggedIn>
  );
}
