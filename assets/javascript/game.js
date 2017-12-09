
function Character(id, name, healthPoints, attackPower, counterAttackPower) {
    this.id = id;
    this.name = name;
    this.healthPoints = healthPoints;
    // Characters start with 0 AP and increase with each attack
    this.attackPower = attackPower;
    this.attackMultiplier = attackPower;
    this.counterAttackPower = counterAttackPower;
    this.selected = false;

}



var Game = function () {
    // Begin game in Start state
    var currentState = new Start(this);
    // Initialize Characters
    var obiwan = new Character("obiwan", "Obi-wan Kenobi", 120, 6, 10);
    var lukeSkywalker = new Character("lukeSkywalker", "Luke Skywalker", 100, 6, 10);
    var darthSidious = new Character("darthSidious", "Darth Sidious", 150, 6, 10);
    var darthMaul = new Character("darthMaul", "Darth Maul", 180, 6, 10);
    this.characters = [obiwan, lukeSkywalker, darthSidious, darthMaul];
    this.attacker = "";
    this.defender = "";

    this.findCharacter = function(charId) {
        return this.characters.find(a => a.id === charId);
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
    
            // Set attacker to game object
            game.attacker = game.findCharacter($(this).attr("data-char")); 
            console.log(`Character chosen: ${game.attacker.name}`);
            state.transition();
        });
    },
    enableOpponentSelection: function (state) {
        // All non-selected characters
        $(".character:not(.attacker .character)").on("click", function () {
            $(this).appendTo(".defender");
            game.defender = game.findCharacter($(this).attr("data-char"));             
            console.log(`Opponent chosen: ${game.defender.name}`);
            state.transition();
        });
    },
    populateCharacterHealth: function () {
        $(".character").each(function (index) {
            var targetChar = game.findCharacter($(this).attr("data-char"));
            $(this).find(".hp").text(targetChar.healthPoints);
        });
    },
    populateCharacterStats: function () {
        $(".character").each(function (index) {
            $(this).find(".name").text(game.characters[index].name);
            $(this).find(".hp").text(game.characters[index].healthPoints);
            $(this).attr("data-char", game.characters[index].id);

        });
    },
    disableCharacterSelect: function () {
        $(".character").off("click");
    },
    displayAttackBtn: function (state) {
        var attackButton = $("#attack-btn");
        attackButton.removeAttr("disabled");
        attackButton.on("click", function () {
            state.attack();
        });
    },
    removeCharacter: function (index) {
        // Remove defeated character
        $(`div[data-char='${index}']`).remove();
    }
};

// Keep track of game states
var Start = function (game) {
    this.game = game;

    this.go = function () {
        screenHandler.setInstructions("Press <Space> to Begin");
        var state = this;
        $(window).on("keydown", function (event) {
            if (event.key === " ") {
                // disable default browser scroll action
                event.preventDefault();
                screenHandler.populateCharacterStats();
                // screenHandler.populateCharacterHealth();
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
        screenHandler.displayAttackBtn(this);
    }

    this.attack = function () {
        console.log(`Battle between: ${game.attacker.name} and ${game.defender.name}`);
        game.defender.healthPoints -= game.attacker.attackPower;
        game.attacker.healthPoints -= game.defender.attackPower;
        game.attacker.attackPower += game.attacker.attackMultiplier;
        console.log(`Attacker AP: ${game.attacker.attackPower}`);
        console.log(`Defender HP: ${game.defender.healthPoints}`);
        screenHandler.populateCharacterHealth();
        if (game.defender.healthPoints <= 0 || game.attacker.healthPoints <= 0) {
            this.transition();
        }
    }

    this.removeCharacter = function (char) {
        for (var i = 0; i < game.characters.length; i++) {
            if (game.characters[i].name === char.name) {
                game.characters.splice(i, 1);
                screenHandler.removeCharacter(i);
                break;
            }
        }
    }

    this.transition = function () {
        // Player loses
        if (game.attacker.healthPoints <= 0) {
            game.change(new Loss(game));
        } else if (game.defender.healthPoints <= 0) {
            this.removeCharacter(game.defender);
            // Opponents still remaining
            if (game.characters.length > 1) {
                console.log("Transition from opponent select to battle");
                game.change(new OpponentSelect(game));
            } else {
                // All opponents defeated.  You win
                game.change(new Win(game));
            }
        }
    }

}

var Win = function () {
    this.game = game;

    this.go = function () {
        screenHandler.setInstructions("You Win!!!");

    }

}

var Loss = function () {

}

var game;
$(document).ready(function () {
    game = new Game();
    game.start();

});