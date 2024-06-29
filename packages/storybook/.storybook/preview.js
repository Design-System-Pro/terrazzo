import '@terrazzo/tokens/dist/index.css';
import '@terrazzo/fonts/fragment-mono.css';
import '@terrazzo/fonts/instrument-sans.css';
import '@terrazzo/tiles/dist/styles.css';
import '@terrazzo/react-color-picker/dist/styles.css';
import './global.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
