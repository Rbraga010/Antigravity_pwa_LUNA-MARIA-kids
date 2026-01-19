/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                quicksand: ['Quicksand', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
                luna: ['Outfit', 'sans-serif'],
            },
            colors: {
                cream: '#FAF8F5',
            }
        },
    },
    plugins: [],
}
