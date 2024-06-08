module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/unitTest/**/*.js?(x)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};