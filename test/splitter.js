var Splitter = artifacts.require("./Splitter.sol");

// Comment: You can use async/await for better readability
// Comment: You can add tests for events
// Comment: Add test for negative cases, you should test the "requires" in the functions - you could check this test https://github.com/LockChainLtd/DApp/blob/master/test/Marketplace.js#L106
// Comment: Add tests for kill switch

contract("Splitter", function (accounts) {

    var alice = accounts[0];
    var bob = accounts[1];
    var carol = accounts[2];

    var contract;

    beforeEach(function () {
        return Splitter.new(bob, carol, {from: alice})
            .then(function (instance) {
                contract = instance;
            });
    });

    it('alice should not participating in the scheme', function () {
        return contract.isParticipating(alice, {from: alice})
            .then(function (isParticipating) {
                assert.strictEqual(isParticipating, false, "Alice is participating in the scheme!");
            });
    });

    it('bob should participating in the scheme', function () {
        return contract.isParticipating(bob, {from: bob})
            .then(function (isParticipating) {
                assert.strictEqual(isParticipating, true, "Bob is not participating in the scheme!");
            });
    });

    it('carol should participating in the scheme', function () {
        return contract.isParticipating(carol, {from: carol})
            .then(function (isParticipating) {
                assert.strictEqual(isParticipating, true, "Carol is not participating in the scheme!");
            });
    });

    it('split should update balance of the contract', function () {
        var weiForSplitting = 10;

        return contract.split({from: alice, value: weiForSplitting})
            .then(function (txn) {
                return contract.getBalance();
            })
            .then(function (balance) {
                assert.equal(balance.toString(10), weiForSplitting, "Balance in the contract is not correct");
            });
    });

    it('withdraw should update balance of the contract', function () {
        var weiForSplitting = 10;
        var expectedResult = "5";
        return contract.split({from: alice, value: weiForSplitting})
            .then(function (txn) {
                return contract.withdraw({from: bob})
            }).then(function (txn) {
                return contract.getBalance();
            }).then(function (balance) {
                assert.equal(balance.toString(10), expectedResult, "Balance after withdraw is not correct");
            });
    });

    it('split is burning 1 wei when is called with odd value', function () {
        var weiForSplitting = 11;
        var expectedResult = "5";
        return contract.split({from: alice, value: weiForSplitting})
            .then(function (txn) {
                return contract.withdraw({from: carol})
            }).then(function (txn) {
                return contract.getBalance();
            }).then(function (balance) {
                assert.equal(balance.toString(10), expectedResult, "Balance after withdraw is not correct");
            });
    });
});
