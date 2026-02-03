export default function styles() {
  return {
    arrow: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#fff",
    },
    dotsContainer: {
      position: "absolute",
      bottom: 16,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: 1,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      cursor: "pointer",
    },
  };
}
