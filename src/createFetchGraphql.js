export default fetch => async (query, error) => {
  const res = await fetch('/graphql', {
    body: JSON.stringify({
      query,
    }),
  });
  const { data } = await res.json();
  if (!data) {
    // eslint-disable-next-line no-param-reassign
    if (!error) error = new Error(`Failed to load graphql query ${query}.`);
    throw error;
  }
  return data;
};
