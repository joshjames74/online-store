import { RenderComponentIfLoggedIn } from "@/components/auth/render-conditionally";
import OrderPage from "@/components/order/order-page";


export default function Page(): JSX.Element {
  return (
    <RenderComponentIfLoggedIn>
      <OrderPage />
    </RenderComponentIfLoggedIn>
  );
}
