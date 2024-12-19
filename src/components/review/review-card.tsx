import {
  Text,
  useToast,
  Card,
  CardHeader,
  Avatar,
  Heading,
  CardBody,
  HStack,
  CardFooter,
  IconButton,
  UseToastOptions,
} from "@chakra-ui/react";
import styles from "./review-card.module.css";
import ReviewStars from "./review-stars";
import { deleteReviewById } from "@/api/request/reviewRequest";
import { useReviewSearchStore, useUserState } from "@/zustand/store";
import { DeleteOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { formatDate } from "@/api/helpers/utils";
import { ReviewWithUser } from "@/api/services/reviewService";

export default function ReviewCard(review: ReviewWithUser): JSX.Element {
  const user = useUserState((state) => state.user);
  const clearParams = useReviewSearchStore((store) => store.clearParams);
  // const getReviews = useReviewSearchStore((state) => state.getReviews);
  const { theme } = useContext(ThemeContext);
  const toast = useToast();

  const handleDelete = () => {
    const pendingToast = toast({ title: "Processing...", isClosable: true });
    const successToast = {
      title: "Review deleted successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    } as UseToastOptions;
    const errorToast = {
      title: "Something went wrong",
      status: "error",
      duration: 5000,
      isClosable: true,
    } as UseToastOptions;

    // post review and update toasts accordingly
    if (user.id !== review.usrId) {
      throw new Error("Permission denied");
    }

    deleteReviewById(review.id)
      .then((_) => {
        toast.update(pendingToast, successToast);
      })
      .catch((error) => {
        toast.update(pendingToast, errorToast);
      })
      .finally(() => {
        clearParams();
        location.reload();
      });
  };

  return (
    <Card className={styles.container} maxW="2xl">
      <CardHeader paddingBottom="0">
        <HStack justifyContent="space-around" w="full">
          <HStack flex={1} overflow="hidden" w="full">
            <Avatar
              size="sm"
              name={review.usr.name}
              src={review.usr.image_url || ""}
            />
            <Heading fontSize="sm" noOfLines={1}>
              {review.usr.name}
            </Heading>
          </HStack>
          <Text flex={1} overflow="hidden" textAlign="right" maxW="fit-content">
            {formatDate(review.created_at.toString())}
          </Text>
        </HStack>
      </CardHeader>

      <CardBody>
        <HStack paddingBottom="0.4em">
          <ReviewStars value={review.score} fontSize="md" />
          <Heading
            fontWeight="semibold"
            fontSize="lg"
            noOfLines={1}
            textOverflow="ellipsis"
          >
            {review.title}
          </Heading>
        </HStack>
        <Text
          noOfLines={15}
          textOverflow="ellipsis"
          overflow="hidden"
          textAlign="justify"
        >
          {review.content}
        </Text>
      </CardBody>

      <CardFooter
        justify="right"
        display={user.id === review.usrId ? "flex" : "none"}
      >
        <IconButton
          _hover={{ bgColor: theme.colors.semantic.error }}
          aria-label="Delete"
          onClick={handleDelete}
          icon={<DeleteOutlined />}
        ></IconButton>
      </CardFooter>
    </Card>
  );
}
