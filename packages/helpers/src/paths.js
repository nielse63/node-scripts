import path from 'path';

const ROOT = path.resolve(__dirname, '../../..');
const src = path.join(ROOT, 'src');
const cache = path.join(process.cwd(), '.cache');

export default {
  ROOT,
  src,
  cache,
};
