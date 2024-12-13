"use client";
import { Box, useMediaQuery } from "@chakra-ui/react";
import NavigationCompact from "./navigation-compact";
import NavigationWide from "./navigation-wide";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import styles from "./index.module.css";
import { useUserState } from "@/zustand/store";
import { useSession } from "next-auth/react";

export default function NavBar(): JSX.Element {
  const user = useUserState((state) => state.user);
  const currency = useUserState((state) => state.currency);
  const country = useUserState((state) => state.country);
  const defaultAddress = useUserState((state) => state.defaultAddress);
  const loadUserState = useUserState((state) => state.loadUserState);

  const { data: session } = useSession();

  useEffect(() => {
    loadUserState(session);
  }, [session]);

  useEffect(() => {
    console.log("USER AT STATE LEVEL");
    console.log(user);
    console.log(currency);
    console.log(defaultAddress);
  }, [user]);

  const [isSmallerThan800px] = useMediaQuery("(max-width: 800px)");
  const { theme } = useContext(ThemeContext);

  return (
    <Box className={styles.nav_container} minW={theme.sizes.minWidth}>
      {isSmallerThan800px ? <NavigationCompact /> : <NavigationWide />}
    </Box>
  );
}
