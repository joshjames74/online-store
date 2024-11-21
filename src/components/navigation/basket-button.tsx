import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Link } from "@chakra-ui/react";

export default function BasketButton(): JSX.Element {
  return (
    <Link href={"/user/basket"}>
      <Button fontSize="2xl">
        <ShoppingCartOutlined />
      </Button>
    </Link>
  );
}
