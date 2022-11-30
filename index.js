class Creature {
    additions = [];
    constructor(name, heroClass, money, stamina, intellect, strength) {
        this.name = name;
        this.heroClass = heroClass;
        this.money = money;
        this.stamina = stamina;
        this.intellect = intellect;
        this.strength = strength;
    }

    attack() {
        return Math.round((this.intellect + this.strength) / 3);
    }

    moneyAdd(moneyTaken) {
        this.money += moneyTaken;
    }

    addAddition(addition) {
        this.additions.push(addition);
        this.stamina += addition.stamina;
        this.intellect += addition.intellect;
        this.strength += addition.strength;
    }

    removeAddition(addition) {
        const index = this.additions.indexOf(addition);
        if (index > -1) {
            this.additions.splice(index, 1);
        }
        this.stamina -= addition.stamina;
        this.intellect -= addition.intellect;
        this.strength -= addition.strength;
    }

}

const heroClasses = {
    warlock: new Creature("Merliness the Warlock", "warlock", 800, 90, 100, 20),
    hunter: new Creature("Redneck the Hunter", "hunter", 900, 100, 50, 50),
    warrior: new Creature("Severity the Warrior", "warrior", 800, 150, 5, 100),
    rogue: new Creature("Tiffany the Rogue", "rogue", 1000, 100, 20, 90)
};

class Addition {
    constructor(name, string, cost, stamina, intellect, strength) {
        this.name = name;
        this.string = string;
        this.cost = cost;
        this.stamina = stamina;
        this.intellect = intellect;
        this.strength = strength;
    }
}

const additions = {
    medkit: new Addition("Med-Kit", "medkit", 150, 50, 0, 0),
    blizzardPot: new Addition("Blizzard Potion", "blizzardPot", 200, 0, 0, 50),
    essentialOil: new Addition("Essential Oil", "essentialOil", 300, 0, 50, 0),
    pet: new Addition("Rawr the Pet", "pet", 600, 40, 0, 50)
}

let hero = null;

function makeCard(value, inFight, cards) {
    const moneyPerc = calcPercentage(value.money, 1000);
    const staminaPerc = calcPercentage(value.stamina, 150);
    const intellectPerc = calcPercentage(value.intellect, 100);
    const strengthPerc = calcPercentage(value.strength, 100);
    costPerc = calcPercentage(value.cost, 600);
    return ` 
    <div class="col">
        <div class="card h-100 ${cards ? `${value.string}` : inFight ? "fightCards" : ""}" ${inFight ? "" : cards ? `onclick=pickedAddition('${value.string}')` : `onclick=pickedClass('${value.heroClass}')`}>
            <img src="img/${cards ? `${value.name}` : `${value.heroClass}`}.jpg" class="card-img-top" alt=${value.name}>
            <div class="card-body">
                <h5 class="card-title"> ${value.name} </h5>
                <div class="card-text">
                    ${inFight || value.cost===0 ? "" : `<div class="progress">
                    <div class="progress-bar gold" role="progressbar" style="width: ${cards ? `${costPerc}` : `${moneyPerc}`}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${cards ? `${value.cost}` : `${value.money}`}  gold</div>
                    </div>`}
                    ${inFight || value.stamina===0 ? "" : `<div class="progress">
                    <div class="progress-bar stamina" role="progressbar" style="width: ${cards ? `100` : `${staminaPerc}`}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${value.stamina} stamina</div>
                    </div>` }
                    ${inFight || value.intellect===0 ? "" : `<div class="progress">
                    <div class="progress-bar intellect" role="progressbar" style="width: ${cards ? `100` : `${intellectPerc}`}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${value.intellect} intellect</div>
                    </div>`}
                    ${inFight || value.strength===0 ? "" : `<div class="progress">
                    <div class="progress-bar strength" role="progressbar" style="width: ${cards ? `100` : `${strengthPerc}`}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${value.strength} strength</div>
                    </div>`}
                </div>                
            </div>
        </div>
    </div>
    `
}

function checkIfPickedAdditionExists(pickedAddition) {
    for (var i = 0; i < hero.additions.length; i++) {
        let element = hero.additions[i];
        if (pickedAddition === element) {
            return true;
        }
    }
    return false;
}

