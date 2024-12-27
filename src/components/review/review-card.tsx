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
  Divider,
  Button,
} from "@chakra-ui/react";
import ReviewStars from "./review-stars";
import { deleteReviewById } from "@/api/request/reviewRequest";
import { useReviewSearchStore, useUserState } from "@/zustand/store";
import { DeleteOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { formatDate } from "@/api/helpers/utils";
import { ReviewWithUser } from "@/api/services/reviewService";
import Link from "next/link";

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
    <Card padding="0" shadow="none">
      <CardHeader padding="0">
        <HStack justifyContent="space-around" w="full">
          <HStack flex={1} overflow="hidden" w="full">
              <Avatar
                size="sm"
                name={review.usr.name}
                src={review.usr.image_url || ""}
              />
              <Heading as="h4" className="noOfLines-1 muted-heading">
                {review.usr.name}
              </Heading>
          </HStack>

          <Heading flex={1} overflow="hidden" textAlign="right" maxW="fit-content" as="h4" className="muted-heading">
            {formatDate(review.created_at.toString())}
          </Heading>
        </HStack>
      </CardHeader>

      <CardBody paddingX="0" paddingY="0.4em">
        <HStack paddingBottom="0.4em">
          <ReviewStars value={review.score} fontSize="md" />
          <Heading as="h3" className="noOfLines-1">
            {review.title}
          </Heading>
        </HStack>
        <Text className="noOfLines-15 justify">
          {review.content}
        </Text>
      </CardBody>

      <CardFooter
        justify="right"
        display={user.id === review.usrId ? "flex" : "none"}
      >
        <Button
          _hover={{ bgColor: theme.colors.semantic.error }}
          aria-label="Delete"
          onClick={handleDelete}
          className="primary-button"
          color={`${theme.colors.semantic.error} !important`}
        >
          <DeleteOutlined />
        </Button>
      </CardFooter>
      <Divider color="gray" w="full"/>
    </Card>
  );
}
