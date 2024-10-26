import { Box } from "@chakra-ui/react";
import styles from "./review-stars.module.css";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { StarFilled } from "@ant-design/icons";


export default function ReviewStars(props: { value: number, fontSize?: number }): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const { value, fontSize } = props;

    return (
        <Box className={styles.container} fontSize={fontSize ? fontSize : "2xs"}>
            {[1, 2, 3, 4, 5].map((x: number, index: number) => <StarFilled key={index} style={{
                color: x <= value ? theme.colors.antCompatible.accent.toString() : theme.colors.antCompatible.primary.toString() 
            }}/>)}
        </Box>
    )

}