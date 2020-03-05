
// global variables
let enemyID = 0;
var enemies = [];
let enemiesLeft = 1;
let totalRounds = 0;
let roundCounter = 0;
let currentBossHP = 20;
let currentEnemySmallDamage = 1;
let chanceToFire = 10;
let bulletIndex = 0;

let bossBulletIndex = 0;
let bossShotCounter = 0;
var bossShotMultiple = 1;

let primaryIndex = 0;
let primaryExplodeIndex = 0;
let primaryOn = false;

let secondaryIndex = 0;
let secondaryExplodeIndex = 0;
let secondaryRockets = 6;
let secondaryHitIndex = 0;

var primaryRepeat;
let gameOn = true;
let enemyHealth = 1;
let maximumHP = 20;
let healthScaling = 0;

var sensor1;
var sensor2;
var sensor3;

let moveVel = 10;
var moveLeft;
var moveRight;
var moveUp;
var moveDown;

let upCount = 0;
let downCount = 0;
let leftCount = 0;
let rightCount = 0;
// Objects
var playerShip = {
    health: maximumHP,
    experience: 0,
    powerups: {

    },
    primary: true,
    secondary: true,
    tertiary: true,
    ultimate: true,
    primaryDamage: 1,
    secondaryDamage: 0.1,
    tertiaryDamage: 16,
    ultimateDamage: 10,
    score: 0,
    scoreMultiplier: 0


}

var boss = {
    health: 20,
    spawned: false,
}






// functions

// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                                             Game Control functions
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function endGame() {
    let playerShip = document.getElementsByClassName("playerShip")[0];
    let enemyShips = $(".enemyShip");
    let boss = document.getElementsByClassName("boss")[0];
    let bossHP = $(".bossHP");
    let playerHP = $(".playerHP");

    for (let i = 0; i < enemyShips.length; i++) {
        if (enemyShips[i] != undefined) {
            enemyShips[i].remove();
        }
    }
    if (playerShip != undefined) {
        playerShip.remove();
    }
    if (boss != undefined) {
        boss.remove();
    }
    if(bossHP != undefined){
        bossHP.remove();
    }
    if(playerHP != undefined){
        playerHP.remove();
    }
    
    clearInterval(sensor1);
    clearInterval(sensor2);
    clearInterval(sensor3);
    clearInterval(moveLeft);
    clearInterval(moveRight);
    clearInterval(moveUp);
    clearInterval(moveDown);
    clearInterval(primaryRepeat);

    toggleGUI();
    toggleDeathScreen();

    gameOn = false;
    resetStats();
}

