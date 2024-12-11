import { ThemeContext } from "@/contexts/theme-context";
import Link from "next/link";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext } from "react";
import styles from "./product-wide.module.css";
import { Product } from "@prisma/client";
import ProductReviewBox from "./product-review-box";
import { ResultType } from "@/api/helpers/types.module";
import {
  convertPrice,
  formatPrice,
  convertAndFormatToUserCurrency,
} from "@/api/helpers/utils";
import { UserContext } from "@/contexts/user-context";
import { SettingsContext } from "@/contexts/settings-context";
import ProductCompact from "./product-compact";

// export default function ProductWide({...product}: Product): JSX.Element {

//     const { theme } = useContext(ThemeContext);

//     return (
//         <Link href={`/product/${product.id}`}>
//             <Box className={styles.container} borderColor={theme.colors.background}>
//                 <Image className={styles.image} src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" alt={product.image_alt}  />
//                 <Box className={styles.info_container}>
//                     <Text noOfLines={1}>{product.title}</Text>
//                     <ProductReviewBox {...product} />
//                     <Text className={styles.price_wrapper} color={theme.colors.accent.primary}>{product.price}</Text>
//                     <Text className={styles.description} fontSize="xs" noOfLines={1}>{product.description}</Text>
//                 </Box>
//             </Box>
//         </Link>
//     )
// }

export default function ProductWide({
  ...product
}: ResultType<"product", { seller: true }>): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { defaultImageUrl } = useContext(SettingsContext);

  return (
    <Link href={`/product/${product.id}`}>
      <Card maxW="2xl" minW={theme.sizes.minWidth}>
        <CardBody>
          <Grid templateColumns="minmax(150px, 1fr) 1fr" gap={2} w="full">
            <GridItem
              colSpan={1}
              bgColor={theme.colors.background.secondary}
              display="flex"
              padding="0.4em"
              borderRadius="1em"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                objectFit="cover"
                h="auto"
                w="100%"
                borderRadius="md"
                src={defaultImageUrl}
                alt={product.image_alt}
              />
            </GridItem>
            <GridItem colSpan={1} overflow="hidden" textOverflow="ellipsis">
              <Stack gap={1}>
                <Heading noOfLines={1} fontSize="2xl" w="full">
                  {product.title}
                </Heading>
                <ProductReviewBox {...product} />
                <HStack alignItems="center" gap="0.2em">
                  <Avatar name={product.seller?.name} size="2xs" />
                  <Heading fontSize="sm" fontWeight="medium">
                    {product.seller?.name}
                  </Heading>
                </HStack>
                <Heading fontSize="lg" color={theme.colors.accent.tertiary}>
                  {convertAndFormatToUserCurrency(product.price, user)}
                </Heading>
                <Text
                  fontSize="xs"
                  noOfLines={6}
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {product.description}
                </Text>
              </Stack>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </Link>
  );
}
