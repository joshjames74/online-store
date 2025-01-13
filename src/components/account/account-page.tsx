import { Box, Grid, Heading, Stack } from "@chakra-ui/react";
import AccountCard, { AccountCardProps } from "./account-card";
import styles from "./account-page.module.css";

export default function AccountPage(): JSX.Element {
  const pages: AccountCardProps[] = [
    {
      title: "Your orders",
      subtitle: "View and filter orders",
      href: "/user/orders",
    },
    {
      title: "Your addresses",
      subtitle: "Edit, remove, or set default addresses",
      href: "/user/addresses",
    },
    {
      title: "Sign Out",
      subtitle: "Sign out",
      href: "/auth/signout",
    },
  ];

  return (
    <Box w="full" display="flex" justifyContent="center" paddingY="2em">
      <Stack maxW="1200px" w="fit-content" gap="1em">
        <Heading fontWeight="semibold">Your account</Heading>
        <Grid className={styles.grid} gap="1em">
          {pages.map((page, index: number) => (
            <AccountCard {...page} key={index} />
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
