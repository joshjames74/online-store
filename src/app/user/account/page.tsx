import AccountPage from "@/components/account/account-page";
import { RenderComponentIfLoggedIn } from "@/components/auth/render-conditionally";

export default function Page(): JSX.Element {
  return (
    <RenderComponentIfLoggedIn>
      <AccountPage />
    </RenderComponentIfLoggedIn>
  );
}
