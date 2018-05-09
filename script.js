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

//GAME INITIALIZATION
// database.ref('connections/playerOne/').set({
//     active: false,
//     name: 'Player1'
// })
// database.ref('connections/playerTwo/').set({
//     active: false,
//     name: 'Player2'
// })

database.ref('game/').set({
    player1move: ' ',
    player2move: ' '
})

//LOCAL SCORE VARS
var p1Wins, p1Ties, p1Losses, p2Wins, p2Ties, p2Losses;

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
        if (snap.val().playerOne.active === false) {
            // console.log('no player 1 found');
            invitePlayerOne();
        } else if (snap.val().playerTwo.active===false) {
            // console.log('no player 2 found');
            invitePlayerTwo();
        } else {
            // console.log('both players found');
            becomeSpectator();
        };
});

//PLAYER INFO LISTENERS
database.ref('connections/playerOne/').on('value', function(snap) {
    // console.log('player1 snapval: '+ snap.val())
    $('#player1Name').text(snap.val().name)
})
database.ref('connections/playerTwo/').on('value', function(snap) {
    // console.log('player2 snapval: '+ snap.val())
    $('#player2Name').text(snap.val().name)
})


//PLAYER ASSIGNMENT PROMPTS
function invitePlayerOne() {
    var invitePlay = confirm('Would you like to become Player One?')
    if (invitePlay) {
        becomePlayerOne();
    } else {
        becomeSpectator();
    }
};
function invitePlayerTwo() {
    var invitePlay = confirm('Would you like to become Player Two?')
    if (invitePlay) {
        becomePlayerTwo();
    } else {
        becomeSpectator();
    }
};

//PLAYER ROLE INITIALIZATION AND DISCONNECT LISTENING
function becomePlayerOne() {
    $('#p1Buttons, #p1CurrentBar').removeClass('invisible')
    var userName = prompt('Please enter your username', 'Imperials');
    database.ref('connections/playerOne').set({
        active: true,
        name: userName,
        wins: 0,
        ties: 0,
        losses: 0
    })
    p1Wins = 0;
    p1Ties = 0;
    p1Losses = 0;
    $('#p2Wins, #p2Ties, #p2Losses').text('0')

    var presenceRef = database.ref("connections/playerOne/active");
    presenceRef.onDisconnect().set(false);
};
function becomePlayerTwo() {
    $('#p2Buttons, #p2CurrentBar').removeClass('invisible')
    var userName = prompt('Please enter your username', 'Rebels');
    database.ref('connections/playerTwo').set({
        active: true,
        name: userName,
        wins: 0,
        ties: 0,
        losses: 0
    })
    p2Wins = 0;
    p2Ties = 0;
    p2Losses = 0;
    $('#p2Wins, #p2Ties, #p2Losses').text('0')

    var presenceRef = database.ref("connections/playerTwo/active");
    presenceRef.onDisconnect().set(false);
};
function becomeSpectator() {

};

//BUTTONS PICKING MOVES AND STARTING COMBAT
$('.player1button').on('click', function() {
    var move = $(this).attr('data')
    $('#p1CurrentMove').text(move)
    database.ref('game/').update({
        player1move: move
    })
})
$('.player2button').on('click', function() {
    var move = $(this).attr('data')
    $('#p2CurrentMove').text(move)
    database.ref('game/').update({
        player2move: move
    })
})
database.ref('game/').on('value', function(snap) {
    if (snap.val().player1move !== ' ' && snap.val().player2move !== ' ') {
        var move1 = snap.val().player1move
        var move2 = snap.val().player2move
        combat(move1, move2);
    }
})

//COMBAT FUNCTION
function combat(move1, move2) {
    if ((move1 === "rock") && (move2 === "scissors")) {
        player1Win();
    } else if ((move1 === "rock") && (move2 === "paper")) {
        player2Win();
    } else if ((move1 === "scissors") && (move2 === "rock")) {
        player2Win();
    } else if ((move1 === "scissors") && (move2 === "paper")) {
        player1Win();
    } else if ((move1 === "paper") && (move2 === "rock")) {
        player1Win();
    } else if ((move1 === "paper") && (move2 === "scissors")) {
        player2Win();
    } else if (move1 === move2) {
        tie();
    }
    database.ref('game/').update({ //CLEARING MOVE VALUES
        player1move: ' ',
        player2move: ' '
    })
    $('#p1CurrentMove').text(' ')
    $('#p2CurrentMove').text(' ')
}

//WIN/LOSS FUNCTIONS
function player1Win() {
    p1Wins++;
    database.ref('connections/playerOne/').update({
        wins: p1Wins
    })
    p2Losses++;
}
function player2Win() {
    console.log('player2 wins!')
}
function tie() {
    console.log('tie!')
}







// $('#p2Rock').on('click', function() {
//     var player2Score;

    // return database.ref('game/').once('value').then (function (snapshot) {
    //     player2Score = 
    // })

//     database.ref('game/').update({

//     })
// })
