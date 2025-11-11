const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JuryChain", function () {
  it("Should store and retrieve a verdict", async function () {
    const [owner] = await ethers.getSigners();
    const JuryChain = await ethers.getContractFactory("JuryChain");
    const contract = await JuryChain.deploy();
    await contract.deployed();

    const caseId = "CASE-1";
    const verdict = "Claimant Wins";
    const reasoning = "AI consensus";

    await contract.storeVerdict(caseId, verdict, reasoning);
    const result = await contract.getVerdict(caseId);

    expect(result.submitter).to.equal(owner.address);
    expect(result.verdict).to.equal(verdict);
    expect(result.reasoning).to.equal(reasoning);
    expect(result.timestamp).to.be.gt(0);
  });
});
