const path = require('path');
const glob = require('glob');

/**
 * Usage example:
 *   const requireAll = require('./requireAll');
 *   const foo = requireAll(path.join(process.cwd(), 'bar'));
 */
module.exports = dirName => {
  return glob
    .sync(path.join(dirName, '*.js'))
    .map(filePath => ({
      fileName: path.basename(filePath, '.js'),
      filePath: path.relative(
        path.join(process.cwd(), 'src'),
        path.resolve(filePath),
      ),
    }))
    .filter(({ fileName }) => fileName !== 'index')
    .reduce((obj, { fileName, filePath }) => {
      // eslint-disable-next-line no-param-reassign, global-require, import/no-dynamic-require
      obj[fileName] = require(`./${filePath}`).default;
      return obj;
    }, {});
};
