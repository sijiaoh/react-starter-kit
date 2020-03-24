import history from './history';

export default cookies => {
  return defaultRes => {
    if (cookies.get('loggedIn') !== '1') {
      cookies.set('forwardingUrl', history.location.pathname);
      return { redirect: '/login' };
    }
    return defaultRes;
  };
};
