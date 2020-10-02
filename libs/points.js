const scraper = require('./scraper')
// const scoring = require('../config.json')
/**
 * @function calculate Calculate team points
 * @param userTeams UserTeam data. Check Schema in points.js
 * @param scoring scoring config
 */

exports.calculate = async (userTeams, scoring) => {

    let pointsTable = {}, multiplier = 1
    let scoreboard = await scraper.cricinfoWorker(userTeams.matchUrl)
    userTeams.users.forEach(user => {
        pointsTable[user.username] = {}
        pointsTable[user.username].currentScore = 0
        pointsTable[user.username].totalScore = user.totalScore
        user.team.forEach(playerName => {
    
            if(playerName.captain){
                multiplier = scoring.captainMultiplier
            } else {
                multiplier = 1
            }
            if(scoreboard.batsmen[playerName.name] != null){
                pointsTable[user.username].currentScore += multiplier*scoring.run*Number.parseInt(scoreboard.batsmen[playerName.name].runs)
            }
            if(scoreboard.bowlers[playerName.name] != null){
                pointsTable[user.username].currentScore += multiplier*scoring.wicket*Number.parseInt(scoreboard.bowlers[playerName.name].wickets)
            }
        })
        pointsTable[user.username].totalScore += Number.parseInt(pointsTable[user.username].currentScore)
    })
    // console.log(pointsTable);

    return pointsTable
}
