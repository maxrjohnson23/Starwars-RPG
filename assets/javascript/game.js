// Register event handlers
// $(document).ready(function() {
//     console.log("Starting game");
//     // game.startGame();
//     var game = new Game();
//     game.start();

// });

function Character(name, healthPoints, attackPower, counterAttackPower) {
    this.name = name;
    this.healthPoints = healthPoints;
    this.attackPower = attackPower;
    this.attackMultiplier = attackPower;
    this.counterAttackPower = counterAttackPower;
    this.selected = false;
    // Characters start with 0 AP and increase with each attack

}


// Initialize Characters

var Game = function () {
    var currentState = new Start(this);
    var obiwan = new Character("Obi-wan Kenobi", 120, 6, 10);
    var lukeSkywalker = new Character("Luke Skywalker", 100, 6, 10);
    var darthSidious = new Character("Darth Sidious", 150, 6, 10);
    var darthMaul = new Character("Darth Maul", 180, 6, 10);
    this.characters = [obiwan, lukeSkywalker, darthSidious, darthMaul];
    this.attacker = "";
    this.defender = "";

    this.startBattle = function() {
        // this.attacker = game[this.attacker];
        // this.defender = game[this.defender];
        console.log(`Battle between: ${this.attacker.name} and ${this.defender.name}`);
        

    }
    this.attack = function() {
        this.defender.healthPoints -= this.attacker.attackPower;
        this.attacker.attackPower += this.attacker.attackMultiplier;
        console.log(`AP: ${this.attacker.attackPower}`);
        console.log(`Defender HP: ${this.defender.healthPoints}`);
    }

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
    enablePlayerSelection: function (state) {
        $(".character").on("click", function (event) {
            // Move to attacker slot
            $(this).appendTo('.attacker');
            var int = parseInt(($(this).attr("data-char")))
            console.log(int);
            game.attacker = game.characters[int];
            console.log(`Character chosen: ${game.attacker.name}`);            
            state.transition();
        });
    },
    enableOpponentSelection: function (state) {
        // All non-selected characters
        $(".character:not(.attacker .character)").on("click", function () {
            $(this).appendTo(".defender");
            game.defender = game.characters[$(this).attr("data-char")];
            console.log(`Opponent chosen: ${game.defender.name}`);
            state.transition();            
        });
    },
    populateCharacterStats: function () {
        $(".hp").each(function (index) {
            $(this).text(game.characters[index].healthPoints);
        });

    },
    disableCharacterSelect: function() {
        $(".character").off("click");        
    },
    displayAttackBtn: function() {
        var attackButton = $("#attack-btn");
        attackButton.removeAttr("disabled");
        attackButton.on("click", game.attack);
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
                screenHandler.populateCharacterStats();
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
        // Move to battle state
        game.change(new Battle(game));
    }
}

var Battle = function () {
    this.game = game;
    
        this.go = function () {
            screenHandler.setInstructions("FIGHT!!!");
            screenHandler.displayAttackBtn();
            game.startBattle();            
        }
        this.transition = function () {
       
            console.log("Transition from opponent select to battle");
            //game.change(new OpponentSelect(game));
            // if complete end, otherwise continue battle
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