// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wingine {

  struct Statement {
    uint id;
    address addr;
    string stmt;
    uint date; 
  }

  struct Vote {
    uint id;
    address addr;
    bool up;
    uint date;
    bool changed;
  }

  Vote[] public votes;
  Statement[] public stmts;

  mapping (uint => uint[]) public stmtVotes;  
  mapping (uint => uint[]) public stmtStmts;

  constructor(string memory stmt) {
    stmts.push(Statement({
      id: stmts.length,
      addr: msg.sender,
      stmt: stmt,
      date: block.timestamp 
    }));
  }

  function stmtCount() public view returns (uint) {
    return stmts.length;
  }

  function voteCount() public view returns (uint) {
    return votes.length;
  }

  function getStmtVotes(uint stmtIndex) public view returns (uint[] memory) {
    return stmtVotes[stmtIndex];
  }

  function getStmtStmts(uint stmtIndex) public view returns (uint[] memory) {
    return stmtStmts[stmtIndex];
  }

  function addVote(uint stmtIndex, bool up) public  {

    // Mark vote changed if already voted - JBG
    for(uint i = 0; i < stmtVotes[stmtIndex].length; i++) {
      uint voteId = stmtVotes[stmtIndex][i];
      if(votes[voteId].addr == msg.sender) {
        votes[voteId].changed = true;
      }
    }

    // Otherwise create new vote - JBG
    stmtVotes[stmtIndex].push(votes.length);
    votes.push(Vote({
      id: votes.length,
      addr: msg.sender,
      up: up,
      date: block.timestamp,
      changed: false 
    }));

  }

  function stmtConsensus(uint stmtIndex) public view returns (bool) {

    bool consensus = true;

    /* Find the first unchanged vote - JBG */
    uint first = 0;
    while(votes[stmtVotes[stmtIndex][first]].changed) ++first;
    bool up = votes[stmtVotes[stmtIndex][first]].up;

    /* Check the reminding votes - JBG */
    for(uint i = first + 1; consensus && i < stmtVotes[stmtIndex].length; i++) {
      uint voteId = stmtVotes[stmtIndex][i];
      if(!votes[voteId].changed)
        consensus = up == votes[voteId].up;
    }

    return consensus;

  }

  function addStmt(uint stmtIndex, string memory stmt) public {
    //require(!stmtConsensus(stmtIndex) && stmtVotes[stmtIndex].length > 1);
    stmtStmts[stmtIndex].push(stmts.length);
    stmts.push(Statement({
      id: stmts.length,
      addr: msg.sender,
      stmt: stmt,
      date: block.timestamp 
    }));
  }

}
