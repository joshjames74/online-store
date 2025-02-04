import { Button } from "@chakra-ui/react";
import Link from "next/link";

export default function SignInButton(): JSX.Element {
  return (
    <Link href="/auth/signin">
      <Button className="secondary-button">Sign in</Button>
    </Link>
  );
}
