// export default {
//   success: jest.fn(),
//   debug: jest.fn(),
//   error: jest.fn(),
//   info: jest.fn(),
// };
const log = jest.createMockFromModule('signale');
export default log;
