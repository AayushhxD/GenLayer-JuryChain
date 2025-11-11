// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract JuryChain {
    struct Verdict {
        address submitter;
        string caseId;
        string verdict;
        string reasoning;
        uint256 timestamp;
    }

    mapping(string => Verdict) public verdicts; // caseId => Verdict
    event VerdictStored(address indexed submitter, string caseId, string verdict, string reasoning, uint256 timestamp);

    function storeVerdict(
        string calldata caseId,
        string calldata verdict,
        string calldata reasoning
    ) external {
        require(bytes(caseId).length > 0, "Case ID required");
        require(bytes(verdict).length > 0, "Verdict required");
        require(verdicts[caseId].timestamp == 0, "Verdict already stored");

        verdicts[caseId] = Verdict({
            submitter: msg.sender,
            caseId: caseId,
            verdict: verdict,
            reasoning: reasoning,
            timestamp: block.timestamp
        });

        emit VerdictStored(msg.sender, caseId, verdict, reasoning, block.timestamp);
    }

    function getVerdict(string calldata caseId) external view returns (
        address submitter,
        string memory verdict,
        string memory reasoning,
        uint256 timestamp
    ) {
        Verdict storage v = verdicts[caseId];
        require(v.timestamp != 0, "No verdict for this case");
        return (v.submitter, v.verdict, v.reasoning, v.timestamp);
    }
}
