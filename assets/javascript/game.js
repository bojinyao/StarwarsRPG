class Master {

    constructor(name, id, hp, damage, isEnemy=false) {
        this.name = name;
        this.id = id;
        this.hp = hp;
        this.damage = damage;
        this.isEnemy = isEnemy;
    }

    decreaseHP(num) {
        this.hp -= num;
    }

    makeEnemy() {
        this.isEnemy = true;
    }

    attack(Opponent) {
        if (Opponent.hp > this.damage) {
            Opponent.decreaseHP(this.damage);
        } else {
            Opponent.hp = 0;
        }
        if (!this.isEnemy) {
            this.damage += this.damage;
        }
    }

    presentMaster(sectionSelector) {
        let cardDiv = $("<div>");
        cardDiv.addClass("card " + this.id);
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

var charSection = $(".characters-section");
var myCharSection = $(".my-character-section");
var enemyCharSection = $(".enemy-characters-section");
var defenderSection = $(".defender-section");



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
        "ObiWan" : ObiWan,
        "Luke" : Luke,
        "Sidious" : Sidious,
        "Maul" : Maul,
    }
    MASTERS = [ObiWan, Luke, Sidious, Maul];
    stageMasters(charSection, MASTERS);
    let tempList = [myCharSection, enemyCharSection, defenderSection];
    for (let i = 0; i < tempList.length; i++) {
        unstageMasters(tempList[i], MASTERS);
    }
}

initialize();

$(".card").click(function() {
    let clickedObj = $(this);
    let masterID = clickedObj.attr("value");
    if (myChar == null) {
        myChar = MasterVars[masterID];
        console.log("My Character Object: " + myChar);
        stageMasters(myCharSection, [myChar]);
        unstageMasters(charSection, [myChar]);
    } else if (defenderChar == null) {
        defenderChar = MasterVars[masterID];
        console.log("Defender Character Object: " + defenderChar);
        stageMasters(defenderSection, [defenderChar]);
        unstageMasters(charSection, [defenderChar]);

        for (let i = 0; i < MASTERS.length; i++) {
            if (MASTERS[i] !== myChar && MASTERS[i] !== defenderChar) {
                unstageFromAll([MASTERS[i]]);
                stageMasters(enemyCharSection, [MASTERS[i]])
            }
        }
    } else {
        return;
    }
});


$(".attack-button").click(function() {
    if (!gameOver && myChar != null && defenderChar != null) {
        myChar.attack(defenderChar);
        defenderChar.attack(myChar);
        myChar.updateHPDisplay();
        defenderChar.updateHPDisplay();
    }
});
// stageMasters(charSection, [Luke, Sidious, Maul]);
// stageMasters(myCharSection, [Maul]);
// unstageMasters(charSection, [Maul]);
// Maul.makeEnemy();
// console.log(Maul.isEnemy);
// Maul.attack(Luke);
// Luke.updateHPDisplay();
// ObiWan.presentMaster(charSection);
// Luke.presentMaster(charSection);
// Sidious.presentMaster(charSection);
// Maul.presentMaster(charSection);
// ObiWan.removeMaster();