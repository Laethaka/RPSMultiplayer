var config = {
    apiKey: "AIzaSyDkeJxIQ4qlYyO6yIPu8OnT2YFUOBwSUwA",
    authDomain: "rpsonline-86630.firebaseapp.com",
    databaseURL: "https://rpsonline-86630.firebaseio.com",
    projectId: "rpsonline-86630",
    storageBucket: "",
    messagingSenderId: "753054848249"
};
firebase.initializeApp(config);

var database = firebase.database();

//GAME STATUS BOOLEAN INITIALIZATION
// database.ref('connections/playerOne/').set({
//     isPlayerOne: false,
// })
// database.ref('connections/playerTwo/').set({
//     isPlayerTwo: false,
// })

//LOCAL STATUS BOOLEAN
var playOffered = false;

//VIEWER TRACKING
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});

connectionsRef.once("value", function(snap) {//PAGE LOAD AND ANY PLAYER JOIN/LEAVE
    console.log(snap.val())
    // if (!playOffered) {
    //     playOffered = true;
        if (snap.val().playerOne.isPlayerOne === false) {
            console.log('no player 1 found');
            invitePlayerOne();
        } else if (snap.val().playerTwo.isPlayerTwo===false) {
            console.log('no player 2 found');
            invitePlayerTwo();
        } else {
            console.log('both players found');
            newSpectator();
        };
    // };
});



//PLAYER ASSIGNMENT PROMPTS
function invitePlayerOne() {
    var invitePlay = confirm('Would you like to become Player One?')
    if (invitePlay) {
        becomePlayerOne();
        database.ref('connections/playerOne').set ({
            isPlayerOne: true
        })
    } else {
        newSpectator();
    }
};

function invitePlayerTwo() {
    var invitePlay = confirm('Would you like to become Player Two?')
    if (invitePlay) {
        becomePlayerTwo();
        database.ref('connections/playerTwo').set ({
            isPlayerTwo: true
        })
    } else {
        newSpectator();
    }
};

function newSpectator() {

};

//PLAYER ASSIGNMENT DOM SHIT
function becomePlayerOne() {
    var presenceRef = database.ref("connections/playerOne/isPlayerOne");
    presenceRef.onDisconnect().set(false);
};

function becomePlayerTwo() {
    var presenceRef = database.ref("connections/playerTwo/isPlayerTwo");
    presenceRef.onDisconnect().set(false);
};

