import AddressForm from "@/components/address/address-form";
import { RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";

export default function Page(): JSX.Element {
  return (
    <RenderPageIfLoggedIn>
      <>
        <title>Add Address</title>
        <AddressForm />
      </>
    </RenderPageIfLoggedIn>
  )
}