function resetStats() {
    // global variables
    enemyID = 0;
    enemies = [];
    totalRounds = 0;
    enemiesLeft = 1;
    roundCounter = 0;
    currentBossHP = 20;
    enemyHealth = 1;
    currentEnemySmallDamage = 1;
    chanceToFire = 10;
    bulletIndex = 0;
    bossBulletIndex = 0;
    primaryIndex = 0;

    maximumHP = 20;
    enemyHealth = 1;
    maximumHP = 20;
    healthScaling = 0;

    bossShotCounter = 0;
    bossShotMultiple = 1;

    // Objects
    playerShip = {
        health: 20,
        experience: 0,
        powerups: {

        },
        primary: true,
        secondary: true,
        tertiary: true,
        ultimate: true,
        primaryDamage: 1,
        secondaryDamage: 0.1,
        tertiaryDamage: 16,
        ultimateDamage: 10,
        score: 0,
        scoreMultiplier: 0


    }

    boss = {
        health: 20,
        spawned: false,
    }
}
function startGame() {
    gameOn = true;
    displayPlayer();
    toggleGUI();

    let numberOfEnemies = 1;
    displayEnemy(numberOfEnemies);


    sensor1 = setInterval(function () {
        if (gameOn == true) {
            deleteEmpty();

            checkEnemyHit();
            checkPlayerHit();
            updateGUI();
            checkBounds();


        }




    }, 45);


    sensor2 = setInterval(function () {
        if (gameOn == true) {
            enemyShots();
        }



    }, 2000);

    sensor3 = setInterval(function () {
        if (enemiesLeft == 0) {





            if (roundCounter == 2) {
                totalRounds++;
                enemiesLeft = numberOfEnemies;
                currentEnemySmallDamage += 0.2;
                // console.log(roundCounter);

                roundCounter++;
                displayEnemy(numberOfEnemies);
                displayBoss();
                // displayEnemy(numberOfEnemies);
                boss.spawned = true;
                console.log(boss.health);


                playerShip.secondaryDamage *= 1.3;
                maximumHP += 1;
                console.log(maximumHP);



                if (totalRounds >= 70) {
                    healthScaling++;
                }


            }
            else {
                if (boss.spawned == false && roundCounter < 2) {
                    totalRounds++;
                    roundCounter++;

                    if (numberOfEnemies < 25) {
                        numberOfEnemies += 1;


                    }
                    if (totalRounds >= 70) {
                        healthScaling++;
                    }
                    enemiesLeft = numberOfEnemies;
                    displayEnemy(numberOfEnemies);
                }



            }

        }
    }, 1000);
}
function updateGUI() {
    if(gameOn == true){
    // update each of the stats in the gui with new data
        $(".healthBar p").text(playerShip.health);
        $(".round").text("Round: " + totalRounds);
        $(".score").text("Score: " + Math.floor(playerShip.score));
        $(".scoreMultiplier").text(Math.floor(playerShip.scoreMultiplier));

        $(".bossHP").css("width", (400*boss.health/currentBossHP) + "px" )
        
        let playerLocation = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
        $(".playerHP").css("top", (playerLocation.top + playerLocation.height + 10) + "px");
        $(".playerHP").css("left", (playerLocation.left) + "px");
        $(".playerHP").css("width", (playerLocation.width*playerShip.health/maximumHP) + "px");
    }
   

}
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                                             Ship weapons
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function firePrimary() {

    if (primaryOn == false) {
        primaryOn = true;

        primaryRepeat = setInterval(function () {
            //console.log("firing primary");
            var primary = document.createElement("div");

            primary.classList.add("primary");
            primary.classList.add("primary" + primaryIndex);

            let ship = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();

            primary.style.position = "absolute";

            primary.style.top = (ship.top) + "px";
            primary.style.left = (ship.left + 75 / 2) + "px";

            var gameArena = document.getElementsByClassName("playingField")[0];

            gameArena.appendChild(primary);

            $(".primary" + primaryIndex).animate({ top: "0px" }, { duration: 500, queue: false });
            primaryIndex++;

            setTimeout(function () { primary.remove(); }, 500);

        }, 100);
    }



    //fire primary




}
function stopPrimary() {
    clearInterval(primaryRepeat);
    primaryOn = false;
}
function fireSecondary() {
    if (playerShip.secondary == true) {
        //console.log("firing secondary");
        //fire secondary
        let playerShipBox = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
        let gameArena = document.getElementsByClassName("playingField")[0];
        let enemyShips = document.getElementsByClassName("enemyShip");
        let shipsArray = [];

        for (let i = 0; i < enemyShips.length; i++) {
            shipsArray[i] = enemyShips[i];
        }
        console.log(enemyShips);


        if (enemyShips.length > 0) {
            let lockOnData = [];
            //generate 6 homing missiles at center of ship
            let fireAmount = secondaryRockets;
            if(shipsArray.length < secondaryRockets){

                fireAmount = shipsArray.length;
                
            }

            for (let i = 0; i < fireAmount; i++) {

                let playerMissile = document.createElement("div");
                playerMissile.classList.add("playerMissile");
                playerMissile.classList.add("playermissile" + secondaryIndex);
                playerMissile.style.top = (playerShipBox.top + 20) + "px";
                playerMissile.style.left = (playerShipBox.left + playerShipBox.width / 2 - 10) + "px";

                gameArena.appendChild(playerMissile);

                var selectChance;


                let enemyShipCoords = [];
                var locked;
                do {
                    locked = false;
                    for (let j = 0; j < shipsArray.length; j++) {
                        let enemyShipBox = shipsArray[j].getBoundingClientRect();
                        selectChance = Math.floor(Math.random() * 4)

                        if (selectChance == 0) {
                            j = shipsArray.length;
                            enemyShipCoords[0] = enemyShipBox.top + enemyShipBox.height / 2;
                            enemyShipCoords[1] = enemyShipBox.left + enemyShipBox.width / 2;

                            if (enemyShips.length >= secondaryRockets) {
                                if (checkMissileUnique(enemyShipCoords, lockOnData) == true) {

                                    console.log("testing 1");
                                    console.log(enemyShipCoords);


                                    lockOnData.push(enemyShipCoords);
                                    locked = true;
                                    shipsArray.splice(j, 1);
                                    j--;
                                }
                                else {
                                    locked = false;
                                }

                            }
                            else {
                                lockOnData.push(enemyShipCoords);
                                locked = true;
                            }

                        }
                    }

                } while (locked == false);

                // animate missile to lockOnData[i][0] (x-pos) and lockOnData[i][1] (y-pos)


                $(".playermissile" + secondaryIndex).animate({


                    top: lockOnData[i][0] + "px",
                    left: lockOnData[i][1] + "px"

                }, { duration: 800, queue: false });
                setTimeout(function () {
                    let secondaryExplosion = document.createElement("div");
                    secondaryExplosion.classList.add("secondaryExplosion");
                    secondaryExplosion.classList.add("secondaryexplosion" + secondaryExplodeIndex);
                    secondaryExplosion.style.top = lockOnData[i][0] + "px";
                    secondaryExplosion.style.left = lockOnData[i][1] + "px";

                    gameArena.appendChild(secondaryExplosion);

                    $(".secondaryexplosion" + secondaryExplodeIndex).animate({
                        opacity: 0.01,
                    }, {
                        duration: 1000, queue: false, complete: function () {
                            secondaryExplosion.remove()
                        }
                    });

                    playerMissile.remove();
                }, 810);

                secondaryIndex++;
            }

            //each missile will have the same vertical velocity but different horizontal acceleration.


            //horizontal acceleration will range from -30px/s^2 -20px/s^2 -10px/s^2 10px/s^2 20px/s^2 30px/s^2, 

            //cease all acceleration after 2 seconds,

            // missiles will lock onto a target enemy ship,

            //missiles will continue until the enemy ship has been hit,

            //if enemy ship has been destroyed missiles will find a new target
            // if no enemy ships remain missile will detonate






            playerShip.secondary = false;

            setTimeout(function () { playerShip.secondary = true; }, 10000);
        }


    }
}
function checkMissileUnique(coords, allData) {

    for (let i = 0; i < allData.length; i++) {
        // console.log(allData[i][0]);
        // console.log(allData[i][1]);
        // console.log(coords);

        if (allData[i][0] == coords[0] && allData[i][1] == coords[1]) {
            // console.log("coords not unique");
            return false;


        }
    }
    // console.log("coords are unique");

    return true;

}
function fireTertiary() {
    if (playerShip.tertiary == true) {
        //console.log("firing tertiary");
        //fire tertiary
        playerShip.tertiary = false;

        setTimeout(function () { playerShip.tertiary = true; }, 25000);
    }
}
function fireUltimate() {
    if (playerShip.ultimate == true) {
        //console.log("firing ultimate");
        //fire ultimate
        playerShip.ultimate = false;

        setTimeout(function () { playerShip.ultimate = true; }, 60000);
    }
}


