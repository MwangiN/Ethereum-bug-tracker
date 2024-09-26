const BugTracker = artifacts.require("BugTracker");

module.exports = function(deployer) {
    deployer.deploy(BugTracker);
};
