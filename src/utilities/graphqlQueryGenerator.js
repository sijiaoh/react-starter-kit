/**
 * Usage example:
 *   import graphqlQueryGenerator from 'utilities/graphqlQueryGenerator';
 *   const query = graphqlQueryGenerator({
 *     queryName: 'foo',
 *     args: { bar: 'baz' },
 *     fields: ['qux'],
 *   });
 *   const { foo } = await fetchGraphql(`mutation{${query}}`);
 */

export default ({ queryName = '', args = {}, fields = [] }) => {
  if (queryName === '') throw new Error('Query name cannot be empty.');
  if (fields.length <= 0) throw new Error('Fields cannot be empty.');

  const queryArgs = Object.keys(args)
    .map(
      key =>
        `${key}:${
          typeof args[key] === 'string' ? `"${args[key]}"` : args[key]
        }`,
    )
    .join(',');
  const queryFields = fields.join(',');
  return `${queryName}${
    queryArgs !== '' ? `(${queryArgs})` : ''
  }{${queryFields}}`;
};
