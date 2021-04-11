import * as path from 'path';

const requireAll = require('require-all');
const models = requireAll({
  dirname: path.resolve(__dirname, '../components'),
  filter: /(.+Model)\.ts$/,
  resolve: (resource) => {
    return resource.default;
  },
});

export default models;
