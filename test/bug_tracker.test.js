const BugTracker = artifacts.require("BugTracker");

contract("BugTracker", accounts => {
    const [reporter] = accounts;
    
    it("should log a bug successfully", async () => {
        const instance = await BugTracker.deployed();
        await instance.logBug("Bug Title", "Application", "OS", "Severity", "Description", { from: reporter });
        const bugs = await instance.getBugs();
        assert.equal(bugs.length, 1, "Bug was not logged correctly");
        assert.equal(bugs[0].title, "Bug Title", "Bug title does not match");
        assert.equal(bugs[0].application, "Application", "Bug application does not match");
        assert.equal(bugs[0].os, "OS", "Bug OS does not match");
        assert.equal(bugs[0].severity, "Severity", "Bug severity does not match");
        assert.equal(bugs[0].description, "Description", "Bug description does not match");
    });

    it("should not log a duplicate bug", async () => {
        const instance = await BugTracker.deployed();
        try {
            await instance.logBug("Bug Title", "Application", "OS", "Severity", "Description", { from: reporter });
            assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert.include(error.message, "Bug already exists", "Expected 'Bug already exists' error but got another error");
        }
    });

    it("should emit an event when a bug is logged", async () => {
        const instance = await BugTracker.deployed();
        const result = await instance.logBug("New Bug", "New Application", "New OS", "New Severity", "New Description", { from: reporter });
        const event = result.logs[0].event;
        assert.equal(event, "BugLogged", "BugLogged event was not emitted");
    });

    it("should return the correct number of bugs", async () => {
        const instance = await BugTracker.deployed();
        const bugs = await instance.getBugs();
        assert.equal(bugs.length, 2, "Number of bugs does not match");
    });
});