function primaryHit(bulletBox) {
    let gameArena = document.getElementsByClassName("playingField")[0];
    let bulletExplosion = document.createElement("div");
    bulletExplosion.classList.add("primaryExplode");
    bulletExplosion.classList.add("primaryexplode" + primaryExplodeIndex);

    bulletExplosion.style.top = bulletBox.top + "px";
    bulletExplosion.style.left = (bulletBox.left + 2) + "px";
    gameArena.appendChild(bulletExplosion);




    $(".primaryexplode" + primaryExplodeIndex).animate({
        opacity: 0.01,
    }, {
        duration: 1000, queue: false, complete: function () {
            bulletExplosion.remove()
        }
    });


    primaryExplodeIndex++;




}
function secondaryHit(shipBox) {
    let gameArena = document.getElementsByClassName("playingField")[0];
    let secondaryHit = document.createElement("div");

    secondaryHit.classList.add("secondaryHit");
    secondaryHit.classList.add("secondaryhit" + secondaryHitIndex);

    secondaryHit.style.top = Math.random() * (shipBox.height) + shipBox.top + "px";
    secondaryHit.style.left = Math.random() * (shipBox.width) + shipBox.left + "px";

    gameArena.appendChild(secondaryHit);
    $(".secondaryHit" + secondaryHitIndex).animate({
        opacity: 0.01,
    }, {
        duration: 1000, queue: false, complete: function () {
            secondaryHit.remove();

        }
    });
    setTimeout(function () {
        secondaryHit.remove();
    }, 1000);
    secondaryHitIndex++;

}

// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                                             Spawn, delete Elements
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function makeEnemies(numberOfEnemies) {
    for (let i = 0; i < numberOfEnemies; i++) {
        enemies.push(new Enemy());
    }
}
function deleteEmpty() {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].reference == "empty") {
            enemies.splice(i, 1);
        }
    }
}
function displayBoss() {
    let enemyBoss = document.createElement("img");
    enemyBoss.src = "images/boss.png";
    enemyBoss.classList.add("boss");
    enemyBoss.classList.add("enemyShip");

    let gameArena = document.getElementsByClassName("playingField")[0];
    gameArena.appendChild(enemyBoss);

    let enemyBossHP = document.createElement("div");
    enemyBossHP.classList.add("bossHP");
    gameArena.appendChild(enemyBossHP);
}

