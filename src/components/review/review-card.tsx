import { Box, Text, Image, useToast } from "@chakra-ui/react";
import { Review } from "@prisma/client";
import styles from "./review-card.module.css"
import ReviewStars from "./review-stars";
import { deleteReviewById } from "@/api/request/reviewRequest";
import { useRouter } from "next/navigation";
import { useReviewSearchStore } from "@/zustand/store";

export default function ReviewCard(review: Review): JSX.Element {

    const isLoggedIn = true;

    const clearParams = useReviewSearchStore((store) => store.clearParams);

    const toast = useToast();
    const router = useRouter();

    const handleDelete = () => {

        // define toasts
        const pendingToast = toast({ title: 'Processing...', isClosable: true })
        const successToast = { 
            title: 'Success',
            description: 'Review deleted successfully',
            status: 'success',
            duration: 5000,
            isClosable: true
        }
        const errorToast = {
            title: 'Error',
            description: 'Something went wrong',
            status: 'error',
            duration: 5000,
            isClosable: true
        }

        // post review and update toasts accordingly
        try {  
            deleteReviewById(review.id).then(_ =>  toast.update(pendingToast, successToast));
        } catch (error) {
            toast.update(pendingToast, errorToast);
        } finally {
            // clear params and reload
            clearParams();
            router.refresh();
        }
    }

    return (

        <Box className={styles.container}>
            <Box className={styles.user_container}>
                <Image className={styles.user_image} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"/>
                <Text>{review.usrId}</Text>
            </Box>
            <Box className={styles.review_container}>
                <ReviewStars value={review.score} fontSize="md" />
                <Text fontWeight="semibold">{review.title}</Text>
            </Box>
            <Text>{review.content}</Text>
            <Text 
                className={styles.delete_text} 
                display={isLoggedIn ? 'block' : 'none'}
                onClick={handleDelete}>Delete</Text>
        </Box>

    )

}