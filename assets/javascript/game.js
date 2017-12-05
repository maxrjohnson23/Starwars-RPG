// Register event handlers
$(document).ready(function() {
    console.log("Starting game");
    game.startGame();

});

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

    function test() {}
}


// Initialize Characters
var obiwan = new Character("Obi-wan Kenobi", 120, 6, 10);
var lukeSkywalker = new Character("Luke Skywalker", 100, 6, 10);
var darthSidious = new Character("Darth Sidious", 150, 6, 10);
var darthMaul = new Character("Darth Maul", 180, 6, 10);

var game = {
    characters: [obiwan, lukeSkywalker, darthSidious, darthMaul],
    startGame: function() {
        screenHandler.resetGame();
        screenHandler.enablePlayerSelection();
    }

};

var screenHandler = {
    resetGame: function() {
        console.log("resetting game");
        this.populatePlayerHealth();
    },
    setInstructions: function(instr) {
        $(".instructions").text(instr);
    },
    enablePlayerSelection: function() {
    	var that = this;
        $(".character").on("click", function(event) {
            $(this).appendTo('.attacker');
            // Once selected, remove click on other characters
            $(".character").off("click");
            that.enableOpponentSelection();
        });
    },
    enableOpponentSelection: function() {
        this.setInstructions("Choose your opponent");
        // All non-selected characters
        $(".character:not(.attacker .character)").on("click", function() {
            $(this).appendTo(".defender");
            $(".character").off("click");
        });
    },
    populatePlayerHealth: function() {
        $(".hp").each(function(index) {
            $(this).text(game.characters[index].healthPoints);
            console.log(`Setting ${game.characters[index].name}`);
        });
    }
};