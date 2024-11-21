"use client";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Stack,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import NavigationCompact from "./navigation-compact";
import NavigationWide from "./navigation-wide";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import styles from "./index.module.css";

export default function NavBar(): JSX.Element {
  const [isLargerThan800px] = useMediaQuery("(min-width: 800px)");
  const { theme } = useContext(ThemeContext);

  return (
    <Box className={styles.nav_container} minW={theme.sizes.minWidth}>
      {isLargerThan800px ? <NavigationWide /> : <NavigationCompact />}
    </Box>
  );
}
