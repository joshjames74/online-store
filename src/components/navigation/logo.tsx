import Link from "next/link";
import { HomeOutlined } from "@ant-design/icons";
import { Box, Button } from "@chakra-ui/react";


export default function Logo(): JSX.Element {
  return (
    <Link href="/">
      <Button fontSize="xl" className="secondary-button">
        <HomeOutlined />
      </Button>
    </Link>
  );
}
