/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import glob from 'glob';
import sequelize from '../sequelize';

const models = glob
  .sync('./src/data/models/*.js')
  .map(file => path.basename(file, '.js'))
  .filter(file => file !== 'index')
  .reduce((obj, file) => {
    // eslint-disable-next-line no-param-reassign, global-require, import/no-dynamic-require
    obj[file] = require(`./${file}`);
    return obj;
  }, {});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync, ...models };