function displayEnemy(numberOfEnemies) {




    for (let i = 0; i < numberOfEnemies; i++) {



        let enemyShip = document.createElement("img");
        if (totalRounds < 10) {
            enemyShip.src = "images/enemyBlue.png"
        }
        else if (totalRounds < 20) {
            let chance = Math.floor(Math.random() * 2 + 1);
            if (chance < 2) {
                enemyShip.src = "images/enemyGreen.png"
            }
            else {
                enemyShip.src = "images/enemyBlue.png"
            }

        }
        else if (totalRounds < 30) {
            let chance = Math.floor(Math.random() * 2 + 1);
            if (chance < 2) {
                enemyShip.src = "images/enemyYellow.png"
            }
            else {
                enemyShip.src = "images/enemyGreen.png"
            }

        }
        else if (totalRounds < 40) {
            let chance = Math.floor(Math.random() * 2 + 1);
            if (chance < 2) {
                enemyShip.src = "images/enemyYellow.png"
            }
            else {
                enemyShip.src = "images/enemyRed.png"
            }

        }
        else if (totalRounds < 50) {
            let chance = Math.floor(Math.random() * 2 + 1);
            if (chance < 2) {
                enemyShip.src = "images/enemyPurple.png"
            }
            else {
                enemyShip.src = "images/enemyRed.png"
            }


        }
        else if (totalRounds < 60) {
            let chance = Math.floor(Math.random() * 2 + 1);
            if (chance < 2) {
                enemyShip.src = "images/enemyShip.png"
            }
            else {
                enemyShip.src = "images/enemyPurple.png"
            }
        }
        else if (totalRounds < 70) {
            let chance = Math.floor(Math.random() * 2 + 1);
            if (chance < 2) {
                enemyShip.src = "images/enemyShip.png"
            }
            else {
                enemyShip.src = "images/boss.png"
            }

        }
        else if (totalRounds < 80) {
            enemyShip.src = "images/boss.png"
        }
        else if (totalRounds >= 80) {
            enemyShip.src = "images/boss.png"
        }


        enemyShip.classList.add("smallShip");
        enemyShip.classList.add("enemyShip");
        enemyShip.classList.add(enemyID);
        enemyID++;

        enemyShip.style.left = (Math.random() * (window.innerWidth - 400) + 200) + "px";
        enemyShip.style.top = (Math.random() * (100) + 50) + "px";
        //console.log(enemyShip.style.left);



        let gameArena = document.getElementsByClassName("playingField")[0];
        gameArena.appendChild(enemyShip);



    }

    makeEnemies(numberOfEnemies);
    applyHealth();

}
function bossDeath(enemyBossBox, enemyBoss) {
    let gameArena = document.getElementsByClassName("playingField")[0];
    let enemyScore = document.createElement("div");
    enemyScore.classList.add("largeScore");
    playerShip.scoreMultiplier += totalRounds * totalRounds;
    enemyScore.textContent = "+" + Math.floor(1000 * playerShip.scoreMultiplier);
    enemyScore.style.top = enemyBossBox.top + "px";
    enemyScore.style.left = enemyBossBox.left + "px";
    gameArena.appendChild(enemyScore);
    setTimeout(function () {
        enemyScore.remove();
    }, 2000);

    enemyBoss.remove();
    $(".bossHP").remove();
    let bossDeath = document.createElement("div");
    bossDeath.classList.add("bossDeath");
    bossDeath.style.top = enemyBossBox.top + "px";
    bossDeath.style.left = enemyBossBox.left + "px";
    gameArena.appendChild(bossDeath);
    setTimeout(function () {

    }, 1000);
    $(".bossDeath").animate({
        opacity: 0.01,
    }, {
        duration: 2000, queue: false, complete: function () {
            bossDeath.remove()
        }
    });

    playerShip.score += 1000 * playerShip.scoreMultiplier;
    addHealth(5);
    boss.spawned = false;
    currentBossHP += 20;
    boss.health = currentBossHP;
    roundCounter = 0;
}
function smallEnemyDeath(enemyShip) {
    if (enemyShip != "empty") {
        let gameArena = document.getElementsByClassName("playingField")[0];
        let enemyShipBox = enemyShip.getBoundingClientRect();
        if (enemyShip != "empty") {

            addHealth(0.2);

            console.log(playerShip.health);

            playerShip.scoreMultiplier += 1;
            playerShip.score += 100 * playerShip.scoreMultiplier;
            let enemyScore = document.createElement("div");
            enemyScore.classList.add("smallScore");
            enemyScore.textContent = "+" + Math.floor(100 * playerShip.scoreMultiplier);


            enemyScore.style.top = enemyShipBox.top + "px";
            enemyScore.style.left = enemyShipBox.left + "px";

            gameArena.appendChild(enemyScore);
            setTimeout(function () {
                enemyScore.remove();
            }, 1000);


            let enemyDeath = document.createElement("div");
            enemyDeath.classList.add("enemyDeath");
            enemyDeath.style.top = enemyShipBox.top + "px";
            enemyDeath.style.left = enemyShipBox.left + "px";
            gameArena.appendChild(enemyDeath);
            $(".enemyDeath").animate({
                opacity: 0.01,
            }, {
                duration: 1500, queue: false, complete: function () {
                    enemyDeath.remove()
                }
            });


            enemyShip.remove();
            enemiesLeft--;
            console.log("enemies left: " + enemiesLeft);

        }
    }



}
function Enemy() {
    this.health = enemyHealth;
    this.damage = currentEnemySmallDamage;

    // get all displayed enemy ships
    let allEnemies = $(".smallShip");
    //console.log(allEnemies);

    // check through each enemy in enemies array if they have the reference

    let possibleEnemies = allEnemies;
    for (let i = 0; i < enemies.length; i++) {
        for (let j = 0; j < allEnemies.length; j++) {

            if (enemies[i].reference == allEnemies[j]) {

                possibleEnemies.splice(j, 1, "empty");

            }

        }
    }
    //console.log(possibleEnemies);

    // if they don't have the reference, add reference to this enemy
    for (let i = 0; i < possibleEnemies.length; i++) {
        if (possibleEnemies[i] != "empty") {
            this.reference = possibleEnemies[i];



        }
    }




    //console.log(enemies);


}
function displayPlayer() {

    let gameArena = document.getElementsByClassName("playingField")[0];
    let playerShip = document.createElement("img");
    playerShip.src = "images/playerShip.png"
    playerShip.classList.add("playerShip");
    gameArena.appendChild(playerShip);

    let playerHP = document.createElement("div");
    playerHP.classList.add("playerHP");
    gameArena.appendChild(playerHP);

}

// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                           Check Enemy Hit, Check Player Hit, Check Boundaries
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************






function checkEnemyHit() {



    // Check Primary Weapon Hits
    let bullets = document.getElementsByClassName("primary");
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        let bulletBox = bullet.getBoundingClientRect();
        // check if bullets hit large boss

        if (bullet != undefined && boss.spawned == true) {


            let enemyBoss = document.getElementsByClassName("boss")[0];
            var enemyBossBox;
            if (enemyBoss != undefined) {
                enemyBossBox = enemyBoss.getBoundingClientRect();
                if (bulletBox.top < enemyBossBox.top + enemyBossBox.height && bulletBox.left > enemyBossBox.left && bulletBox.right < enemyBossBox.right) {
                    //console.log("enemy boss hit");
                    bullet.remove();
                    primaryHit(bulletBox);
                    addHealth(0.2);
                    boss.health--;


                }
                if (boss.health <= 0) {

                    bossDeath(enemyBossBox, enemyBoss);
                    if(bossShotMultiple >= 3){
                        bossShotMultiple/= 3;
                    }
                    else{
                        bossShotMultiple = 1;
                    }
                }
            }




        }

        // check if bullets hit small enemies
        for (let j = 0; j < enemies.length; j++) {
            let enemyShip = enemies[j].reference;

            if (bullet != undefined && enemyShip != "empty") {
                let enemyShipBox = enemyShip.getBoundingClientRect();
                let bulletBox = bullet.getBoundingClientRect();


                //if primary weapon hit
                if (bulletBox.top < enemyShipBox.top + enemyShipBox.height && bulletBox.top + bulletBox.height > enemyShipBox.top && bulletBox.left > enemyShipBox.left && bulletBox.right < enemyShipBox.right) {
                    //console.log("enemy ship hit");
                    enemies[j].health -= playerShip.primaryDamage;
                    addHealth(0.2);
                    bullet.remove();
                    primaryHit(bulletBox);

                }
            }

            if (enemies[j].health <= 0) {

                smallEnemyDeath(enemyShip);
                enemies[j].reference = "empty";
            }
        }

    }
    // check secondary weapon hits on small ships-
    let secondaryExplosions = document.getElementsByClassName("secondaryExplosion");
    for (let i = 0; i < secondaryExplosions.length; i++) {

        let secondaryExplodeBox = secondaryExplosions[i].getBoundingClientRect();
        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j].reference != "empty") {
                let enemyShipBox = enemies[j].reference.getBoundingClientRect();

                if (enemyShipBox.left >= secondaryExplodeBox.left + secondaryExplodeBox.width || enemyShipBox.top >= secondaryExplodeBox.top + secondaryExplodeBox.height ||
                    enemyShipBox.left + enemyShipBox.width <= secondaryExplodeBox.left || enemyShipBox.top + enemyShipBox.height <= secondaryExplodeBox.top) {
                    // no overlap
                }
                else {
                    enemies[j].health -= playerShip.secondaryDamage;
                    secondaryHit(enemyShipBox);
                    if (enemies[j].health <= 0) {
                        smallEnemyDeath(enemies[j].reference);
                        enemies[j].reference = "empty";
                    }

                    // overlap
                }
            }

            


        }
        let enemyBoss = document.getElementsByClassName("boss")[0];
            if (enemyBoss != undefined) {
                let enemyBossBox = enemyBoss.getBoundingClientRect();

                if (enemyBossBox.left >= secondaryExplodeBox.left + secondaryExplodeBox.width || enemyBossBox.top >= secondaryExplodeBox.top + secondaryExplodeBox.height ||
                    enemyBossBox.left + enemyBossBox.width <= secondaryExplodeBox.left || enemyBossBox.top + enemyBossBox.height <= secondaryExplodeBox.top) {
                    console.log("boss not hit");

                }
                else {

                    if(playerShip.secondaryDamage < 1){
                        boss.health -= playerShip.secondaryDamage;
                    }
                    else{
                        boss.health--;
                    }
                    
                    secondaryHit(enemyBossBox);
                    console.log("boss health: " + boss.health);
                    if (boss.health <= 0) {
                        bossDeath(enemyBossBox, document.getElementsByClassName("boss")[0]);
                    }

                }
            }

    }

}
function checkPlayerHit() {

    let playerBox = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
    let enemyProjectiles = document.getElementsByClassName("enemyProjectile");

    for (let i = 0; i < enemyProjectiles.length; i++) {
        let projectileBox = enemyProjectiles[i].getBoundingClientRect();

        if (projectileBox.top + projectileBox.height > playerBox.top && projectileBox.top < playerBox.top + playerBox.height && projectileBox.left > playerBox.left + playerBox.width / 3 && projectileBox.right < playerBox.left + playerBox.width - playerBox.width / 3) {
            console.log("you have been hit");
            primaryHit(projectileBox);
            enemyProjectiles[i].remove();
            playerShip.health -= currentEnemySmallDamage;
            playerShip.scoreMultiplier = playerShip.scoreMultiplier / 4;
            console.log(playerShip.health);


        }
    }
    if (playerShip.health <= 0) {
        endGame();

    }

}

