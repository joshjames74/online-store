import { ThemeContext } from "@/contexts/theme-context";
import Link from "next/link";
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext } from "react";
import ProductReviewBox from "./product-review-box";
import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import { useUserState } from "@/zustand/store";
import { ProductWithSeller } from "@/api/services/productService";

export default function ProductWide({
  ...product
}: ProductWithSeller): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const currency = useUserState((state) => state.currency);
  const [isLessThan700px] = useMediaQuery("(max-width: 700px)");

  const url = `/product/${product.id}`;
  const reviewUrl = `${url}#reviews`;

  return (
    <Card maxW="5xl" minW="100px" padding={0} shadow="none">
      <CardBody padding="0.4em">
        <Grid templateColumns="minmax(150px, 1fr) 1fr" gap={2} w="full">
          <GridItem
            colSpan={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding={0}
          >
            <Link href={url}>
              <Image
                objectFit="contain"
                h="250px"
                w="auto"
                margin={0}
                borderRadius="md"
                src={product.image_url}
                alt={product.image_alt}
              />
            </Link>
          </GridItem>
          <GridItem colSpan={1} overflow="hidden" textOverflow="ellipsis">
            <Stack gap="0.7em">
              <Link href={url}>
                <Heading
                  as={isLessThan700px ? "h2" : "h1"}
                  className={isLessThan700px ? "noOfLines-2" : "noOfLines-1"}
                >
                  {product.title}
                </Heading>
              </Link>

              <Heading as="h3" className="noOfLines-1 muted-heading">
                {product.seller?.name}
              </Heading>

              <Link href={url} className="justify">
                <Text className="noOfLines-6">{product.description}</Text>
              </Link>

              <Link href={reviewUrl}>
                <ProductReviewBox {...product} />
              </Link>

              <Heading as="h3">
                {convertAndFormatToUserCurrency(product.price, currency)}
              </Heading>
            </Stack>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
}
