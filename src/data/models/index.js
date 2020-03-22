/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const path = require('path');
const sequelize = require('../sequelize').default;
const requireAll = require('../../requireAll');

const models = requireAll(path.join(process.cwd(), 'src', 'data', 'models'));

function sync(...args) {
  return sequelize.sync(...args);
}

module.exports = { sync, ...models };
