import { GraphQLBoolean } from 'graphql';

export default {
  type: GraphQLBoolean,
  resolve({ response }) {
    response.clearCookie('id_token');
    response.clearCookie('loggedIn');
    return true;
  },
};
