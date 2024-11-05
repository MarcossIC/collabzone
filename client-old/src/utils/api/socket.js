import { API_URL } from './config';

// "undefined" means the URL will be computed from the `window.location` object
export const SOCKET_URL = API_URL || window.location;
