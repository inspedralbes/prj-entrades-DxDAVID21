export default defineAppConfig({
  ui: {
    strategy: "override",

    colors: {
      primary: "#0068C8",
      secondary: "#F7C600",
      info: "#1A2238",
      neutral: "#0A0F1F",
    },

    font: {
      sans: "Inter, Roboto, sans-serif",
    },

    radius: {
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "18px",
    },

    button: {
      base: "font-semibold px-6 py-3 rounded-lg transition-all duration-200 ease-out transform hover:scale-105 shadow-md hover:shadow-lg",
      variants: {
        color: {
          primary:
            "bg-[#0068C8] text-white hover:bg-[#004fa3] active:bg-[#003d75]",
          secondary:
            "bg-[#F7C600] text-[#0A0F1F] hover:bg-[#dfa500] active:bg-[#c99a00]",
          danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        },
      },
    },

    card: {
      slots: {
        root: "bg-[#1A2238] text-white shadow-lg rounded-lg p-5",
      },
    },
  },
});
