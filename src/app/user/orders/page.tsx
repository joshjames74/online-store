"use client";
import { RenderComponentIfLoggedIn } from "@/components/auth/render-conditionally";
import OrderPage from "@/components/order/order-page";
import { UserContext } from "@/contexts/user-context";
import { useContext } from "react";

export default function Page(): JSX.Element {
  const { user } = useContext(UserContext);
  return (
    <RenderComponentIfLoggedIn>
      <OrderPage params={{ id: user.id }} />
    </RenderComponentIfLoggedIn>
  );
}
