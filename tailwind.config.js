/** @format */

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: (theme) => ({
      ...theme('colors'),
      'light-blue': '#E7F8FF',
      mono: '#636366',
      'off-white': '#FCFCFC',
      primary: '#5BC5F1',
      'primary-night': '#00005F',
      gray: '#00000060',
      peach: '#757575',
      'dark-blue': '#000039',
      'mono-input': '#F2F2F2',
      'primary-sea': '#54C2F0',
      'secondary-fire': '#D70000',
      'mono-label': '#212634',
      'mono-gray': '#959595',
      'mono-tag-success': '#D5FAF1',
      'success-border': '#227A64',
      'mono-light-title': '#ADADAD',
      'mono-placeholder': '#999999',
      'mono-border': '#E5E5E5',
      'mono-light-gray': '#FEE3EC',
    }),

    textColor: (theme) => ({
      ...theme('colors'),
      'light-blue': '#E7F8FF',
      mono: '#636366',
      'off-white': '#FCFCFC',
      primary: '#5BC5F1',
      'primary-night': '#00005F',
      gray: '#00000060',
      'light-gray': '#959595',
      peach: '#757575',
      'dark-blue': '#000039',
      'mono-title': '#101521',
      'secondary-fire': '#D70000',
      'primary-sea': '#54C2F0',
      'mono-label': '#212634',
      'mono-gray': '#959595',
      success: '#227A64',
      'mono-light-title': '#ADADAD',
      'mono-placeholder': '#999999',
      'mono-border': '#E5E5E5',
    }),

    borderColor: (theme) => ({
      ...theme('colors'),
      'light-blue': '#E7F8FF',
      mono: '#636366',
      'off-white': '#FCFCFC',
      primary: '#5BC5F1',
      'primary-night': '#00005F',
      gray: '#00000060',
      'light-gray': '#959595',
      peach: '#757575',
      'dark-blue': '#000039',
      'mono-title': '#101521',
      'secondary-fire': '#D70000',
      'primary-sea': '#54C2F0',
      'mono-label': '#212634',
      'mono-gray': '#959595',
      'success-border': '#227A64',
      'mono-input': '#F2F2F2',
      'mono-light-title': '#ADADAD',
      'mono-placeholder': '#999999',
      'mono-border': '#E5E5E5',
    }),

    letterSpacing: (theme) => ({
      ...theme('letter-spacing'),
      'xl-wide': '0.047rem',
    }),

    fontSize: (theme) => ({
      ...theme('font-size'),
      lg: ['2rem', '2.5rem'],
      md: ['1.25rem', '1.5rem'],
      xmd: ['1.5rem', '2rem'],
      xlg: ['2.5rem', '2.813rem'],
      sm: ['1rem', '1.5rem'],
      xsm: ['.875rem', '1.063rem'],
      12: ['.75rem', '1.125rem'],
      18: ['1.125rem', '1.25rem'],
    }),

    maxWidth: (theme) => ({
      ...theme('max-width'),
      19: '19.375rem',
      12: '12.563rem',
      162: '10.125rem',
      83: '5.188rem',
      102: '6.375rem',
      560: '35rem',
      393: '24.563rem',
      52: '3.25rem',
      242: '15.125rem',
    }),

    screens: {
      xsm: '320px',
      // => @media (min-width: 640px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },

    extend: {
      margin: {
        50: '12.5rem',
      },
      width: {
        50: '12.5rem',
        30: '7.75rem',
        25: '5.188rem',
        560: '35rem',
        52: '3.25rem',
        242: '15.125rem',
      },
      height: {
        29: '1.813rem',
        52: '2.5rem',
        393: '24.563rem',
      },
      minWidth: {
        '100': '100px',
        '150': '100px'

      },
      maxWidth: {
        '17': '17rem'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './interface/**/*.{js,ts,jsx,tsx}'],
}
