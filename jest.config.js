const path = require("path");

const ignorePatterns = ["/node_modules/", "/out/", "/src/utilities/aws/__tests__/aws-mock-responses"];

module.exports = {
  rootDir: path.resolve(__dirname),
  verbose: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  //   moduleNameMapper: {
  //     '@/lib/(.*)': '<rootDir>/packages/eventcatalog/lib/$1',
  //   },
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.[jt]sx?$": "babel-jest",
  },
};
