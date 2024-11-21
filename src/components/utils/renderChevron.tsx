import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function renderChevron(value: boolean): JSX.Element {
  return value ? <ChevronRightIcon /> : <ChevronDownIcon />;
}
