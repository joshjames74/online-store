import { ChevronDownIcon, StarIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import styles from "./review-stars.module.css";


export default function ReviewStars(props: { value: Number }): JSX.Element {

    const { value } = props;
    const accent = "blue"
    const none = "blue"

    return (
        <Box className={styles.container} fontSize="2xs">
            {[1, 2, 3, 4, 5].map((x: Number) => <StarIcon color={ x <= value ? accent : none }/>)}
            <ChevronDownIcon />
        </Box>
    )

}