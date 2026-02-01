// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DecentralizedHealthcareRecords (DHR)
 * @dev A smart contract for managing access to medical records on IPFS
 * Patients can grant/revoke access to doctors for specific medical records
 */
contract DecentralizedHealthcareRecords {
    // Events
    event AccessGranted(address indexed patient, address indexed doctor, string ipfsHash);
    event AccessRevoked(address indexed patient, address indexed doctor, string ipfsHash);
    event RecordCreated(address indexed patient, string ipfsHash);

    // Access control mapping: patient => doctor => ipfsHash => hasAccess
    mapping(address => mapping(address => mapping(string => bool))) public recordAccess;

    // Track who has access to a record: ipfsHash => array of doctor addresses
    mapping(string => address[]) public recordAccessors;

    // Track if a doctor already has access to avoid duplicates
    mapping(string => mapping(address => bool)) private accessorExists;

    /**
     * @dev Patient grants access to their medical record to a doctor
     * @param _doctor The address of the doctor
     * @param _ipfsHash The IPFS hash of the medical record
     */
    function grantAccess(address _doctor, string memory _ipfsHash) public {
        require(_doctor != address(0), "Invalid doctor address");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        require(_doctor != msg.sender, "Cannot grant access to yourself");

        recordAccess[msg.sender][_doctor][_ipfsHash] = true;

        // Add doctor to accessors list if not already present
        if (!accessorExists[_ipfsHash][_doctor]) {
            recordAccessors[_ipfsHash].push(_doctor);
            accessorExists[_ipfsHash][_doctor] = true;
        }

        emit AccessGranted(msg.sender, _doctor, _ipfsHash);
    }

    /**
     * @dev Patient revokes access to their medical record from a doctor
     * @param _doctor The address of the doctor
     * @param _ipfsHash The IPFS hash of the medical record
     */
    function revokeAccess(address _doctor, string memory _ipfsHash) public {
        require(_doctor != address(0), "Invalid doctor address");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");

        recordAccess[msg.sender][_doctor][_ipfsHash] = false;

        emit AccessRevoked(msg.sender, _doctor, _ipfsHash);
    }

    /**
     * @dev Check if a doctor has access to a patient's record
     * @param _patient The address of the patient
     * @param _doctor The address of the doctor
     * @param _ipfsHash The IPFS hash of the medical record
     * @return hasAccess Whether the doctor has access to the record
     */
    function hasAccess(
        address _patient,
        address _doctor,
        string memory _ipfsHash
    ) public view returns (bool) {
        return recordAccess[_patient][_doctor][_ipfsHash];
    }

    /**
     * @dev Get the number of doctors with access to a record
     * @param _ipfsHash The IPFS hash of the medical record
     * @return count The number of doctors with access
     */
    function getAccessCount(string memory _ipfsHash) public view returns (uint256) {
        return recordAccessors[_ipfsHash].length;
    }

    /**
     * @dev Get all doctors with access to a record
     * @param _ipfsHash The IPFS hash of the medical record
     * @return doctors Array of doctor addresses with access
     */
    function getAccessors(string memory _ipfsHash) public view returns (address[] memory) {
        return recordAccessors[_ipfsHash];
    }
}
