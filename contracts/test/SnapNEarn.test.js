const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SnapNEarn Contract", function () {
  let snapNEarn;
  let owner;
  let reporter1;
  let reporter2;

  beforeEach(async function () {
    [owner, reporter1, reporter2] = await ethers.getSigners();
    
    const SnapNEarn = await ethers.getContractFactory("SnapNEarn");
    snapNEarn = await SnapNEarn.deploy();
    await snapNEarn.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy with zero violations", async function () {
      expect(await snapNEarn.violationCount()).to.equal(0);
    });

    it("Should have correct initial state", async function () {
      const totalViolations = await snapNEarn.getTotalViolations();
      expect(totalViolations).to.equal(0);
    });
  });

  describe("Adding Violations", function () {
    it("Should add a violation successfully", async function () {
      const imageHash = "QmTest123456789";
      const violationType = "No Helmet";

      const tx = await snapNEarn.connect(reporter1).addViolation(imageHash, violationType);
      await tx.wait();

      expect(await snapNEarn.violationCount()).to.equal(1);
    });

    it("Should emit ViolationAdded event", async function () {
      const imageHash = "QmTest123456789";
      const violationType = "No Helmet";

      await expect(snapNEarn.connect(reporter1).addViolation(imageHash, violationType))
        .to.emit(snapNEarn, "ViolationAdded")
        .withArgs(0, reporter1.address, imageHash, violationType, await time.latest() + 1);
    });

    it("Should reject empty image hash", async function () {
      await expect(
        snapNEarn.connect(reporter1).addViolation("", "No Helmet")
      ).to.be.revertedWith("Image hash cannot be empty");
    });

    it("Should reject empty violation type", async function () {
      await expect(
        snapNEarn.connect(reporter1).addViolation("QmTest123", "")
      ).to.be.revertedWith("Violation type cannot be empty");
    });

    it("Should track violations by reporter", async function () {
      await snapNEarn.connect(reporter1).addViolation("QmTest1", "No Helmet");
      await snapNEarn.connect(reporter1).addViolation("QmTest2", "Red Light");
      
      const violations = await snapNEarn.getViolationsByReporter(reporter1.address);
      expect(violations.length).to.equal(2);
    });
  });

  describe("Retrieving Violations", function () {
    beforeEach(async function () {
      await snapNEarn.connect(reporter1).addViolation("QmTest1", "No Helmet");
      await snapNEarn.connect(reporter2).addViolation("QmTest2", "Red Light");
      await snapNEarn.connect(reporter1).addViolation("QmTest3", "Wrong Lane");
    });

    it("Should get all violations", async function () {
      const violations = await snapNEarn.getAllViolations();
      expect(violations.length).to.equal(3);
    });

    it("Should get specific violation by ID", async function () {
      const violation = await snapNEarn.getViolation(0);
      expect(violation.imageHash).to.equal("QmTest1");
      expect(violation.violationType).to.equal("No Helmet");
      expect(violation.reporter).to.equal(reporter1.address);
    });

    it("Should get recent violations", async function () {
      const recentViolations = await snapNEarn.getRecentViolations(2);
      expect(recentViolations.length).to.equal(2);
      expect(recentViolations[0].imageHash).to.equal("QmTest3"); // Most recent
    });

    it("Should handle invalid violation ID", async function () {
      await expect(
        snapNEarn.getViolation(999)
      ).to.be.revertedWith("Invalid violation ID");
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await snapNEarn.connect(reporter1).addViolation("QmTest1", "No Helmet");
    });

    it("Should verify a violation", async function () {
      await snapNEarn.connect(owner).verifyViolation(0);
      const violation = await snapNEarn.getViolation(0);
      expect(violation.verified).to.be.true;
    });

    it("Should emit ViolationVerified event", async function () {
      await expect(snapNEarn.connect(owner).verifyViolation(0))
        .to.emit(snapNEarn, "ViolationVerified")
        .withArgs(0, owner.address);
    });

    it("Should not verify already verified violation", async function () {
      await snapNEarn.connect(owner).verifyViolation(0);
      await expect(
        snapNEarn.connect(owner).verifyViolation(0)
      ).to.be.revertedWith("Violation already verified");
    });
  });
});

// Helper to get latest block timestamp
const time = {
  latest: async () => {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
};
