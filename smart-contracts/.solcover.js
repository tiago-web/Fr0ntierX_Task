module.exports = {
  port: 8545,
  copyPackages: ["openzeppelin-solidity"],
  skipFiles: ["static/", "lib/ArrayUtils.sol", "WyvernAtomicizer.sol"],
  compileCommand: "../node_modules/.bin/truffle compile",
  testCommand: "../node_modules/.bin/truffle test --network coverage",
};
