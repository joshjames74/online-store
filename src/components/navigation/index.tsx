"use client";
import { Box, useMediaQuery } from "@chakra-ui/react";
import NavigationCompact from "./navigation-compact";
import NavigationWide from "./navigation-wide";
import { useContext, useEffect, useMemo } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import styles from "./index.module.css";
import { useAddressState, useBasketState, useUserState } from "@/zustand/store";
import { useSession } from "next-auth/react";


export default function NavBar(): JSX.Element {
  const user = useUserState((state) => state.user);

  const loadUserState = useUserState((state) => state.loadUserState);
  const updateAddressUserId = useAddressState((state) => state.updateUserId);
  const updateBasketUserId = useBasketState((state) => state.updateUserId);

  const { data: session, status } = useSession();
  const loadOnStateChange = useMemo(() => {
    if (status === "loading") {
      return;
    }
    loadUserState(session);
  }, [status]);

  
  useEffect(() => {
    if (!user.id) return;
    updateBasketUserId(user.id);
    updateAddressUserId(user.id);
  }, [user.id]);
  

  const [isSmallerThan800px] = useMediaQuery("(max-width: 800px)");
  const { theme } = useContext(ThemeContext);

  return (
    <Box className={styles.nav_container} minW={theme.sizes.minWidth}>
      {isSmallerThan800px ? <NavigationCompact /> : <NavigationWide />}
    </Box>
  );
}
