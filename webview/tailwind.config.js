/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui';

export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', '../src/plugins/**/*.{vue,js,ts,jsx,tsx}'],
    plugins: [daisyui],
    daisyui: {
        themes: ['light', 'dark', 'cupcake'],
    },
};
