
var SquareVerifier = artifacts.require("SquareVerifier");

var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
module.exports = async (deployer) => {
  await deployer.deploy(SquareVerifier);
  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address, "Udacity Capstone Token", "UCT");
};