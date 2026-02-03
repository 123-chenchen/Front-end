// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    searchContainer: {},
    input: {
      color: theme.palette.mode === "light" ? "dark" : undefined,
      filter: theme.palette.mode === "light" ? "invert(1)" : undefined,
    },
    scrollbar: {
      maxHeight: 360,
      overflowY: "auto",
      "&::-webkit-scrollbar": {},
      "&::-webkit-scrollbar-thumb": {},
    },
    image: {
      width: 45,
      height: 70,
      marginRight: theme.spacing(1),
      borderRadius: 1,
      objectFit: "cover",
    }
  };
}
