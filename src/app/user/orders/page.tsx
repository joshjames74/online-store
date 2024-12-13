import { RenderComponentIfLoggedIn, RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";
import OrderPage from "@/components/order/order-page";


export default function Page(): JSX.Element {
  return (
    <RenderPageIfLoggedIn>
      <>
        <title>Orders</title>
        <OrderPage />
      </>
    </RenderPageIfLoggedIn>
  );
}
