class Player {
  constructor(
    id,
    {
      username,
      profilePicUrl,
      score,
      gamesPlayed,
      gamesWon,
      historyPlayed,
      historyWon,
      geographyPlayed,
      geographyWon,
      financePlayed,
      financeWon,
      logoPlayed,
      logoWon,
      triviaPlayed,
      triviaWon,
      hiddenPlayed,
      hiddenWon,
    },
  ) {
    this.id = id;
    this.points = 0;
    this.username = username;
    this.profilePicUrl = profilePicUrl;
    this.score = score;
    this.gamesPlayed = gamesPlayed;
    this.gamesWon = gamesWon;
    this.historyPlayed = historyPlayed;
    this.historyWon = historyWon;
    this.geographyPlayed = geographyPlayed;
    this.geographyWon = geographyWon;
    this.financePlayed = financePlayed;
    this.financeWon = financeWon;
    this.logoPlayed = logoPlayed;
    this.logoWon = logoWon;
    this.triviaPlayed = triviaPlayed;
    this.triviaWon = triviaWon;
    this.hiddenPlayed = hiddenPlayed;
    this.hiddenWon = hiddenWon;
  }
}

module.exports = Player;
