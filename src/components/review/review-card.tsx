import { Box, Text, Image, useToast, Card, CardHeader, Avatar, Heading, CardBody, Divider, HStack, CardFooter, IconButton, Stack } from "@chakra-ui/react";
import { Review } from "@prisma/client";
import styles from "./review-card.module.css"
import ReviewStars from "./review-stars";
import { deleteReviewById } from "@/api/request/reviewRequest";
import { useRouter } from "next/navigation";
import { useReviewSearchStore } from "@/zustand/store";
import { DeleteOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { ResultType } from "@/api/helpers/types";
import { formatDate } from "@/api/helpers/utils";


export default function ReviewCard(review: ResultType<'review', { usr: true }>): JSX.Element {

    const { user, isAuthenticated } = useContext(UserContext);
    const clearParams = useReviewSearchStore((store) => store.clearParams);
    const { theme } = useContext(ThemeContext);
    const toast = useToast();

    const handleDelete = () => {
        const pendingToast = toast({ title: 'Processing...', isClosable: true })
        const successToast = { title: 'Review deleted successfully', status: 'success', duration: 5000, isClosable: true }
        const errorToast = { title: 'Something went wrong', status: 'error', duration: 5000, isClosable: true }

        // post review and update toasts accordingly
        if (!isAuthenticated || user.id !== review.usrId) {
            throw new Error('Permission denied');
        };

        deleteReviewById(review.id).then(_ => {
            toast.update(pendingToast, successToast);
        }).catch(error => {
            toast.update(pendingToast, errorToast);
        }).finally(() => {
            clearParams();
            location.reload();
        });
    }

    return (

        <Card className={styles.container} maxW="2xl">

            <CardHeader paddingY="0.6em" w="full">
                <HStack justifyContent="space-around"  w="full">
                    <HStack flex={1} overflow="hidden" w="full">
                        <Avatar size="sm" name={review.usr.name} src={review.usr.image_url || ''}/>
                        <Heading 
                        fontSize="sm"
                        noOfLines={1}
                        >{review.usr.name}</Heading>
                    </HStack>
                    <Text flex={1} overflow="hidden" textAlign="right" maxW="fit-content">{formatDate(review.date.toString())}</Text>
                </HStack>
            </CardHeader>

            <Divider />

            <CardBody>
                <HStack paddingBottom="0.4em">
                    <ReviewStars value={review.score} fontSize="md" />
                    <Heading fontWeight="semibold" fontSize="lg" noOfLines={1} textOverflow="ellipsis">{review.title}</Heading>
                </HStack>
            <Text noOfLines={15} textOverflow="ellipsis" overflow="hidden">{review.content}</Text>
            </CardBody>

            <CardFooter justify="right" display={(isAuthenticated && user.id === review.usrId) ? 'flex' : 'none'}>
                <IconButton 
                    _hover={{ bgColor: theme.colors.semantic.error}}
                    aria-label="Delete"
                    onClick={handleDelete}
                    icon={<DeleteOutlined />}></IconButton>
            </CardFooter>
        </Card>

    )

}