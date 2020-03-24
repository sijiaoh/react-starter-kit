export default ({ cookies, getLocation }) => {
  return defaultRes => {
    if (cookies.get('loggedIn') !== '1') {
      cookies.set('forwardingUrl', getLocation());
      return { redirect: '/login' };
    }
    return defaultRes;
  };
};
