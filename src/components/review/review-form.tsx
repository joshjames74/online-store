"use client";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, FormControl, FormLabel, Heading, HStack, Input, Stack, Text, Textarea, useToast, UseToastOptions } from "@chakra-ui/react";
import styles from "./review-form.module.css";
import { Review } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { StarFilled } from "@ant-design/icons";
import { ThemeContext } from "@/contexts/theme-context";
import { postReview } from "@/api/request/reviewRequest";
import { useRouter } from "next/navigation";
import { useReviewSearchStore } from "@/zustand/store";

export default function ReviewForm({ id }: { id: number }): JSX.Element {

    const { theme } = useContext(ThemeContext);

    const defaultReview = { usrId: 1, productId: id, image_urls: '' }

    const [review, setReview] = useState<Partial<Review>>(defaultReview);
    const [rating, setRating] = useState<number>(0);

    const router = useRouter();
    const toast = useToast();
    const clearParams = useReviewSearchStore((state) => state.clearParams);

    // update rating on change

    useEffect(() => {
        setReview({ ...review, ...{ score: rating} });
    }, [rating]);


    // handler functions

    const handleChange = (data: Partial<Review>) => {
        setReview({ ...review, ...data });
    };

    const handleCancel = () => {
        setReview(defaultReview);
    };

    const handleSubmit = () => {

        // define toasts
        const pendingToast = toast({ title: 'Processing...', isClosable: true })
        const successToast = { 
            title: 'Success',
            description: 'Your request was successful',
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
            postReview(review).then(res => res ? toast.update(pendingToast, successToast) : toast.update(pendingToast, errorToast));
        } catch (error) {
            toast.update(pendingToast, errorToast);
        } finally {
            // clear params and reload
            clearParams();
            router.refresh();
        }
    }


    // return (
    //     <Box>
    //         <FormControl className={styles.container}>

    //             <Text fontSize="2xl">Create Review</Text>

    //             <Box className={styles.rating_container}>
    //                 <FormLabel>Overall rating</FormLabel>
    //                 {Array.from({ length: 5 }).map((_, index) => (
    //                     <StarFilled
    //                         style={{ color: index + 1 <= rating ? theme.colors.accent.primary : theme.colors.text.primary }}
    //                         onClick={() => setRating(index + 1)} />
    //                 ))}
    //             </Box>

    //             <Box className={styles.title_container}>
    //                 <FormLabel>Add a title</FormLabel>
    //                 <Input type="text" onChange={event => handleChange({ title: event.target.value })} />
    //             </Box>

    //             <Box className={styles.written_container}>
    //                 <FormLabel>Add a written review</FormLabel>
    //                 <Textarea onChange={event => handleChange({ content: event.target.value })}></Textarea>
    //             </Box>

    //             <Box className={styles.button_container}>   
    //                 <Input as={Button} type="submit" onClick={handleSubmit}>Submit</Input>
    //                 <Button onClick={handleCancel}>Cancel</Button>
    //             </Box>

    //         </FormControl>
    //     </Box>
    // )

    

    return (
        <Card minW="sm" border="2px solid gray" >
            <FormControl className={styles.container}>

                <CardHeader paddingBottom={0}>
                    <Heading fontSize="2xl" fontWeight="semibold">Create Review</Heading>
                </CardHeader>

                <Divider />

                <CardBody paddingY={0}>

                    <Stack>

                    <Box>
                        <FormLabel>Overall rating</FormLabel>
                        {Array.from({ length: 5 }).map((_, index: number) => (
                            <StarFilled
                            key={index}
                            style={{ color: index + 1 <= rating ? theme.colors.accent.primary : theme.colors.text.primary }}
                            onClick={() => setRating(index + 1)} />
                        ))}
                    </Box>

                    <Box className={styles.title_container}>
                        <FormLabel>Add a title</FormLabel>
                        <Input type="text" onChange={event => handleChange({ title: event.target.value })} />
                    </Box>

                    <Box className={styles.written_container}>
                        <FormLabel>Add a written review</FormLabel>
                        <Textarea onChange={event => handleChange({ content: event.target.value })}></Textarea>
                    </Box>
                    </Stack>

                </CardBody>

                <Divider />

                <CardFooter paddingTop={0}>
                    <HStack justifyContent="space-between" w="100%">   
                        <Input as={Button} type="submit" onClick={handleSubmit} maxW="fit-content">Submit</Input>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </HStack>
                </CardFooter>

            </FormControl>
        </Card>
    )

}