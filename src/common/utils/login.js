import Cookies from 'js-cookie';

const TOKENKEY = 'Admin-Token';

export const setToken = (token) => {
    // Cookies.set(TOKENKEY, token, { expires: 1 });
    sessionStorage.setItem(TOKENKEY, token)
};

export const getToken = () => {
    // return Cookies.get(TOKENKEY);
    return sessionStorage.getItem(TOKENKEY)
};

export const clearCache = () => {
    Cookies.remove(TOKENKEY);
    localStorage.clear();
    sessionStorage.clear();
};
