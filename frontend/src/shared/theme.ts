import { extendTheme } from "@chakra-ui/react";
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";

const style = {
  global: (props: StyleFunctionProps | Record<string, string>) => ({
    body: {
      bg: mode("#f0e7db", "#202023")(props),
    },
  }),
};

const components = {
  Heading: {
    variants: {
      "section-title": {
        textDecoration: "underline",
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: "#525252",
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4,
      },
    },
  },
  Link: {
    baseStyle: (props: StyleFunctionProps | Record<string, string>) => ({
      color: mode("#202023", "#f0e7db")(props),
      textUnderlineOffset: 3,
      fontSize: 18,
    }),
  },
};

const fonts = {};

const colors = {
  grassTeal: "#88ccca",
  cardBack: mode("#ffffff", "#2d3748"),
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

export const theme = extendTheme({ config, style, components, fonts, colors });
