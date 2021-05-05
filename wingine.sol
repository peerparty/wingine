// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wingine {

  enum State { REG, VOTE, STMT, DONE }

  struct Statement {
    uint parentId;
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

  uint public stmtId = 0;
  address private owner;

  State private state = State.REG; 
  uint private voteTime;
  uint private stmtTime;

  uint private timer;

  Vote[] public votes;
  Statement[] public stmts;

  mapping (uint => uint[]) public stmtVotes;  
  mapping (uint => uint[]) public stmtStmts;

  constructor(
    string memory stmt,
    uint _voteTime,
    uint _stmtTime) {

    owner = msg.sender;
    voteTime = _voteTime;
    stmtTime = _stmtTime;

    stmts.push(Statement({
      parentId: type(uint256).max,
      id: stmts.length,
      addr: msg.sender,
      stmt: stmt,
      date: block.timestamp 
    }));
  }

  function start() public {
    require(msg.sender == owner);
    state = State.VOTE;
    timer = block.timestamp + voteTime;
  }

  function nextStmt() public view returns (uint) {
    Statement memory stmt = stmts[stmtId];
    uint[] memory children = stmtStmts[stmt.parentId];
    for(uint i = 0; i < children.length; i++) {
      if(children[i] == stmtId) {
        if(i + 1 < children.length) return children[i + 1];
        else return stmt.parentId;
      }
    }
    return stmt.parentId;
  }

  function getState() public returns (State) {
    if(State.REG == state) return state;
    else if(block.timestamp > timer) {
      if(State.VOTE == state) {
        state = State.STMT;
      } else if(State.STMT == state) {
        state = State.VOTE;
      }
    }
    return state;
  }

  function stmtCount() public view returns (uint) {
    return stmts.length;
  }

  function voteCount() public view returns (uint) {
    return votes.length;
  }

  function getStmtVotes(uint _stmtId) public view returns (uint[] memory) {
    return stmtVotes[_stmtId];
  }

  function getStmtStmts(uint _stmtId) public view returns (uint[] memory) {
    return stmtStmts[_stmtId];
  }

  function addVote(bool up) public {

    // Mark vote changed if already voted - JBG
    for(uint i = 0; i < stmtVotes[stmtId].length; i++) {
      uint voteId = stmtVotes[stmtId][i];
      if(votes[voteId].addr == msg.sender) {
        votes[voteId].changed = true;
      }
    }

    // Otherwise create new vote - JBG
    stmtVotes[stmtId].push(votes.length);
    votes.push(Vote({
      id: votes.length,
      addr: msg.sender,
      up: up,
      date: block.timestamp,
      changed: false 
    }));

  }

  function stmtConsensus(uint _stmtId) public view returns (bool) {

    bool consensus = true;

    /* Find the first unchanged vote - JBG */
    uint first = 0;
    while(votes[stmtVotes[_stmtId][first]].changed) ++first;
    bool up = votes[stmtVotes[_stmtId][first]].up;

    /* Check the reminding votes - JBG */
    for(uint i = first + 1; consensus && i < stmtVotes[_stmtId].length; i++) {
      uint voteId = stmtVotes[_stmtId][i];
      if(!votes[voteId].changed)
        consensus = up == votes[voteId].up;
    }

    return consensus;

  }

  function addStmt(string memory stmt) public {

    require(
      !stmtConsensus(stmtId) &&
      stmtVotes[stmtId].length > 1 &&
      State.STMT == state);

    stmtStmts[stmtId].push(stmts.length);
    stmts.push(Statement({
      parentId: stmtId,
      id: stmts.length,
      addr: msg.sender,
      stmt: stmt,
      date: block.timestamp 
    }));
  }

}
