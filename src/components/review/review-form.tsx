"use client";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, FormControl, FormLabel, Heading, HStack, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, Textarea, useToast, UseToastOptions } from "@chakra-ui/react";
import styles from "./review-form.module.css";
import { Review } from "@prisma/client";
import { FormEvent, useContext, useEffect, useState } from "react";
import { StarFilled } from "@ant-design/icons";
import { ThemeContext } from "@/contexts/theme-context";
import { postReview } from "@/api/request/reviewRequest";
import { useRouter } from "next/navigation";
import { useReviewSearchStore } from "@/zustand/store";
import { UserContext } from "@/contexts/user-context";
import { useForm } from "react-hook-form";


export default function ReviewForm({ id, isVisible, onClose }: { id: number, isVisible: boolean, onClose: () => void }): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const { user, isAuthenticated } = useContext(UserContext);

    const { register, handleSubmit, formState: { errors }} = useForm();

    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const toast = useToast();
    const clearParams = useReviewSearchStore((state) => state.clearParams);


    // handle hover actions 
    const handleMouseEnter = (score: number) => { 
        setHoverRating(score);
        setIsHovering(true);
    }
    const handleMouseLeave = () => {
        setHoverRating(0);
        setIsHovering(false);
    }


    const onSubmit = (event: FormEvent<any>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const review = Object.fromEntries(formData);
        
        const pendingToast = toast({ title: 'Processing...', isClosable: true })
        const successToast = { title: 'Review saved successfully', status: "success", duration: 5000, isClosable: true }
        const errorToast = { title: 'Error in saving review', status: "error", duration: 5000, isClosable: true }

        postReview(review)
            .then(review => {
                review 
                    ? toast.update(pendingToast, successToast) 
                    : toast.update(pendingToast, errorToast);
            }).catch(error => {
                console.error(error);
                toast.update(pendingToast, errorToast);
            }).finally(() => {
                clearParams();
                location.reload();
            })

    }

    if (!isAuthenticated || !user) {
        return (
        <Modal isOpen={isVisible} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalBody>
                    <Link href="/auth/signin">
                        <Text>
                            Sign in to create a review
                        </Text>
                    </Link>
                </ModalBody>
            </ModalContent>
        </Modal>
        )
    }

    return (
    <Modal isOpen={isVisible} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>

            <ModalHeader>
                <Heading fontSize="2xl" fontWeight="semibold">Create Review</Heading>
            </ModalHeader>

            <Divider />

            <form onSubmit={(event) => handleSubmit(onSubmit(event))}>
                <ModalBody>
                    <Stack>
                        <Stack fontSize="xl" fontWeight="semibold">
                            <label>Overall rating</label>
                            <HStack gap="1px">
                                {Array.from({ length: 5 }).map((_, index: number) => (
                                    <StarFilled
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(index + 1)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ 
                                        color: isHovering 
                                        ? index + 1 <= hoverRating ? theme.colors.antCompatible.accent : theme.colors.antCompatible.primary
                                        : index + 1 <= rating ? theme.colors.antCompatible.accent : theme.colors.antCompatible.primary 
                                    }}
                                    onClick={() => setRating(index + 1)} />
                                ))}
                                <Text 
                                marginLeft="0.4em"
                                fontSize="sm"
                                _hover={{ textDecoration: "underline" }}
                                onClick={() => setRating(0)}>Set to zero</Text>
                            </HStack>
                            <input type="hidden" value={rating} {...register('score', { required: 'Score is required'})}/>
                            {errors.score && <p>{errors.score.message}</p>}
                        </Stack>
                        <Stack fontWeight="semibold">
                            <label>Add a title</label>
                            <Input 
                            type="text" {...register('title', { required: 'Title is required'})} />
                            {errors.title && <p>{errors.title.message}</p>}
                        </Stack>
                        <Stack fontWeight="semibold">
                            <label>Add a written review</label>
                            <Input type="textarea" {...register('content', { required: 'Content is required'})}/>
                            {errors.content && <p>{errors.content.message}</p>}
                        </Stack>
                        <input type="hidden" name="usrId" value={user.id}/>
                        <input type="hidden" name="productId" value={id}/>
                        <input type="hidden" name="image_urls" value={''}/>
                    </Stack>
                </ModalBody>

                <Divider />

                <ModalFooter>
                    <HStack justifyContent="space-between" w="100%">   
                        <Button onClick={onClose} color={theme.colors.semantic.error}>Cancel</Button>
                        <Button as={Button} maxW="fit-content" type="submit" bgColor={theme.colors.accent.primary}>Submit</Button>
                    </HStack>
                </ModalFooter>
            </form>

        </ModalContent>
    </Modal>
)};