function pickedClass(heroClass) {
    hero = heroClasses[heroClass];
    document.querySelector(".section1").style.display = "none";
    document.querySelector("h1").style.display = "none";
    document.querySelector(".section2").style.display = "block";
    document.querySelector(".additionSelection").style.display = "block";
    document.querySelector("h2").textContent = `${hero.money} gold`;
    makeSecondStep("section2");
}

function pickedAddition(pickedAdditionString) {
    const pickedAddition = additions[pickedAdditionString];
    const doesItExist = checkIfPickedAdditionExists(pickedAddition);
    if (doesItExist) {
        hero.removeAddition(pickedAddition);
        hero.money += pickedAddition.cost;
        document.querySelector(`.${pickedAdditionString}`).classList.remove("bought");
    } else if (pickedAddition.cost <= hero.money) {
        hero.money -= pickedAddition.cost;
        document.querySelector(`.${pickedAdditionString}`).classList.add("bought");
        hero.addAddition(pickedAddition);
    }

    document.querySelector("h2").textContent = `${hero.money} gold`;
}

function timeToFight() {
    document.querySelector(".section2").style.display = "none";
    document.querySelector(".section3").style.display = "flex";
    document.querySelector("header").innerHTML = "<h1>JavaScript of Warcraft</h1>"
}

const enemy1 = new Creature("Gulp","gulp", 60, 80, 90, 10);
const enemy2 = new Creature("Dorgi","dorgi", 80, 100, 30, 60);
const enemy3 = new Creature("Jinous","jinous" , 100, 100, 20, 70);

function fightSpecifics(enemy) {
    debugger;
    let lost = false;
    let textSection3  = `
        <div class="row row-cols-1 row-cols-lg-3">
        ${makeCard(hero, true, false)} 
    `;
    while (hero.stamina > 0 && enemy.stamina > 0) {
        enemy.stamina -= hero.attack();
        hero.stamina -= enemy.attack();
        hero.moneyAdd(enemy.money);

        if (hero.stamina <= 0) {
            textSection3 += `<div class="col"><h1>VS</h1><h2 class="result">You lost!</h2>`;
            lost = true;
        } else if (enemy.stamina <= 0) {
            textSection3 += `<div class="col"><h1>VS</h1><h2 class="result">You won!</h2>`;
        }
    }
    if(enemy === enemy1) {
        textSection3 += `
        <button onclick="fight(2)" class="myButton fight">Another fight!</button>
        `;
    } else if(!lost && enemy === enemy2){
        textSection3 += `
        <button onclick="fight(3)" class="myButton fight">Another fight!</button>
        `;
    } else if(lost || enemy === enemy3) {
        if(!lost) {
            document.querySelector(".result").textContent = "Congratz, you defeated all the enemies!";
        }
        textSection3 += `
        <button onclick="location.reload()" class="myButton fight">Play again!</button>
        `;
    }
    textSection3 += `
        </div>
        ${makeCard(enemy, true, false)}
        </div>`;
    return textSection3;
}

function fight(numberOfEnemy) {
    debugger;
    const section3 = document.querySelector(".section3");
    let textSection3;
    if(numberOfEnemy === 1) {
        textSection3 = fightSpecifics(enemy1);
    } else if(numberOfEnemy === 2) {
        textSection3 = fightSpecifics(enemy2);
    } else if(numberOfEnemy === 3) {
        textSection3 = fightSpecifics(enemy3);
    }
    
    section3.innerHTML = textSection3;
}

function calcPercentage(value, max) {
    return Math.round((value / max) * 100)
}

function makeFirstStep() {
    document.querySelector(".section1").innerHTML = `<div class="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4">
    ${Object.values(heroClasses).map((heroClass) => {
        return makeCard(heroClass);
    }).join("")}
    </div>
    ` 
}

function makeSecondStep(section) {
    document.querySelector(`.${section}`).innerHTML = `<div class="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4">
    ${Object.values(additions).map((addition) => {
        return makeCard(addition, false, true);
    }).join("")}
    </div>
    ` 
}

makeFirstStep();