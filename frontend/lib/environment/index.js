export const IS_BROWSER = typeof window !== 'undefined';
export const IS_SERVER = !IS_BROWSER;
export const JWT = IS_BROWSER && localStorage.getItem('jwtToken');
