module.exports = {
  repeat: {
    timePurgeGames: 60 * 60,  // 1 hour
    timePurgeSockets: 20
  },
  expiration: {
    finishedGame: 60 * 60 * 3,  // 3 hours
    unfinishedGame: 60 * 60 * 24 * 31 // 1 month
  }
};
