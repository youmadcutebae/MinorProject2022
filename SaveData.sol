// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract SaveData {
  // State variables
  uint256 public totalMedicalReports;
  mapping(uint256 => Data) public data;
  mapping(address => uint256[]) public sendersToData; // New mapping for sender's data IDs

  // Structs
  struct Data {
    string hashOfOriginalDataString;
    string secondTimeEncryptedString;
    address sender;
    string medReportId;
  }

  // Function to save data
  function saveData(
    string memory secondTimeEncryptedString,
    string memory hashOfOriginalDataString,
    string memory medReportId
  ) public {
    data[totalMedicalReports] = Data(
      hashOfOriginalDataString,
      secondTimeEncryptedString,
      msg.sender,
      medReportId
    );

    sendersToData[msg.sender].push(totalMedicalReports);
    totalMedicalReports++;
  }
}
