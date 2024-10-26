import { PlusOutlined } from "@ant-design/icons";
import { Box, Card, Heading, Text } from "@chakra-ui/react";

export default function AddAddressCard(): JSX.Element {

    return (

        <Card w="350px" h="250px" border="2px dashed grey">
            <Box 
            w="full" h="full" 
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="1em">
                <PlusOutlined style={{ fontSize: "30px"}} /> 
                <Heading fontSize="xl">Add Address</Heading>
            </Box>
        </Card>

    )

}