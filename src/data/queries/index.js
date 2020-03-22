const path = require('path');
const requireAll = require('../../requireAll');

module.exports = requireAll(path.join(process.cwd(), 'src', 'data', 'queries'));
