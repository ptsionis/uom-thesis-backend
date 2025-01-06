class ChallengeRecord {
  constructor(challengeId, challengerId, targetId, isOpen) {
    this.challengeId = challengeId;
    this.challengerId = challengerId;
    this.targetId = targetId;
    this.isOpen = isOpen;
  }
}

module.exports = ChallengeRecord;
