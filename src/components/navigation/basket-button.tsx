import { Button, Link } from "@chakra-ui/react";

export default function BasketButton(): JSX.Element {
    
    return (
    <Link href={"/user/basket"}>
        <Button>Basket</Button>
    </Link>
    )
}