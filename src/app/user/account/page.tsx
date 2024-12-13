import AccountPage from "@/components/account/account-page";
import { RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";

export default function Page(): JSX.Element {
  return (
    <RenderPageIfLoggedIn>
      <>
        <title>Account</title>
        <AccountPage />
      </>
    </RenderPageIfLoggedIn>
  );
}
