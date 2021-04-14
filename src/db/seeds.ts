import * as path from 'path';
const requireAll = require('require-all');

export default {
  run: () => {
    requireAll({
      dirname: path.resolve(__dirname, './seeders'),
      filter: /(.+\.seed)\.(t|j)s$/,
      resolve: (seeder) => {
        if (typeof seeder.default === 'function') {
          return seeder.default();
        }
      },
    });
  },
};
