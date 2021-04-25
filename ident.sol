// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Identity {

  struct Participant {
    uint id;
    address addr;
    string name;
    uint date; 
  }

  struct Group {
    uint id;
    string name;
    uint date;
  }

  Participant[] public parts;
  Group[] public groups;

  mapping (uint => uint[]) public groupParts;  


  function groupCount() public view returns (uint) {
    return groups.length;
  }

  function participantsCount() public view returns (uint) {
    return parts.length;
  }

  function addGroup(string memory name) public {
    groups.push(Group({
      id: groups.length,
      name: name,
      date: block.timestamp 
    }));
  }

  function addPart(uint groupIndex, string memory name) public {
    groupParts[groupIndex].push(parts.length);
    parts.push(Participant({
      id: parts.length,
      name: name,
      addr: msg.sender,
      date: block.timestamp
    }));
  }

  function getGroupParts(uint groupIndex) public view returns (uint[] memory) {
    return groupParts[groupIndex];
  }

}

