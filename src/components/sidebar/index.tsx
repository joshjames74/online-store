import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Stack,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import ReviewFilter from "./review-filter";
import PriceFilter from "./price-filter";
import CategoryFilter from "./category-filter";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { ControlOutlined } from "@ant-design/icons";
import SortFilter from "./sort-filter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, clearMainProductFilters, setMainProductCategory, setMainProductMaxPrice, setMainProductMinReview, setMainProductProductFilter } from "@/redux/store";
import { ProductFilter } from "@/api/transformers/productSearchTransformer";
import { selectMainProductFilters } from "@/redux/selectors";
import { fetchMainProducts } from "@/redux/actions/products";


export default function Sidebar(): JSX.Element {

  const { theme } = useContext(ThemeContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan800px] = useMediaQuery("(min-width: 800px)");

  // redux

  const dispatch = useDispatch<AppDispatch>();

  const updateMaxPrice = (maxPrice: number) => dispatch(setMainProductMaxPrice(maxPrice));
  const updateMinReview = (minReview: number) => dispatch(setMainProductMinReview(minReview));
  const updateCategories = (categories: number[]) => dispatch(setMainProductCategory(categories));
  const updateProductFilter = (product_filter: ProductFilter) => dispatch(setMainProductProductFilter(product_filter));

  const filters = useSelector(selectMainProductFilters);

  const clearFilters = () => dispatch(clearMainProductFilters());
  const fetchProducts = () => dispatch(fetchMainProducts());

  const handleDelete = () => {
    clearFilters();
    fetchProducts();
  };


  const RenderFilters = (): JSX.Element => {
    return (
    <Stack gap="1em">
      <SortFilter { ...{ updateProductFilter: updateProductFilter } } />
      <PriceFilter { ...{ updateMaxPrice: updateMaxPrice, maxPrice: 100000, currPrice: filters.max_price } }/>
      <ReviewFilter { ...{ updateMinReview: updateMinReview, minReview: filters.min_review }} />
      <CategoryFilter { ...{ updateCategories: updateCategories, selectedCategories: filters.categories }} />
    </Stack>
    )
  };

  const sidebar = () => {
    return (
      <Card h="fit-content" minW="250px" shadow="none" padding="0">
        <CardHeader paddingBottom={2} paddingX="0" paddingTop="0">
          <Heading as="h2" className="upper">
            Filters
          </Heading>
        </CardHeader>
        <CardBody paddingTop={2} paddingBottom={0} paddingX={0}>
          <RenderFilters />
        </CardBody>
        <CardFooter paddingTop="1em" paddingX={0}>
          <HStack gap="1em">
            <Button
              className="primary-button"
              onClick={handleDelete}
              bgColor={`${theme.colors.background.secondary} !important`}
            >
              Clear Filters
            </Button>
            <Button
              className="primary-button"
              onClick={fetchProducts}
              bgColor={`${theme.colors.accent.primary} !important`}
            >
              Search
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    );
  };

  const drawer = () => {
    return (
      <>
        <Button
          onClick={onOpen}
          w="fit-content"
          bgColor={theme.colors.background.primary}
          className="primary-button"
          gap="0.4em"
        >
          Filters
          <ControlOutlined />
        </Button>
        <Drawer isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading as="h2" className="upper">
                Filters
              </Heading>
            </DrawerHeader>
            <DrawerBody className="sans-serif">
              <RenderFilters />
            </DrawerBody>
            <DrawerFooter>
              <HStack gap="1em">
                <Button
                  className="primary-button"
                  onClick={handleDelete}
                  bgColor={`${theme.colors.background.secondary} !important`}
                >
                  Clear Filters
                </Button>
                <Button
                  className="primary-button"
                  onClick={fetchProducts}
                  bgColor={`${theme.colors.accent.primary} !important`}
                >
                  Search
                </Button>
              </HStack>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  };

  return isLargerThan800px ? sidebar() : drawer();
}
