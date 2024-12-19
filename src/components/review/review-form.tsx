"use client";
import {
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import { FormEvent, useContext, useState } from "react";
import { StarFilled } from "@ant-design/icons";
import { ThemeContext } from "@/contexts/theme-context";
import { postReview } from "@/api/request/reviewRequest";
import { useReviewSearchStore, useUserState } from "@/zustand/store";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function ReviewForm({
  id,
  isVisible,
  onClose,
}: {
  id: number;
  isVisible: boolean;
  onClose: () => void;
}): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const user = useUserState((state) => state.user);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const clearParams = useReviewSearchStore((state) => state.clearParams);
  const getReviews = useReviewSearchStore((state) => state.getReviews);

  // handle hover actions
  const handleMouseEnter = (score: number) => {
    setHoverRating(score);
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setHoverRating(0);
    setIsHovering(false);
  };

  // handle submit review
  const onSubmit = (event: FormEvent<any>) => {
    const formData = new FormData(event.target as HTMLFormElement);
    const review = Object.fromEntries(formData);

    const pendingToast = toast({ title: "Processing...", isClosable: true });
    const successToast = {
      title: "Review saved successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    } as UseToastOptions;
    const errorToast = {
      title: "Error in saving review",
      status: "error",
      duration: 5000,
      isClosable: true,
    } as UseToastOptions;

    postReview(review)
      .then((review) =>
        review
          ? toast.update(pendingToast, successToast)
          : toast.update(pendingToast, errorToast),
      )
      .catch((error) => {
        console.error(error);
        toast.update(pendingToast, errorToast);
      })
      .finally(() => {
        // reload reviews
        clearParams();
        onClose();
        location.reload();
      });
  };

  const handleFormSubmit = (event: FormEvent<any>) => {
    event.preventDefault();
    handleSubmit(() => onSubmit(event))();
  };

  const errorMessage = (message: string | undefined) => {
    return <p>{message || ""}</p>;
  };

  // to do: change to use global
  if (!user) {
    return (
      <Modal isOpen={isVisible} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Link href="/auth/signin">
              <Text>Sign in to create a review</Text>
            </Link>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent margin="1em">
        <ModalHeader>
          <Heading fontSize="2xl" fontWeight="semibold">
            Create Review
          </Heading>
        </ModalHeader>

        <Divider />

        <form onSubmit={(event) => handleFormSubmit(event)}>
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
                          ? index + 1 <= hoverRating
                            ? theme.colors.antCompatible.accent
                            : theme.colors.antCompatible.primary
                          : index + 1 <= rating
                            ? theme.colors.antCompatible.accent
                            : theme.colors.antCompatible.primary,
                      }}
                      onClick={() => setRating(index + 1)}
                    />
                  ))}
                  <Text
                    marginLeft="0.4em"
                    fontSize="sm"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => setRating(0)}
                  >
                    Set to zero
                  </Text>
                </HStack>
                <input
                  type="hidden"
                  value={rating}
                  {...register("score", { required: "Score is required" })}
                />
                {errors.score && errorMessage(errors.score.message?.toString())}
              </Stack>
              <Stack fontWeight="semibold">
                <label>Add a title</label>
                <Input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && errorMessage(errors.title.message?.toString())}
              </Stack>
              <Stack fontWeight="semibold">
                <label>Add a written review</label>
                <Input
                  type="textarea"
                  {...register("content", { required: "Content is required" })}
                />
                {errors.content &&
                  errorMessage(errors.content.message?.toString())}
              </Stack>
              <input type="hidden" name="usrId" value={user.id} />
              <input type="hidden" name="productId" value={id} />
            </Stack>
          </ModalBody>

          <Divider />

          <ModalFooter>
            <HStack justifyContent="space-between" w="100%">
              <Button onClick={onClose} color={theme.colors.semantic.error}>
                Cancel
              </Button>
              <Button
                as={Button}
                maxW="fit-content"
                type="submit"
                bgColor={theme.colors.accent.primary}
              >
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
