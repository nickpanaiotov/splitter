let Splitter = artifacts.require("./Splitter.sol");

contract("Splitter", function (accounts) {

    let alice = accounts[0];
    let bob = accounts[1];
    let carol = accounts[2];

    let contract;

    beforeEach(async () => {
        contract = await Splitter.new(bob, carol, {from: alice});
    });

    it("alice should be the owner", async () => {
        assert.equal(await contract.getOwner(), alice)
    });

    it("owner should be able to kill the contract", async () => {
        await contract.killMe({from: alice});
        assert.strictEqual(await contract.getOwner(), "0x");
    });

    it('split should update balance of the contract', async () => {
        let weiForSplitting = 10;
        await contract.sendTransaction({from: alice, value: weiForSplitting});
        assert.equal((await contract.getBalance()).toString(10), weiForSplitting, "Balance in the contract is not correct")
    });

    it('withdraw should update balance of the contract', async () => {
        let weiForSplitting = 10;
        let expectedResult = "5";

        await contract.sendTransaction({from: alice, value: weiForSplitting});
        await contract.withdraw({from: bob});
        assert.equal((await contract.getBalance()).toString(10), expectedResult, "Balance after withdraw is not correct");
    });

    it("event should be emitted when depositing", async function () {
        let weiForSplitting = 66;
        let expectedEvent = 'DepositEvent';

        let result = await contract.sendTransaction({from: alice, value: weiForSplitting});

        assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setRate!");
        assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
    });

    it("event should be emitted when withdrawing", async function () {
        let weiForSplitting = 66;
        let expectedEvent = 'WithdrawEvent';

        await contract.sendTransaction({from: alice, value: weiForSplitting});
        let result = await contract.withdraw({from: bob});

        assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setRate!");
        assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
    });

    it("contract shouldn't be able to be deployed without participants", async () => {
        let expectedMessage = "VM Exception while processing transaction: invalid opcode";
        try {
            contract = await Splitter.new(null, null, {from: alice});
            assert.fail("Exceptions wasn't thrown.");
        } catch (error) {
            assert.strictEqual(error.message, expectedMessage ,
                "Unexpected message!");
        }
    });

    it("contract shouldn't be able to be deployed with invalid addresses", async () => {
        let expectedMessage = "VM Exception while processing transaction: invalid opcode";
        try {
            contract = await Splitter.new("", "", {from: alice});
            assert.fail("Exceptions wasn't thrown.");
        } catch (error) {
            assert.strictEqual(error.message, expectedMessage ,
                "Unexpected message!");
        }
    });

    it("bob shouldn't be the owner", async () => {
        assert.notEqual(await contract.getOwner(), bob)
    });

    it("bob shouldn't be able to kill the contract", async () => {
        let expectedMessage = "VM Exception while processing transaction: invalid opcode";
        try {
            await contract.killMe({from: bob});
            assert.fail("Exceptions wasn't thrown.");
        } catch (error) {
            assert.strictEqual(error.message, expectedMessage ,
                "Unexpected message!");
        }
    });
});