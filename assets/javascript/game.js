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
        Opponent.decreaseHP(this.damage);
        if (!this.isEnemy) {
            this.damage += this.damage;
        }
    }

    presentMaster(sectionSelector) {
        let cardDiv = $("<div>");
        cardDiv.addClass("card " + this.id);
        cardDiv.attr("style", "width: 8rem; height: 7rem;");
        let image = $("<img>");
        image.addClass("card-img-top");
        image.attr("src", MasterList[this.id]);
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

const source = "assets/images/"
var ObiWan = new Master("Obi-Wan Kenobi", "ObiWan", 120, 6);
var Luke = new Master("Luke Skywalker", "Luke", 100, 8);
var Sidious = new Master("Darth Sidious", "Sidious", 150, 4);
var Maul = new Master("Darth Maul", "Maul", 100, 8);

var MasterList = {
    "ObiWan" : source + "ObiWan.jpg",
    "Luke" : source + "Luke.jpg",
    "Sidious" : source + "Sidious.jpg",
    "Maul" : source + "Maul.jpeg"
};

var charSection = $(".characters-section");
var myCharSection = $(".my-character-section");
var enemyCharSection = $(".enemy-characters-section");
var defenderSection = $(".defender-section");


stageMasters(charSection, [Luke, Sidious, Maul]);
stageMasters(myCharSection, [Maul]);
unstageMasters(charSection, [Maul]);
Maul.makeEnemy();
console.log(Maul.isEnemy);
Maul.attack(Luke);
Luke.updateHPDisplay();
// ObiWan.presentMaster(charSection);
// Luke.presentMaster(charSection);
// Sidious.presentMaster(charSection);
// Maul.presentMaster(charSection);
// ObiWan.removeMaster();