function enemyShots() {



    var gameArena = document.getElementsByClassName("playingField")[0];
    //get all enemy planes
    let enemyPlanes = document.getElementsByClassName("smallShip");



    // console.log(enemyPlanes);
    let repeatShots = setInterval(function () {
        for (let i = 0; i < enemyPlanes.length; i++) {
            if (Math.random() * 10 <= chanceToFire) {
                let enemyPlane = enemyPlanes[i];
                // console.log(enemyPlane);

                let enemyPlaneBox = enemyPlane.getBoundingClientRect();

                let enemyBullet = document.createElement("div");

                // console.log(enemyPlane.src);

                if (enemyPlane.src.indexOf("Blue") != -1) {
                    enemyBullet.classList.add("enemyBulletBlue");
                }
                else if (enemyPlane.src.indexOf("Green") != -1) {
                    enemyBullet.classList.add("enemyBulletGreen");
                }
                else if (enemyPlane.src.indexOf("Yellow") != -1) {
                    enemyBullet.classList.add("enemyBulletYellow");
                }
                else if (enemyPlane.src.indexOf("Red") != -1) {
                    enemyBullet.classList.add("enemyBulletRed");
                }
                else if (enemyPlane.src.indexOf("Purple") != -1) {
                    enemyBullet.classList.add("enemyBulletPurple");
                }
                else if (enemyPlane.src.indexOf("Ship") != -1) {
                    enemyBullet.classList.add("enemyBulletShip");
                }
                else if (enemyPlane.src.indexOf("boss") != -1) {
                    enemyBullet.classList.add("enemyBulletBoss");
                }
                enemyBullet.classList.add("enemyBullet");
                enemyBullet.classList.add("enemyProjectile");
                enemyBullet.classList.add("enemybullet" + bulletIndex);



                enemyBullet.style.top = (enemyPlaneBox.top + 50) + "px";
                enemyBullet.style.left = (enemyPlaneBox.left + 75 / 2) + "px";
                // console.log(enemyBullet);
                // console.log(enemyPlane);

                let duration = 6000 - totalRounds*100;
                if(duration <= 500){
                    duration = 500;
                }
                gameArena.appendChild(enemyBullet);
                $(".enemybullet" + bulletIndex).animate({ top: (enemyPlaneBox.top + window.innerHeight) + "px" }, { duration: duration, queue: false });
                setTimeout(function () {
                    // console.log( $(".enemybullet"+bulletIndex));

                    enemyBullet.remove();
                }, duration);
                bulletIndex++;



            }
        }

    }, 100);

    var shotMultiplier = 1;
    // if(totalRounds >= 40){
    //     shotMultiplier = 4;
    // }
    // else{
    //     shotMultiplier = totalRounds/10 + 1
    // }
    setTimeout(function () {
        clearInterval(repeatShots);
    }, 100 * (Math.floor(shotMultiplier)))


    if (document.getElementsByClassName("boss")[0] != undefined) {
        bossShotCounter++;


        let bossBox = document.getElementsByClassName("boss")[0].getBoundingClientRect();
        
        repeatBossShot = setInterval(function(){
            let bossBulletPosition = 0;
            let playerBox = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
            for (let i = 0; i < 6; i++) {
                let bossBullet = document.createElement("div");
                // console.log(bossBullet);
    
                bossBullet.classList.add("bossBullet");
                bossBullet.classList.add("enemyProjectile");
                bossBullet.classList.add("bossbullet" + bossBulletIndex);
    
                bossBullet.style.top = (bossBox.top + 100) + "px"
                bossBullet.style.left = (bossBox.left + bossBulletPosition) + "px";
                bossBulletPosition += 300 / 6;
                gameArena.appendChild(bossBullet);
                
                let duration = 3000 - totalRounds*30;
                if(duration < 700){
                    duration = 700;
                }
    
                $(".bossbullet" + bossBulletIndex).animate({ top: (playerBox.top + 20) + "px" }, { duration: duration, queue: false });
                $(".bossbullet" + bossBulletIndex).animate({ left: (playerBox.left + 75 / 2) + "px" }, { duration: duration, queue: false });
                bossBulletIndex++;
                setTimeout(function () {
                    bossBullet.remove();
                }, duration);
            }
        },100) 

        
        
        if(bossShotCounter == 3){
            bossShotCounter = 0;
            if(bossShotMultiple < 15){
                bossShotMultiple++;
            }
            
        }
        setTimeout(function(){
            clearInterval(repeatBossShot);
        },100*(bossShotMultiple))
        
    }







    //generate a random number between 1 and 10, each plane starts off with 100% chance of firing, the more planes, the lower the chance of firing

    //if within the range fire shots
    //for each plane that can fire a shot, generate a small projectile using a div container

}



