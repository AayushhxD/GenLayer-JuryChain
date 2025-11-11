# JuryChain Smart Contract

## Structure
- `contracts/JuryChain.sol` — Solidity contract
- `hardhat/` — Hardhat scripts, config, and tests

## Setup
1. Copy `.env.example` to `.env` and fill in your private key and RPC URLs.
2. Install dependencies:
   ```bash
   npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers chai
   ```
3. Compile contract:
   ```bash
   npx hardhat compile --config hardhat/hardhat.config.js
   ```
4. Run tests:
   ```bash
   npx hardhat test --config hardhat/hardhat.config.js
   ```
5. Deploy to Sepolia or Base Sepolia:
   ```bash
   npx hardhat run hardhat/deploy.js --network sepolia
   # or
   npx hardhat run hardhat/deploy.js --network baseSepolia
   ```

## Contract Usage
- Call `storeVerdict(caseId, verdict, reasoning)` to store a verdict.
- Call `getVerdict(caseId)` to retrieve a verdict.
