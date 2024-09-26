// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract BugTracker {
    struct Bug {
        string title;
        string application;
        string os;
        string severity;
        string description;
        address reporter;
        uint timestamp;
    }

    Bug[] public bugs;

    event BugLogged(
        string title,
        string application,
        string os,
        string severity,
        string description,
        address reporter,
        uint timestamp,
        string txHash
    );

    function logBug(
        string memory _title,
        string memory _application,
        string memory _os,
        string memory _severity,
        string memory _description
    ) public {
        // Check if bug already exists
        for (uint i = 0; i < bugs.length; i++) {
            if (keccak256(bytes(bugs[i].title)) == keccak256(bytes(_title)) &&
                keccak256(bytes(bugs[i].application)) == keccak256(bytes(_application)) &&
                keccak256(bytes(bugs[i].os)) == keccak256(bytes(_os))) {
                revert("Bug already exists");
            }
        }
        bugs.push(Bug(_title, _application, _os, _severity, _description, msg.sender, block.timestamp));
        emit BugLogged(_title, _application, _os, _severity, _description, msg.sender, block.timestamp, "");
    }

    function getBugs() public view returns (Bug[] memory) {
        return bugs;
    }
}
