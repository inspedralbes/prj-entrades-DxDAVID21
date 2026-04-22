export default defineAppConfig({
  ui: {
    strategy: 'override',

    colors: {
      primary: '#0068C8',
      secondary: '#F7C600',
      info: '#1A2238',
      neutral: '#0A0F1F',
    },

    font: {
      sans: 'Inter, Roboto, sans-serif'
    },

    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '18px'
    },

    button: {
      variants: {
        primary: {
          base: 'bg-[#0068C8] text-white font-semibold px-5 py-3 rounded-md hover:bg-[#0052a0] transition-colors'
        },

        secondary: {
          base: 'bg-[#F7C600] text-[#0A0F1F] font-semibold px-5 py-3 rounded-md hover:bg-[#e0b200] transition-colors'
        },

        danger: {
          base: 'bg-red-600 text-white font-semibold px-5 py-3 rounded-md hover:bg-red-700 transition-colors'
        }
      }
    },

    card: {
      slots: {
        root: 'bg-[#1A2238] text-white shadow-lg rounded-lg p-5'
      }
    }
  }
})
