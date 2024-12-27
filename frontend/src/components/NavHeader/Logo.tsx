import { Box, BoxProps, Img } from "@chakra-ui/react";
// @ts-expect-error
import mainLogo from "../../assets/loho.png";

export const Logo = (props: BoxProps) => {
  return (
    <Box {...props}>
      <Img w={"40px"} h={"40px"} src={mainLogo} />
    </Box>
  );
};
