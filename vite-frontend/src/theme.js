import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#f44336",
      },
      secondary: {
        main: "#ff1744",
      },
    },
    typography: {
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      logo: {
        fontFamily: "Dancing Script, cursive",
        fontSize: "2rem",
        fontWeight: "bold",
      },
    },
  })
);

export default theme;
