// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.0;

abstract contract PatientData { // Contract is declared as abstract
  uint256 public countMedicalReports = 0;

  mapping(address => Sender) public senders;
  mapping(uint => PatientMedicalReportStruct) public medicalReports;

  mapping(uint => string) public hashes;
  uint hashCount = 0;

  struct PatientBioStruct {
    string name;
    string birthDate;
    string phoneNumber;
    string patientAddress;
    uint medicalReportNo;
  }

  struct PatientMedicalReportStruct {
    address senderId;
    string medReportId;
    uint weight;
    uint height;
    string bloodGroup;
    string diseaseName;
    string diseaseDescription;
    string diseaseStartedOn;
  }

  struct Sender {
    string name;
    string institutionName;
    string institutionCode;
    uint patientCount;
    mapping(uint => string) patientsArray;
    mapping(string => PatientBioStruct) patients;
  }

  // Constructor is removed as constructors are not needed for abstract contracts

  function addMedicalReport(
    string memory patientId,
    string memory patientName,
    string memory birthDate,
    string memory phoneNumber,
    string memory patientAddress,
    string memory medReportId,
    uint weight,
    uint height,
    string memory bloodGroup,
    string memory diseaseName,
    string memory diseaseDescription,
    string memory diseaseStartedOn
  ) public {
    bytes memory name = bytes(senders[msg.sender].patients[patientId].name);
    if( name.length == 0)
    {
      senders[msg.sender].patientsArray[senders[msg.sender].patientCount++] = patientId;
      senders[msg.sender].patients[patientId] =
        PatientBioStruct(patientName, birthDate, phoneNumber, patientAddress, countMedicalReports);

      medicalReports[countMedicalReports++] =
        PatientMedicalReportStruct(msg.sender,medReportId, weight, height, bloodGroup, diseaseName, diseaseDescription, diseaseStartedOn);

    } else {
      PatientBioStruct memory patientBio =
        senders[msg.sender].patients[patientId];
      senders[msg.sender].patients[patientId] =
        PatientBioStruct(patientName, birthDate, phoneNumber, patientAddress, patientBio.medicalReportNo);
      medicalReports[patientBio.medicalReportNo] =
        PatientMedicalReportStruct(msg.sender, medReportId, weight, height, bloodGroup, diseaseName, diseaseDescription, diseaseStartedOn);

    }
  }

  function getPatientsList(uint index) public view returns (
    string memory,
    string memory,
    string memory,
    string memory,
    uint) {
    PatientBioStruct memory patientBio =
      senders[msg.sender].patients[senders[msg.sender].patientsArray[index]];
    return (
      patientBio.name,
      patientBio.birthDate,
      patientBio.phoneNumber,
      patientBio.patientAddress,
      patientBio.medicalReportNo
    );
  }
}
