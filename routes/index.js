var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  let members = req.body.listMember.split("\r\n").map(function (val) {
      return val;
  });
  members = members.filter(String).sort(function(a, b){return 0.5 - Math.random()});
  let numberOfTeam = req.body.teams;
  let teamMembers = {};
  let currentMemberIndex = 0;
  let currentTeamIndex = 0;
  
  // Create team slot
  for(i = 0; i < numberOfTeam; i++) {
    teamMembers[i] = [];
  }
  // Assign member to team
  while (currentMemberIndex < members.length) {
    teamMembers[currentTeamIndex].push(members[currentMemberIndex]);
    currentMemberIndex++;
    currentTeamIndex = (++currentTeamIndex >= numberOfTeam) ?  0 : currentTeamIndex;
  }
  res.render('result', { title: 'Express', teamMembers: teamMembers });
});

module.exports = router;
