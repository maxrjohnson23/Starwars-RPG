// Register event handlers
// $(document).ready(function() {
//     console.log("Starting game");
//     // game.startGame();
//     var game = new Game();
//     game.start();

// });

function Character(name, healthPoints, attackPower, counterAttackPower, selected) {
    this.name = name;
    this.healthPoints = healthPoints;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
    this.selected = false;
    // Characters start with 0 AP and increase with each attack
    var baseAttackPower = 0;

    function attack() {

    }

    function test() { }
}


// Initialize Characters
var obiwan = new Character("Obi-wan Kenobi", 120, 6, 10);
var lukeSkywalker = new Character("Luke Skywalker", 100, 6, 10);
var darthSidious = new Character("Darth Sidious", 150, 6, 10);
var darthMaul = new Character("Darth Maul", 180, 6, 10);

var Game = function () {
    this.characters = [obiwan, lukeSkywalker, darthSidious, darthMaul];
    var currentState = new Start(this);

    this.change = function (state) {
        currentState = state;
        currentState.go();
    };

    this.start = function () {
        currentState.go();
    };


};



var screenHandler = {
    resetGame: function () {
        console.log("resetting game");
        this.populatePlayerHealth();
    },
    setInstructions: function (instr) {
        $(".instructions").text(instr);
    },
    enablePlayerSelection: function (game) {
        $(".character").on("click", function (event) {
            // Move to attacker slot
            $(this).appendTo('.attacker');
            game.transition();
        });
    },
    enableOpponentSelection: function (game) {
        // All non-selected characters
        $(".character:not(.attacker .character)").on("click", function () {
            $(this).appendTo(".defender");
            game.transition();            
        });
    },
    populatePlayerHealth: function () {
        $(".hp").each(function (index) {
            $(this).text(game.characters[index].healthPoints);
            console.log(`Setting ${game.characters[index].name}`);
        });
    },
    disableCharacterSelect: function() {
        $(".character").off("click");        
    },
    displayAttackBtn: function() {
        $("#attack-btn").removeAttr("disabled");
    }
};

// Keep track of game states
var Start = function (game) {
    this.game = game;

    this.go = function () {
        screenHandler.setInstructions("Press <Space> to Begin");
        var state = this;
        $(window).on("keyup", function (event) {
            if(event.key === " ") {
                screenHandler.populatePlayerHealth();
                state.transition();
            }
        });
    }

    this.transition = function () {
        console.log("Starting the Game");
        game.change(new PlayerSelect(game));
    }

}

var PlayerSelect = function (game) {
    this.game = game;

    this.go = function () {
        screenHandler.setInstructions("Choose Your Character");
        screenHandler.enablePlayerSelection(this);
    }

    this.transition = function () {
        console.log("Transition from player select to opponent select");
        // Disable attacker selection
        screenHandler.disableCharacterSelect();
        // Move to Opponent selection state
        game.change(new OpponentSelect(game));
    }

}

var OpponentSelect = function (game) {
    this.game = game;

    this.go = function () {
        screenHandler.setInstructions("Choose Your Opponent");
        screenHandler.enableOpponentSelection(this);
    }
    this.transition = function () {
        // Disable opponent select
        screenHandler.disableCharacterSelect();
        console.log("Transition from opponent select to battle");
        game.change(new Battle(game));
    }
}

var Battle = function () {
    this.game = game;
    
        this.go = function () {
            screenHandler.setInstructions("FIGHT!!");
            screenHandler.displayAttackBtn();            
        }
        this.transition = function () {
       
            console.log("Transition from opponent select to battle");
            //game.change(new OpponentSelect(game));
        }
}

var Win = function () {

}

var Loss = function () {

}

var game;
$(document).ready(function () {
    console.log("Starting game");
    // game.startGame();
    game = new Game();
    game.start();

});