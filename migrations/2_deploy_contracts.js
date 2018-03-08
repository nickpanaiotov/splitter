var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
    var bob = "0x0d47ba4c0336bcdbc177b424ce0a27030b477ffc";
    var carol = "0x8adc3de1dec12a0f57c64820e0656a9544b7dea0";
    deployer.deploy(Splitter, bob, carol);
};