import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// export const transform = {
//   '^.+\\.js$': 'babel-jest',
// };
// export const transformIgnorePatterns = [
//   '/node_modules/',
// ];
// export const setupFilesAfterEnv = ['./jest.setup.mjs'];
// export const globals = {
//   'babel-jest': {
//     useESM: true,
//   },
// };
// module.exports = {
//   transform: {
//     '^.+\\.js$': 'babel-jest',
//   },
//   transformIgnorePatterns: [
//     '/node_modules/',
//   ],
//   setupFilesAfterEnv: ['./jest.setup.js'],
// };
