import path from 'path';

const ROOT = path.resolve(__dirname, '../../..');
const src = path.join(ROOT, 'src');
const cache = path.join(ROOT, '.cache');

export default {
  ROOT,
  src,
  cache,
};
