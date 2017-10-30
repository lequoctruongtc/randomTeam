var express = require('express');
var router = express.Router();

var firebase = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyA4h7ZKyG88pHnmTP84ns4arGQg7ZQwEbs",
  authDomain: "randomteam-75929.firebaseapp.com",
  databaseURL: "https://randomteam-75929.firebaseio.com",
  storageBucket: "randomteam-75929.appspot.com",
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Get list member from firebase
function getListMember() {
  return new Promise(function(resolve, reject) {
    var listMember = database.ref('/member');
    listMember.once('value').then(function(snapshot) {
      var data = snapshot.val();
      return data;
    });
  });
}

// Create member after random team
function createMember(members) {
  members.forEach(function(element) {
    database.ref('/member').set({
      name: element
    });
  }, this);
}

/* GET home page. */
router.get('/', function(req, res, next) {

  let urlTeam = database.ref('/team');
  let urlMember = database.ref('/member');
  urlTeam.once('value').then(function(snapshot) {
    return snapshot.val();
  }).then(function(team){
    urlMember.once('value', function(snapshot){
      let listMember = snapshot.val();
      res.render('index', { title: 'Express', team: team, listMember: listMember });
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }).catch(console.error.bind(console));

  // let member = database.ref('/member');
  // member.once('value', function(snapshot) {
  //   let listMember = snapshot.val();
  //   res.render('index', { title: 'Express', listMember: listMember });
  // }, function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
  // });
});

// Random member for teams
router.post('/', function(req, res, next) {
  // let members = req.body.listMember.split("\r\n").map(function (val) {
  //     return val;
  // });
  let members = req.body.listMember;
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
  // console.log(teamMembers);
  // createMember(teamMembers);
  res.render('result', { title: 'Express', teamMembers: teamMembers });
});

module.exports = router;
