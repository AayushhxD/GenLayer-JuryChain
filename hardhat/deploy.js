const hre = require("hardhat");

async function main() {
  const JuryChain = await hre.ethers.getContractFactory("JuryChain");
  const contract = await JuryChain.deploy();
  await contract.deployed();
  console.log("JuryChain deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
