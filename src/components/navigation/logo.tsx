import Image from "next/image";
import logo from "./../../app/logo.png";
import Link from "next/link";


export default function Logo(): JSX.Element {
    return <Link href="/"><Image src={logo} alt="logo" objectFit="cover" width={150} /></Link>
}