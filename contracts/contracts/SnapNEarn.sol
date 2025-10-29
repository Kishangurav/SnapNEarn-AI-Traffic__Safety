// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SnapNEarn
 * @dev Decentralized traffic violation reporting system
 * @notice Stores violation reports with IPFS image hashes on Ethereum blockchain
 */
contract SnapNEarn {
    
    // Violation record structure
    struct Violation {
        uint256 id;
        string imageHash;        // IPFS CID of the violation image
        string violationType;    // Type of violation (e.g., "No Helmet", "Red Light")
        uint256 timestamp;       // Block timestamp when violation was recorded
        address reporter;        // Address of the person who reported
        bool verified;           // Verification status
    }
    
    // State variables
    Violation[] public violations;
    uint256 public violationCount;
    mapping(address => uint256[]) public reporterViolations; // Track violations by reporter
    
    // Events
    event ViolationAdded(
        uint256 indexed id,
        address indexed reporter,
        string imageHash,
        string violationType,
        uint256 timestamp
    );
    
    event ViolationVerified(
        uint256 indexed id,
        address indexed verifier
    );
    
    // Modifiers
    modifier validViolationId(uint256 _id) {
        require(_id < violationCount, "Invalid violation ID");
        _;
    }
    
    /**
     * @dev Add a new violation report
     * @param _imageHash IPFS CID of the violation image
     * @param _violationType Type of traffic violation
     */
    function addViolation(
        string memory _imageHash,
        string memory _violationType
    ) public returns (uint256) {
        require(bytes(_imageHash).length > 0, "Image hash cannot be empty");
        require(bytes(_violationType).length > 0, "Violation type cannot be empty");
        
        uint256 newViolationId = violationCount;
        
        Violation memory newViolation = Violation({
            id: newViolationId,
            imageHash: _imageHash,
            violationType: _violationType,
            timestamp: block.timestamp,
            reporter: msg.sender,
            verified: false
        });
        
        violations.push(newViolation);
        reporterViolations[msg.sender].push(newViolationId);
        violationCount++;
        
        emit ViolationAdded(
            newViolationId,
            msg.sender,
            _imageHash,
            _violationType,
            block.timestamp
        );
        
        return newViolationId;
    }
    
    /**
     * @dev Verify a violation (can be extended with authority check)
     * @param _id Violation ID to verify
     */
    function verifyViolation(uint256 _id) public validViolationId(_id) {
        require(!violations[_id].verified, "Violation already verified");
        
        violations[_id].verified = true;
        
        emit ViolationVerified(_id, msg.sender);
    }
    
    /**
     * @dev Get all violations
     * @return Array of all violation records
     */
    function getAllViolations() public view returns (Violation[] memory) {
        return violations;
    }
    
    /**
     * @dev Get a specific violation by ID
     * @param _id Violation ID
     * @return Violation details
     */
    function getViolation(uint256 _id) 
        public 
        view 
        validViolationId(_id) 
        returns (Violation memory) 
    {
        return violations[_id];
    }
    
    /**
     * @dev Get violations by reporter address
     * @param _reporter Reporter's address
     * @return Array of violation IDs reported by the address
     */
    function getViolationsByReporter(address _reporter) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return reporterViolations[_reporter];
    }
    
    /**
     * @dev Get total number of violations
     * @return Total count
     */
    function getTotalViolations() public view returns (uint256) {
        return violationCount;
    }
    
    /**
     * @dev Get recent violations (last N)
     * @param _count Number of recent violations to retrieve
     * @return Array of recent violations
     */
    function getRecentViolations(uint256 _count) 
        public 
        view 
        returns (Violation[] memory) 
    {
        uint256 count = _count > violationCount ? violationCount : _count;
        Violation[] memory recentViolations = new Violation[](count);
        
        for (uint256 i = 0; i < count; i++) {
            recentViolations[i] = violations[violationCount - 1 - i];
        }
        
        return recentViolations;
    }
}