function applyHealth() {
    for (let i = 0; i < enemies.length; i++) {
        let source = enemies[i].reference.src;


        if (source != undefined) {
            if (source.indexOf("Blue") != -1) {


            }
            else if (source.indexOf("Green") != -1) {
                enemies[i].health = (playerShip.primaryDamage * 3);
            }
            else if (source.indexOf("Yellow") != -1) {
                enemies[i].health = (playerShip.primaryDamage * 6);
            }
            else if (source.indexOf("Red") != -1) {
                enemies[i].health = (playerShip.primaryDamage * 9);
            }
            else if (source.indexOf("Purple") != -1) {
                enemies[i].health = (playerShip.primaryDamage * 12);
            }
            else if (source.indexOf("Ship") != -1) {
                if (totalRounds >= 70) {
                    enemies[i].health = (playerShip.primaryDamage * 15 + healthScaling * 10);
                }
                else {
                    enemies[i].health = (playerShip.primaryDamage * 15);
                }

            }
            else if (source.indexOf("boss") != -1) {
                if (totalRounds >= 70) {
                    enemies[i].health = (playerShip.primaryDamage * 18 + healthScaling * 10);
                }
                else {
                    enemies[i].health = (playerShip.primaryDamage * 18);
                }
            }
        }

    }
}

function addHealth(health) {
    if (playerShip.health < maximumHP) {
        playerShip.health += health
    }
    if (playerShip.health > maximumHP) {
        playerShip.health -= (playerShip.health - maximumHP);
    }

}
// ship weapons

