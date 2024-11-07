import { Card, CardHeader, Heading, Divider, CardFooter, Stack, Select, Button, CircularProgress, Box } from "@chakra-ui/react"
import styles from "./product-page.module.css";
import { useContext, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { postBasketItem } from "@/api/request/basketRequest";
import { useRouter } from "next/navigation";
import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";


export default function ProductBasketCard({ props }: { props: { id: number }}): JSX.Element {

    const { user, isAuthenticated } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    const router = useRouter();

    const { id } = props;
    const maxQuantity = 30;

    const [quantity, setQuantity] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccessful, setIsSuccessful] = useState<boolean>(true);
    const [showSuccess, setShowSuccess] = useState<boolean>(false)

    const renderStatus = (successful: boolean): JSX.Element => {
        return (
            <Box color={successful ? theme.colors.semantic.success : theme.colors.semantic.error}>
                {successful ? <CheckCircleFilled  /> : <CloseCircleOutlined />}
            </Box>
        )
    }
    
    const handleClick = async () => {
        setIsLoading(true);
        try {
            await postBasketItem({ usrId: user.id, productId: id, quantity: quantity });
        } catch (error) {
            setIsSuccessful(false);
            console.error(error);
        } finally {
            setIsLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1000);
            if (isSuccessful) { router.push("/user/basket") };
        }
    }   

    return (
         <Card minW="2xs" className={styles.basket_container} paddingX="1em">
            <CardHeader>
                <Heading fontSize="lg" fontWeight="semibold">Add to basket</Heading>
            </CardHeader>
            <Divider color={theme.colors.border.background} />
            <CardFooter>
                <Stack w="full">
                    <Select placeholder="Select quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                        {Array.from({length: maxQuantity}).map((_, index: number) => (
                            <option value={index + 1} key={index}>{index+1}</option>
                        ))}
                    </Select>
                    <Button 
                    isDisabled={!isAuthenticated}
                    rightIcon={isLoading ? <CircularProgress size="1em" isIndeterminate /> : showSuccess ? renderStatus(isSuccessful): <></>}
                    bgColor={theme.colors.accent.secondary} 
                    onClick={handleClick}>
                        {!isAuthenticated ? "Sign in to add to basket" : "Add to basket"}
                    </Button>
                    <Button bgColor={theme.colors.accent.primary}>Buy now</Button>
                </Stack>
            </CardFooter>
        </Card>

    )
}