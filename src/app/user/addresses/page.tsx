import AddressesPage from "@/components/address/address-page";
import { RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";

export default function Page(): JSX.Element {
  return (
    <RenderPageIfLoggedIn>
      <>
        <title>Addresses</title>
        <AddressesPage />
      </>
    </RenderPageIfLoggedIn>
  );
}