function moveShip(keyPressed) {


    if (gameOn == true) {
        //check if ship is about to go out of window
        let ship = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
        let stopLeft = false;
        let stopRight = false;
        let stopUp = false;
        let stopDown = false;
        // console.log("top: " + ship.top);
        // console.log("bottom: " + ship.botom);
        // console.log("right: " + ship.right);
        // console.log("left: " + ship.left);

        if (ship.top <= 100) {
            stopUp = true;
        }
        if (ship.top >= window.innerHeight - 150) {
            stopDown = true;
        }
        if (ship.right >= window.innerWidth - 100) {
            stopRight = true;
        }
        if (ship.left <= 100) {
            stopLeft = true;
        }




        switch (keyPressed) {
            case 37:
                // alert('Left key pressed');
                if (stopLeft == false && leftCount < 1) {



                    leftCount++;
                    moveLeft = setInterval(function () {
                        $(".playerShip").animate({ left: '-=' + moveVel + 'px' }, { duration: 10, queue: false });
                    }, 10)

                }

                break;
            case 38:
                if (stopUp == false && upCount < 1) {
                    upCount++;
                    moveUp = setInterval(function () {
                        $(".playerShip").animate({ top: '-=' + moveVel + 'px' }, { duration: 10, queue: false });
                    }, 10)
                }
                // alert('Up key pressed');

                break;
            case 39:

                if (stopRight == false && rightCount < 1) {
                    rightCount++;
                    moveRight = setInterval(function () {
                        $(".playerShip").animate({ left: '+=' + moveVel + 'px' }, { duration: 10, queue: false });
                    }, 10)
                }
                //alert('Right key pressed');


                break;
            case 40:
                if (stopDown == false && downCount < 1) {
                    downCount++;
                    moveDown = setInterval(function () {
                        $(".playerShip").animate({ top: '+=' + moveVel + 'px' }, { duration: 10, queue: false });
                    }, 10)
                }
                //alert('Down key pressed');

                break;
        }

    }




}
function stopShip(keyPressed) {
    if (keyPressed == 37) {
        clearInterval(moveLeft);
        leftCount = 0;
    }
    else if (keyPressed == 38) {
        clearInterval(moveUp);
        upCount = 0;
    }
    else if (keyPressed == 39) {
        clearInterval(moveRight);
        rightCount = 0;
    }
    else if (keyPressed == 40) {
        clearInterval(moveDown);
        downCount = 0;
    }
}
function toggleGUI() {
    $(".playerGUI").toggle(500);
}
function toggleDeathScreen() {
    $(".scoreDeath").text("Score: " + playerShip.score);
    $(".roundDeath").text("Rounds Beaten: " + totalRounds);
    $(".deathScreen").toggle(500);

}
$(document).keydown(function (event) {


    if (gameOn == true) {
        let keypressed = event.keyCode
        if (keypressed == 81) {
            firePrimary();
        }
        if (keypressed == 37 || keypressed == 38 || keypressed == 39 || keypressed == 40) {
            moveShip(event.keyCode);
        }
        if (keypressed == 87) {
            fireSecondary();
        }
        if (keypressed == 69) {
            fireTertiary();
        }
        if (keypressed == 82) {
            fireUltimate();
        }

    }



});
$(document).keyup(function (event) {
    keypressed = event.keyCode;
    if (gameOn == true) {
        if (keypressed == 37 || keypressed == 38 || keypressed == 39 || keypressed == 40) {
            stopShip(event.keyCode);
        }
        if (keypressed == 81) {
            stopPrimary();
        }
    }

});

function checkBounds() {
    let playerShip = document.getElementsByClassName("playerShip")[0];

    if (playerShip != undefined) {
        let ship = playerShip.getBoundingClientRect();

        if (ship.top <= 100) {
            clearInterval(moveUp);
        }
        if (ship.top >= window.innerHeight - 150) {
            clearInterval(moveDown);
        }
        if (ship.right >= window.innerWidth - 100) {
            clearInterval(moveRight);
        }
        if (ship.left <= 100) {
            clearInterval(moveLeft);
        }

    }

}

$(".startButton").click(function () {

    $(".mainMenu").slideToggle(1000);
    setTimeout(function () { startGame(); }, 1000);
})
$(".restartButton").click(function () {

    toggleDeathScreen();
    setTimeout(function () { startGame(); }, 1000);
})
$(".returnMenu").click(function () {
    toggleDeathScreen();
    $(".mainMenu").slideToggle(1000);


})