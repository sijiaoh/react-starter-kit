export default ({ isLoggedIn }) => {
  return defaultRes => {
    if (!isLoggedIn()) return { redirect: '/login' };
    return defaultRes;
  };
};
