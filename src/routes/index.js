/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import files from 'files.macro';

const excludes = ['index.js', 'home', 'not-found', 'error'];
const children = JSON.parse(files('./'))
  .filter(file => !excludes.some(exclude => exclude === file))
  .map(file => ({
    path: `/${file}`,
    load: () =>
      import(
        /* webpackChunkName: '[request]' */
        `./${file}`
      ),
  }));

// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },

    ...children,

    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ siteTitle, getCurrentPath, storeForwardingPath, next }) {
    if (!getCurrentPath().startsWith('/login')) storeForwardingPath();

    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - ${siteTitle}`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
