class Master {

    constructor(name, id, hp, baseDamage, isFriendly=false) {
        this.name = name;
        this.id = id;
        this.hp = hp;
        this.baseDamage = baseDamage;
        this.damage = baseDamage;
        this.isFriendly = isFriendly;
        this.selectable = true;
    }

    toString() {
        let result = "";
        result += `name: ${this.name} hp: ${this.hp} `;
        result += `damage: ${this.damage} isFriendly: ${this.isFriendly} `;
        result += `selectable: ${this.selectable}`;
        return result;
    }

    isAlive() {
        return this.hp > 0;
    }

    decreaseHP(num) {
        this.hp -= num;
    }

    makeEnemy() {
        this.isFriendly = true;
    }

    attack(Opponent) {
        if (Opponent.hp > this.damage) {
            Opponent.decreaseHP(this.damage);
        } else {
            Opponent.hp = 0;
        }
        if (this.isFriendly) {
            this.damage += this.baseDamage;
        }
    }

    presentMaster(sectionSelector) {
        let cardDiv = $("<div>");
        cardDiv.addClass(`card ${this.id} border-light`);
        if (sectionSelector.attr("class").includes("all-characters-section")) {
            cardDiv.addClass("bg-dark");
        } else if (this.isFriendly) {
            cardDiv.addClass("bg-success");
        } else {
            cardDiv.addClass("bg-danger");
        }
        cardDiv.attr("style", "width: 8rem; height: 7rem;");
        cardDiv.attr("value", this.id);
        let image = $("<img>");
        image.addClass("card-img-top");
        image.attr("src", MasterPics[this.id]);
        cardDiv.append(image);
        let cardBody = $("<div>");
        cardBody.addClass("card-body text-center p-0");

        let nameTitle = $("<h6>");
        nameTitle.addClass("card-title m-0");
        nameTitle.text(this.name);

        let health = $("<p>");
        health.addClass("card-text");
        health.text(this.hp);

        cardBody.append(nameTitle);
        cardBody.append(health);

        cardDiv.append(cardBody);
        sectionSelector.append(cardDiv);
    }

    removeMaster(selector) {
        selector.find(`.${this.id}`).remove();
    }

    removeMasterFromAll() {
        $(`.${this.id}`).remove();
    }

    updateHPDisplay() {
        $(`.${this.id} .card-body .card-text`).text(this.hp);
    }
}

/**
 * Show masters inside specific classSelector.
 * @param {jQuery} classSelector 
 * @param {Master[]} masters 
 */
function stageMasters(classSelector, masters) {
    for (let i = 0; i < masters.length; i++) {
        masters[i].presentMaster(classSelector);
    }
}

/**
 * Remove masters inside specific classSelector.
 * @param {jQuery} classSelector 
 * @param {Master[]} masters 
 */
function unstageMasters(classSelector, masters) {
    for (let i = 0; i < masters.length; i++) {
        masters[i].removeMaster(classSelector);
    }
}

/**
 * Remove masters from the display entirely.
 * @param {Master[]} masters 
 */
function unstageFromAll(masters) {
    for (let i = 0; i < masters.length; i++) {
        masters[i].removeMasterFromAll();
    }
}

const SOURCE = "assets/images/"
var gameOver = false;
var ObiWan = null;
var Luke = null;
var Sidious = null;
var Maul = null;
var MasterVars = null;
var MASTERS = null;

var myChar = null;
var defenderChar = null;

var MasterPics = {
    "ObiWan" : SOURCE + "ObiWan.jpg",
    "Luke" : SOURCE + "Luke.jpg",
    "Sidious" : SOURCE + "Sidious.jpg",
    "Maul" : SOURCE + "Maul.jpeg",
};

$(document).ready(function () {
    var charSection = $(".all-characters-section");
    var myCharSection = $(".my-character-section");
    var enemyCharSection = $(".enemy-characters-section");
    var defenderSection = $(".defender-section");
    var line1 = $(".line-1");
    var line2 = $(".line-2");



    /** Game Set up at the beginning. */
    function initialize() {
        gameOver = false;
        myChar = null;
        defenderChar = null;
        ObiWan = new Master("Obi-Wan Kenobi", "ObiWan", 120, 6);
        Luke = new Master("Luke Skywalker", "Luke", 100, 8);
        Sidious = new Master("Darth Sidious", "Sidious", 150, 4);
        Maul = new Master("Darth Maul", "Maul", 100, 8);
        MasterVars = {
            "ObiWan": ObiWan,
            "Luke": Luke,
            "Sidious": Sidious,
            "Maul": Maul,
        }
        MASTERS = [ObiWan, Luke, Sidious, Maul];
        stageMasters(charSection, MASTERS);
        let tempList = [myCharSection, enemyCharSection, defenderSection];
        for (let i = 0; i < tempList.length; i++) {
            unstageMasters(tempList[i], MASTERS);
        }
    }

    /** Initialized the Game */
    initialize();

    $(document).on("click", ".card", function () {
        
        let clickedObj = $(this);
        let masterID = clickedObj.attr("value");
        if (!MasterVars[masterID].selectable) {
            return;
        }
        if (myChar == null) {
            myChar = MasterVars[masterID];
            myChar.selectable = false;
            myChar.isFriendly = true;
            console.log("My Character Object: " + myChar.toString());
            unstageFromAll([myChar]);
            stageMasters(myCharSection, [myChar]);
        } else if (defenderChar == null) {
            defenderChar = MasterVars[masterID];
            defenderChar.selectable = false;
            console.log("Defender Character Object: " + defenderChar.toString());
            unstageFromAll([defenderChar]);
            stageMasters(defenderSection, [defenderChar]);

            for (let i = 0; i < MASTERS.length; i++) {
                if (MASTERS[i] !== myChar && MASTERS[i] !== defenderChar && MASTERS[i].isAlive()) {
                    unstageFromAll([MASTERS[i]]);
                    stageMasters(enemyCharSection, [MASTERS[i]])
                }
            }
        } else {
            return;
        }
    });


    $(".attack-button").click(function () {

        if (!gameOver && myChar != null && defenderChar != null) {
            line1.text(`You attacked ${defenderChar.name} for ${myChar.damage} damages.`);
            line2.text(`${defenderChar.name} attacked you for ${defenderChar.damage} damages.`);

            myChar.attack(defenderChar);
            defenderChar.attack(myChar);
            myChar.updateHPDisplay();
            defenderChar.updateHPDisplay();
            if (!defenderChar.isAlive()) {
                unstageFromAll([defenderChar]);
                if (enemyCharSection.children().length > 0) {
                    line1.text(`You have defeated ${defenderChar.name}!`);
                    line2.text("You can choose a fight another enemy.");
                    defenderChar = null;
                } else {
                    gameOver = true;
                    line1.text("You won!!! Game Over.");
                    line2.empty();
                }
            } else if (!myChar.isAlive()) {
                gameOver = true;
                line1.text("You've been defeated... GAME OVER!");
                line2.empty();
            } else {
                return;
            }
        }
    });

    $(".restart-button").on("click", function() {
        line1.empty();
        line2.empty();
        unstageFromAll(MASTERS);
        initialize();
    })
})
