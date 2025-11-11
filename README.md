# ⚖️ JuryChain — Onchain Dispute Resolution with AI Consensus

> Built for the GenLayer Buildathon  
> Developed by **Ayush Godse (Agratas Labs)**

---

## 🧩 Overview

**JuryChain** is a decentralized dispute resolution platform where **AI jurors** powered by **GenLayer** deliver fair and transparent verdicts onchain.  
It enables users, DAOs, and freelancers to resolve conflicts through **trustless, AI-driven consensus**, combining the best of **Web3 governance** and **AI reasoning**.

---

## 🌐 Vision

To create a transparent, intelligent, and decentralized justice system where AI jurors powered by GenLayer deliver fair, onchain verdicts for disputes across DAOs, freelancers, and digital communities.

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| **Frontend** | React (Next.js) + TailwindCSS + Wagmi + Ethers.js | UI, wallet connection, and onchain interaction |
| **Backend** | Vercel Serverless Functions (Node.js) | LLM and contract bridge |
| **Blockchain** | Solidity + Base L2 (or Ethereum Sepolia) | Immutable storage of verdict hashes |
| **Database** | Firebase Firestore | Off-chain case storage and verdict reasoning |
| **AI Layer** | GenLayer | Non-deterministic AI jurors reaching consensus |
| **Storage** | IPFS | Evidence and large data storage |

---

## 🔄 Architecture Flow

1. User connects wallet (MetaMask / Coinbase Wallet).
2. Submits dispute (title, description, and evidence).
3. Firestore stores dispute metadata.
4. Smart contract stores hash of dispute (caseHash).
5. Backend sends case data to **GenLayer AI jurors**.
6. Multiple LLMs analyze evidence and return verdicts.
7. GenLayer consensus finalizes the decision.
8. Verdict stored in Firestore + hash saved onchain.
9. User views the final verdict with reasoning in the JuryChain dashboard.

---

## 🧱 Smart Contract Functions (Solidity)

```solidity
function createCase(string memory caseHash) public;
function storeVerdict(uint caseId, string memory verdictHash) public;
function getCase(uint caseId) public view returns (Case memory);
