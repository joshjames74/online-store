import AddressesPage from "@/components/address/address-page";
import { Box } from "@chakra-ui/react";


export default function Page({ params }: { params: { id: string } }): JSX.Element {

    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
        return <Box>404 not found...</Box>
    }


    return <AddressesPage params={{ id: parseInt(id) }} />

}