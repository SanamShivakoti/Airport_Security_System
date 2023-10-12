/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/Admin/Dashboard/Components/Sidebar.jsx",
    "./src/Admin/Dashboard/Contents/Content.jsx",
  ],
  theme: {
    extend: {
      screens: {
        tablet: "1080px",
        // => @media (min-width: 1080px) {... }

        laptop: "1280px",
        // => @media (min-width: 1024px) { ... }

        desktop: "1440px",
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [],
};
