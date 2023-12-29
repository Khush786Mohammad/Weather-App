/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  theme: {
    extend: {
      screens:{
        's': '570px',
        'ss' :'460px',
        'sss': '400px',
        // 'ssss':'320px',
        'xs': '360px'
      }
    },
  },
  plugins: [],
}

