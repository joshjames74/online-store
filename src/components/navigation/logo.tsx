import Image from "next/image";
import logo from "./../../app/logo.png";
import Link from "next/link";
import { HomeOutlined } from "@ant-design/icons";
import { Button } from "@chakra-ui/react";
import styles from "./index.module.css";


// export default function Logo(): JSX.Element {
//     return <Link href="/"><Image src={logo} alt="logo" objectFit="cover" width={150} /></Link>
// }

export default function Logo(): JSX.Element {
    return (
    <Link href="/">
        <Button className={styles.nav_container} fontSize="2xl">
            <HomeOutlined />
        </Button>
    </Link>
    )
}