// // todo: use theming
// export const stripStyle = {
//   '::-webkit-scrollbar-thumb': {
//     width: '20px !important', //for horizontal scrollbar
//     height: '400px !important', //for vertical scrollbar
//   }
// };

const upArrow = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="#fff" d="M21.5 17.5l-9.5-9.5-9.5 9.5-2.5-2.5 12-12 12 12-2.5 2.5z"></path></svg>`;
const upArrowDisabled = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="#e1e1ef" d="M21.5 17.5l-9.5-9.5-9.5 9.5-2.5-2.5 12-12 12 12-2.5 2.5z"></path></svg>`;

const downArrow = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="#fff" d="M21.5 6.5l-9.5 9.5-9.5-9.5-2.5 2.5 12 12 12-12-2.5-2.5z"></path></svg>`;
const downArrowDisabled = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="#e1e1ef" d="M21.5 6.5l-9.5 9.5-9.5-9.5-2.5 2.5 12 12 12-12-2.5-2.5z"></path></svg>`;

const leftArrow = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="#fff" d="M17.5 2.5l-9.5 9.5 9.5 9.5-2.5 2.5-12-12 12-12 2.5 2.5z"></path></svg>`;
const leftArrowDisabled = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="#e1e1e1" d="M17.5 2.5l-9.5 9.5 9.5 9.5-2.5 2.5-12-12 12-12 2.5 2.5z"></path></svg>`;

const rightArrow = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="#fff" d="M6.5 21.5l9.5-9.5-9.5-9.5 2.5-2.5 12 12-12 12-2.5-2.5z"></path></svg>`;
const rightArrowDisabled = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="#e1e1e1" d="M6.5 21.5l9.5-9.5-9.5-9.5 2.5-2.5 12 12-12 12-2.5-2.5z"></path></svg>`;

export const scrollpanel = {
  '::-webkit-scrollbar': { height: '20px', width: '20px' },
  '::-webkit-scrollbar-track': { backgroundColor: '#ebf5ff' },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#246bb2',
    border: '1px solid #1A4C80',
    borderRadius: '2px',
  },

  '::-webkit-scrollbar-button:start:decrement,\n::-webkit-scrollbar-button:end:increment': {
    backgroundColor: '#246bb2',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '75% 75%',
    border: '1px solid #1A4C80',
    borderRadius: '2px',
    display: 'block',
    height: '20px',
    width: '20px',
  },

  '::-webkit-scrollbar-button:start:decrement:disabled,\n::-webkit-scrollbar-button:end:increment:disabled': {
    backgroundColor: '#6aa7e4',
    borderColor: '#4c7eb2',
  },

  // up arrow
  '::-webkit-scrollbar-button:vertical:start:decrement': {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(upArrow)}')`,
  },

  // up arrow disabled
  '::-webkit-scrollbar-button:vertical:start:decrement:disabled': {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(upArrowDisabled)}')`,
  },

  // down arrow
  '::-webkit-scrollbar-button:vertical:end:increment': {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(downArrow)}')`,
  },

  // down arrow disabled
  '::-webkit-scrollbar-button:vertical:end:increment:disabled': {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(downArrowDisabled)}')`,
  },

  // left arrow
  '::-webkit-scrollbar-button:horizontal:start:decrement': {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(leftArrow)}')`,
  },

  // left arrow disabled
  '::-webkit-scrollbar-button:horizontal:start:decrement:disabled': {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(leftArrowDisabled)}')`,
  },

  // right arrow
  '::-webkit-scrollbar-button:horizontal:end:increment': {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(rightArrow)}')`,
  },

  // right arrow disabled
  '::-webkit-scrollbar-button:horizontal:end:increment:disabled': {
    backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(rightArrowDisabled)}')`,
  },
};
