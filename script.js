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

//LOCAL SCORE VARS
var wins, losses, ties, isPlayer1;

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
    $('#player1Name').text(snap.val().name)
    $('#p1Wins').text(snap.val().wins)
    $('#p1Ties').text(snap.val().ties)
    $('#p1Losses').text(snap.val().losses)
})
database.ref('connections/playerTwo/').on('value', function(snap) {
    $('#player2Name').text(snap.val().name)
    $('#p2Wins').text(snap.val().wins)
    $('#p2Ties').text(snap.val().ties)
    $('#p2Losses').text(snap.val().losses)
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

//PLAYER ONE SETUP AND DISCONNECT LISTENING
function becomePlayerOne() {
    $('#p1Buttons, #p1CurrentBar').removeClass('invisible')
    var userName = prompt('Please enter your username', 'Imperials');
    //SERVER PLAYER VARS SETUP
    database.ref('connections/playerOne').set({
        active: true,
        name: userName,
        wins: 0,
        ties: 0,
        losses: 0
    })
    //LOCAL PLAYER VARS SETUP
    isPlayer1 = true;
    wins = 0;
    ties = 0;
    losses = 0;
    $('#p2Wins, #p2Ties, #p2Losses').text('0')
    $('.player-two-box').css('background-color', 'lightcoral')
    $('.player-one-box').css('background-color', 'lightblue')

    database.ref('game/').set({
        player1move: ' ',
        player2move: ' '
    })

    //DISCONNECT LISTENING
    var presenceRef = database.ref("connections/playerOne/active");
    presenceRef.onDisconnect().set(false);
};

//PLAYER TWO SETUP AND DISCONNECT LISTENING
function becomePlayerTwo() {
    $('#p2Buttons, #p2CurrentBar').removeClass('invisible')
    var userName = prompt('Please enter your username', 'Rebels');
    //SERVER PLAYER VARS SETUP
    database.ref('connections/playerTwo').set({
        active: true,
        name: userName,
        wins: 0,
        ties: 0,
        losses: 0
    })
    //LOCAL PLAYER VARS SETUP
    isPlayer1 = false;
    wins = 0;
    ties = 0;
    losses = 0;
    $('#p2Wins, #p2Ties, #p2Losses').text('0')
    $('.player-two-box').css('background-color', 'lightblue')
    $('.player-one-box').css('background-color', 'lightcoral')

    database.ref('game/').set({
        player1move: ' ',
        player2move: ' '
    })

    //DISCONNECT LISTENING
    var presenceRef = database.ref("connections/playerTwo/active");
    presenceRef.onDisconnect().set(false);
};

//UHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
function becomeSpectator() {

};

//BUTTONS PICKING MOVES AND LISTENER TO START COMBAT
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

//COMBAT TREE
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
    database.ref('game/').update({ //CLEARING SERVER AND LOCAL MOVE VALUES
        player1move: ' ',
        player2move: ' '
    })
    $('#p1CurrentMove').text(' ')
    $('#p2CurrentMove').text(' ')
}

//WIN/LOSS FUNCTIONS, EACH PLAYER ONLY UPDATES THEIR OWN FIREBASE OBJECT
function player1Win() {
    if (isPlayer1) {
        wins++;
        $('#reactionImage').attr('src', 'images/victory.jpg');
        database.ref('connections/playerOne/').update({
            wins: wins
        })
    } else {
        losses++;
        $('#reactionImage').attr('src', 'images/defeat.jpg')
        database.ref('connections/playerTwo/').update({
            losses: losses
        })
    }
}
function player2Win() {
    if (isPlayer1) {
        losses++;
        $('#reactionImage').attr('src', 'images/defeat.jpg')
        database.ref('connections/playerOne/').update({
            losses: losses
        })
    } else {
        wins++;
        $('#reactionImage').attr('src', 'images/victory.jpg')
        database.ref('connections/playerTwo/').update({
            wins: wins
        })
    }
}
function tie() {
    ties++;
    $('#reactionImage').attr('src', 'images/tie.jpg')
    if (isPlayer1) {
        database.ref('connections/playerOne/').update({
            ties:ties
        })
    } else {
        database.ref('connections/playerTwo/').update({
            ties:ties
        })
    }
}






// $('#p2Rock').on('click', function() {
//     var player2Score;

    // return database.ref('game/').once('value').then (function (snapshot) {
    //     player2Score = 
    // })

//     database.ref('game/').update({

//     })
// })
