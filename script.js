
// global variables
let enemyID = 0;
var enemies = [];
var enemiesLeft;
let maxEnemies = 25;
let totalRounds = 0;
let roundCounter = 0;

let artilleryRate = 5000;
let artilleryAmount = 1;
let artilleryExplodeIndex = 0;
let artilleryRoundCounter = 0;

var currentEnemySmallDamage;
let chanceToFire = 10;
let bulletIndex = 0;


let currentBossHP = 20;
let bossBulletIndex = 0;
let bossRainIndex = 0;

let bossShotCounter0 = 0;
var bossShotMultiple0 = 1;

let bossShotCounter1 = 0;
var bossShotMultiple1 = 1;

let bossShotCounter2 = 0;
var bossShotMultiple2 = 1;

let powerUps = [];
let powerUpIndex = 0;

let qLevel = 1;
let wLevel = 0;
let eLevel = 0;
let r1Level = 0;
let r2Level = 0;


var primaryRepeat;
let primaryIndex = 0;
let primaryExplodeIndex = 0;
let primaryOn = false;
let primaryCooldown = 100;
let primaryBossDamage = 1;
let primaryAmount = 1;
let primarySize = 1;

let secondaryIndex = 0;
let secondaryExplodeIndex = 0;
let secondaryRockets = 1;
let secondaryHitIndex = 0;

let tertiaryDuration = 5000;

let playerShield = false;
ultimateShieldDuration = 5000;
ultimateSwordDuration = 5000;
ultimateHitIndex = 0;

let gameOn = false;
let enemyHealth = 1;
let maximumHP = 20;
let healthScaling = 1;

var sensor1;
var sensor2;
var sensor3;
var sensor4;

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
    secondary: false,
    tertiary: false,
    primaryON: true,
    secondaryON: true,
    tertiaryON: true,
    ultimateShield: false,
    ultimateSword: false,
    damageAbsorbed: 0,
    primaryDamage: 1,
    secondaryDamage: 0.1 * Math.pow(1.3, totalRounds / 3),
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
    if (bossHP != undefined) {
        bossHP.remove();
    }
    if (playerHP != undefined) {
        playerHP.remove();
    }

    clearInterval(sensor1);
    clearInterval(sensor2);
    clearInterval(sensor3);
    clearInterval(sensor4);
    clearInterval(moveLeft);
    clearInterval(moveRight);
    clearInterval(moveUp);
    clearInterval(moveDown);
    clearInterval(primaryRepeat);

    toggleGUI();
    toggleDeathScreen();

    gameOn = false;
}


function startGame() {
    gameOn = true;
    displayPlayer();
    toggleGUI();
    currentEnemySmallDamage = 0.2 * totalRounds / 4 + 1;

    var numberOfEnemies;
    if (totalRounds <= maxEnemies - 1) {
        numberOfEnemies = totalRounds + 1;
    }
    else {
        numberOfEnemies = maxEnemies;
    }
    enemiesLeft = numberOfEnemies;
    displayEnemy(numberOfEnemies);
    roundCounter++;
    artilleryRoundCounter++;


    sensor1 = setInterval(function () {
        if (gameOn == true) {
            deleteEmpty();

            checkEnemyHit();
            checkPlayerHit();
            updateGUI();
            checkBounds();
            checkPlayerCollect();
            deletePowerUps();

        }




    }, 10);


    sensor2 = setInterval(function () {
        if (gameOn == true) {
            enemyShots();
        }



    }, 2000);

    sensor3 = setInterval(function () {
        if (enemiesLeft == 0) {





            if (roundCounter == 2) {
                totalRounds++;
                
                artilleryRoundCounter++;
                if(artilleryRoundCounter == 10){
                    artilleryRoundCounter = 0;
                    if(artilleryAmount < 10){
                        artilleryAmount++;
                    }
                   
                }
                enemiesLeft = numberOfEnemies;
                currentEnemySmallDamage = 0.2 * totalRounds / 3 + 1;
                // console.log(roundCounter);

                roundCounter++;
                displayEnemy(numberOfEnemies);
                displayBoss();
                // displayEnemy(numberOfEnemies);
                boss.spawned = true;
                // console.log(boss.health);


                playerShip.secondaryDamage = 0.1 * Math.pow(1.3, totalRounds / 3);
                maximumHP += 1;
                // console.log(maximumHP);



                if (totalRounds >= 70) {
                    healthScaling++;
                    playerShip.primaryDamage = 1 * Math.pow(1.05, totalRounds) - 1 * Math.pow(1.05, 69);
                }


            }
            else {
                if (boss.spawned == false && roundCounter < 2) {
                    totalRounds++;
                    roundCounter++;

                    artilleryRoundCounter++;

                    if(artilleryRoundCounter == 10){
                        artilleryRoundCounter = 0;
                        if(artilleryAmount < 10){
                            artilleryAmount++;
                        }
                    
                    }

                    if (numberOfEnemies < maxEnemies) {
                        numberOfEnemies = totalRounds + 1;


                    }
                    if (totalRounds >= 70) {
                        healthScaling = totalRounds - 70 + 1;
                        playerShip.primaryDamage = 1 * Math.pow(1.05, totalRounds) - 1 * Math.pow(1.05, 69);
                    }
                    enemiesLeft = numberOfEnemies;
                    displayEnemy(numberOfEnemies);
                }



            }

        }
    }, 1000);

    sensor4 = setInterval(function(){
        fireArtillery();
    },artilleryRate)
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function updateGUI() {
    if (gameOn == true) {
        // update each of the stats in the gui with new data
        $(".healthNumbers").text(playerShip.health.toFixed(2) + "/" + maximumHP.toFixed(2));
        
        $(".currentHP").css("width", ( document.getElementsByClassName("healthBar")[0].offsetWidth * playerShip.health / maximumHP) + "px");
        $(".round").text("Round: " + totalRounds);
        $(".score").text("Score: " + numberWithCommas(Math.floor(playerShip.score)));
        $(".scoreMultiplier").text("x" + Math.floor(playerShip.scoreMultiplier));

        $(".bossHP").css("width", (400 * boss.health / currentBossHP) + "px")

        let playerLocation = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
        $(".playerHP").css("top", (playerLocation.top + playerLocation.height + 10) + "px");
        $(".playerHP").css("left", (playerLocation.left) + "px");
        $(".playerHP").css("width", (playerLocation.width * playerShip.health / maximumHP) + "px");
        
        let shield = document.getElementsByClassName("playerShield")[0];
        updateShieldPos(shield);

        let laser = document.getElementsByClassName("ultimateLaser")[0];
        updateLaserPos(laser);
        


    }


}
function toggleGUI() {
    $(".playerGUI").toggle(500);
}
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                                             Power Ups
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function spawnPowerUp(abilityType,enemyShipBox){

    let powerUpImage = document.createElement("div");
    let gameArena = document.getElementsByClassName("playingField")[0];
    
    powerUpImage.classList.add("powerUp");
    powerUpImage.classList.add("powerup" + powerUpIndex);

    if(abilityType == "attack"){
        powerUpImage.classList.add("attack");

    }
    else if(abilityType == "sustain"){
        powerUpImage.classList.add("sustain");
    }
    else{
        powerUpImage.classList.add("defense");
    }

    powerUpImage.style.top = enemyShipBox.top + "px";
    powerUpImage.style.left = enemyShipBox.left + "px";

    gameArena.appendChild(powerUpImage);

    
    
    let reference = powerUpImage;

    var powerUpObject = new PowerUp(abilityType , reference);

    powerUps.push(powerUpObject);
    
    $(".powerup" + powerUpIndex).animate({top: window.innerHeight + "px"},{duration: 5000, queue: false, complete: function(){
        powerUpImage.remove();
    }})
    powerUpIndex++;
}

function PowerUp(abilityType , reference){
    this.abilityType = abilityType;
    this.reference = reference;
}
function deletePowerUps(){

    // if the reference of a power up cant be found in the document remove it
    for(let i = 0; i < powerUps.length; i++){

        let powerUpimages = $(".powerUp");
        for(let j = 0; j < powerUpimages.length; j++){

            if(powerUps[i].reference == powerUpimages[j]){
                j = powerUpimages.length;
            }
            else if(j == powerUpimages.length - 1){
                powerUps.splice(i,1);
            }

        }
    }

}
function checkPlayerCollect(){
    let playerShip = document.getElementsByClassName("playerShip")[0];
    
    if(playerShip != undefined){
        let playerShipBox = playerShip.getBoundingClientRect();


        for( i = 0; i < powerUps.length; i++){
            let powerUp = powerUps[i];
    
            if(powerUp.reference != "empty"){
    
                let powerUpRef = powerUp.reference;
                let powerUpBox = powerUpRef.getBoundingClientRect();
                
                
                if(playerShipBox.left >= powerUpBox.left + powerUpBox.width || playerShipBox.top >= powerUpBox.top + powerUpBox.height ||
                    playerShipBox.left + playerShipBox.width <= powerUpBox.left || playerShipBox.top + playerShipBox.height <= powerUpBox.top){
                        // nothing happens
                }
                else{
                    if(powerUp.abilityType == "attack"){
                        // console.log("upgrading attack");
                        let chance = Math.floor(Math.random()*5);
                        switch(chance){
                            case 0:
                                if(qLevel < 10){
                                    
                                    upgradeAbility("q");
                                }
                                break;
                            case 1:
                                if(wLevel < 10){
                                    upgradeAbility("w");
                                }
                                break;
                            case 2:
                                if(eLevel < 10){
                                    upgradeAbility("e");
                                }
                                break;
                            case 3:
                                if(r1Level < 10){
                                    upgradeAbility("r1");
                                }
                                break;
                            case 4:
                                if(r2Level < 10){
                                    upgradeAbility("r2");
                                }
                                break;
    
                        }
                        
                    }
                    else if(powerUp.abilityType == "sustain"){
                        // console.log("upgrading sustain");
                    }
                    else{
                        // defense
                        // console.log("upgrading defense");
                    }
                    powerUpRef.remove();
                    powerUps.splice(i,1);
                    i--;
                }
                
    
            }
    
    
    
        }
    }
   
}

function upgradeAbility(ability){

    if(ability == "q"){
        if(qLevel < 1){
            playerShip.primary = true;
        }
        else{
            if(qLevel < 3){
                primaryAmount++;
            }
            else if(qLevel < 9){
                primarySize += 0.2;
            }
        }
        qLevel++;
        $(".q .level p").text(qLevel);
     
        
    }
    if(ability == "w"){
        if(wLevel < 1){

            
            playerShip.secondary = true;
            // console.log("w unlocked");
            $(".w").css("display" , "flex");
            
        }
        else{
            secondaryRockets++;
            // console.log("w leveled up");
        }
        wLevel++;
        $(".w .level p").text(wLevel);
        
    }
    if(ability == "e"){
        if(eLevel < 1){
            
            playerShip.tertiary = true;
            $(".e").css("display" , "flex");
        }
        else{

            tertiaryDuration += 1000;

        }
        eLevel++;
        $(".e .level p").text(eLevel);
        
    }
    if(ability == "r1"){
        if(r1Level < 1){
            
            playerShip.ultimateShield = true;
            $(".r1").css("display" , "flex");
        }
        else{
            ultimateShieldDuration += 1000;
        }
        r1Level++;
        $(".r1 .level p").text(r1Level);
        
    }
    if(ability == "r2"){
        if(r2Level < 1){
            if(r1Level < 1){
                playerShip.ultimateShield = true;
                $(".r1").css("display" , "flex");
                r1Level++;
            }
            else{
                playerShip.ultimateSword = true;
                $(".r2").css("display" , "flex");
                r2Level++;
            }
        }
        else{
            ultimateSwordDuration += 1000;
            r2Level++;
        }
        
        $(".r2 .level p").text(r2Level);
    }
    
}





// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                                             Ship weapons
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function firePrimary() {

    if (primaryOn == false && playerShip.primary == true && playerShip.primaryON == true) {
        primaryOn = true;

        

        primaryRepeat = setInterval(function () {
            //console.log("firing primary");
            let primaryPosition = 1;
            for(let i = 0; i < primaryAmount; i++){
                let primary = document.createElement("div");

                primary.classList.add("primary");
                primary.classList.add("primary" + primaryIndex);
                primary.style.height = 20*primarySize + "px";
                primary.style.width = 5*primarySize + "px";
    
                let ship = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
    
                primary.style.position = "absolute";
    
                primary.style.top = (ship.top) + "px";
                // console.log( );
                
                primary.style.left = (ship.left + primaryPosition*ship.width/(primaryAmount + 1) - parseInt(primary.style.width,10)/2 ) + "px";
                primaryPosition++;
               
               
                var gameArena = document.getElementsByClassName("playingField")[0];
    
                gameArena.appendChild(primary);
    
                $(".primary" + primaryIndex).animate({ top: "0px" }, { duration: 500, queue: false, complete: function(){
                    primary.remove();
                } });
                primaryIndex++;
            }
            

        }, primaryCooldown);
    }



    //fire primary




}
function stopPrimary() {
    clearInterval(primaryRepeat);
    primaryOn = false;
}
function fireSecondary() {
    if (playerShip.secondary == true && playerShip.secondaryON == true) {
        //console.log("firing secondary");
        //fire secondary
        let playerShipBox = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
        let gameArena = document.getElementsByClassName("playingField")[0];
        let enemyShips = document.getElementsByClassName("enemyShip");
        let shipsArray = [];

        for (let i = 0; i < enemyShips.length; i++) {
            shipsArray[i] = enemyShips[i];
        }
        // console.log(enemyShips);


        if (enemyShips.length > 0) {
            let lockOnData = [];

            //generate 6 homing missiles at center of ship
            let fireAmount = secondaryRockets;
            let firedCount = 0;

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

                            if (enemyShips.length >= secondaryRockets || firedCount < enemyShips.length) {
                                if (checkMissileUnique(enemyShipCoords, lockOnData) == true) {

                                    // console.log("testing 1");
                                    // console.log(enemyShipCoords);


                                    lockOnData.push(enemyShipCoords);
                                    locked = true;
                                    firedCount++;
                                    // shipsArray.splice(j, 1);
                                    // j--;
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

            playerShip.secondary = false;
            $(".secondaryCooldown").addClass("inactive");

            setTimeout(function () { 
                playerShip.secondary = true;
                if(playerShip.secondaryON == true){
                    
                    $(".secondaryCooldown").removeClass("inactive");
                }
          
            }, 10000);
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
function changePrimaryCooldown() {
    clearInterval(primaryRepeat);
    primaryOn = false;
    firePrimary();
}
function fireTertiary() {
    if (playerShip.tertiary == true && playerShip.tertiaryON == true) {
        //console.log("firing tertiary");
        //fire tertiary

        primaryCooldown = 10;
        primaryBossDamage++;
        if(playerShip.primaryON == true){
            changePrimaryCooldown();
        }
        playerShip.tertiary = false;
        $(".tertiaryCooldown").addClass("inactive");
        setTimeout(function () { playerShip.tertiary = true;$(".tertiaryCooldown").removeClass("inactive"); }, 20000);
        setTimeout(function () {

            $(".primaryCooldown").addClass("inactive");
            primaryBossDamage--;
            primaryCooldown = 500;
            if(playerShip.primaryON == true){
                changePrimaryCooldown();
            }
       

            setTimeout(function () {
                primaryCooldown = 100;
                if(playerShip.primaryON == true){
                    $(".primaryCooldown").removeClass("inactive");
                    changePrimaryCooldown();
                }
               
                

                
            }, 5000);
        }, tertiaryDuration);






    }
}
function fireUltimate() {
    let gameArena = document.getElementsByClassName("playingField")[0];
    if (playerShip.ultimateShield == true) {
        //console.log("firing ultimate");
        //activate shield
        playerShip.ultimateShield = false;
        playerShip.damageAbsorbed = 0;
        $(".ultimateShieldCooldown").addClass("inactive");
        
        let shield = document.createElement("div");
        shield.classList.add("playerShield");

        gameArena.appendChild(shield);
        updateShieldPos(shield);
        
        
        playerShield = true;
        setTimeout(function(){
            
            deactivatePlayerShield();
            
        },ultimateShieldDuration);
        setTimeout(function () { playerShip.ultimateShield = true; $(".ultimateShieldCooldown").removeClass("inactive");}, 20000);
    }
    else if(playerShip.ultimateSword == true && playerShield == true){
        // deactivate shield
        deactivatePlayerShield();
        $(".ultimateShieldCooldown").addClass("inactive");
        $(".ultimateSwordCooldown").addClass("inactive");
        //activate sword
        playerShip.ultimateSword = false;

        // deactivate primary secondary and tertiary weapons
        playerShip.primaryON = false;
        playerShip.secondaryON = false;
        playerShip.tertiaryON = false;
        clearInterval(primaryRepeat);

        $(".primaryCooldown").addClass("inactive");
        $(".secondaryCooldown").addClass("inactive");
        $(".tertiaryCooldown").addClass("inactive");

        let laser = document.createElement("div");
        laser.classList.add("ultimateLaser");
        gameArena.appendChild(laser);
        updateLaserPos(laser);



        setTimeout(function(){

            laser.remove();
            playerShip.primaryON = true;
            playerShip.secondaryON = true;
            playerShip.tertiaryON = true;
            
            
            $(".primaryCooldown").removeClass("inactive");
            if(playerShip.secondary == true){

                $(".secondaryCooldown").removeClass("inactive")
            }
            else if(playerShip.tertiary == true){
                $(".tertiaryCooldown").removeClass("inactive");
            }
          

        },ultimateSwordDuration);
        setTimeout(function () { playerShip.ultimateSword = true; $(".ultimateSwordCooldown").removeClass("inactive");}, 60000);
    }
}
function deactivatePlayerShield(){
    playerShield = false;
    
    
    $(".playerShield").remove();
}
function updateShieldPos(shield){
        let playerLocation = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
        if(shield != undefined){
            shield.style.top = (playerLocation.top - 10  ) + "px";
            shield.style.left = (playerLocation.left -10 ) + "px";
        }
}
function updateLaserPos(laser){
    let playerLocation = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
        if(laser != undefined){
            laser.style.top = (-30) + "px";
            laser.style.left = (playerLocation.left) + "px";
            laser.style.height = (playerLocation.top + playerLocation.height + 10) + "px";
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

function ultimateHit(shipBox){
    let gameArena = document.getElementsByClassName("playingField")[0];
    let ultimateHit = document.createElement("div");

    ultimateHit.classList.add("ultimateHit");
    ultimateHit.classList.add("ultimatehit" + secondaryHitIndex);

    ultimateHit.style.top = Math.random() * (shipBox.height) + shipBox.top + "px";
    ultimateHit.style.left = Math.random() * (shipBox.width) + shipBox.left + "px";

    gameArena.appendChild(ultimateHit);
    $(".ultimateHit" + secondaryHitIndex).animate({
        opacity: 0.01,
    }, {
        duration: 1000, queue: false, complete: function () {
            ultimateHit.remove();

        }
    });
    setTimeout(function () {
        ultimateHit.remove();
    }, 1000);
    ultimateHitIndex++;

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
    let chance = Math.floor(Math.random() * 3);

    switch (chance) {

        case 0:
            enemyBoss.src = "images/boss0.png";
            

            break;
        case 1:
            enemyBoss.src = "images/boss1.gif";
            boss.health /= 2;
            break;
        case 2:
            enemyBoss.src = "images/boss2.png";
            boss.health *= 2;
            break;

    }

    // enemyBoss.src = "images/boss2.png";
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
                enemyShip.src = "images/boss0.png"
            }

        }
        else if (totalRounds < 80) {
            enemyShip.src = "images/boss0.png"
        }
        else if (totalRounds >= 80) {
            enemyShip.src = "images/boss0.png"
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
    
    enemyBoss.remove();

    
    spawnPowerUp("attack",enemyBossBox);
    


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
        enemyShip.remove();
        if (enemyShip != "empty") {

            let chance = Math.floor(Math.random()*100);
            if(chance == 0){
                spawnPowerUp("attack",enemyShipBox);
            }
            
            addHealth(0.2);

            // console.log(playerShip.health);

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


            enemiesLeft--;
            
            
            // console.log("enemies left: " + enemiesLeft);

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
                    if(qLevel < 10){
                        bullet.remove();
                    }
                   
                    primaryHit(bulletBox);
                    if(qLevel >= 5){
                        addHealth(0.2);
                    }
                    else if(qLevel >= 4){
                        addHealth(0.1);
                    }
                   
                    boss.health -= primaryBossDamage;


                }
                if (boss.health <= 0) {

                    if(enemyBoss.src.indexOf("boss0") != -1 ){
                        if (bossShotMultiple0 >= 3) {
                            bossShotMultiple0 /= 3;
                        }
                        else {
                            bossShotMultiple0 = 1;
                        }
                        
                    }
                    if(enemyBoss.src.indexOf("boss1") != -1 ){
                        if (bossShotMultiple1 >= 3) {
                            bossShotMultiple1 /= 3;
                        }
                        else {
                            bossShotMultiple1 = 1;
                        }
                      
                    }
                    if(enemyBoss.src.indexOf("boss2") != -1 ){
                        if (bossShotMultiple2 >= 3) {
                            bossShotMultiple2 /= 3;
                        }
                        else {
                            bossShotMultiple2 = 1;
                        }
                        
                    }
                    
                    
                    bossDeath(enemyBossBox, enemyBoss);
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

                    if(qLevel >= 9){
                        addHealth(0.1);
                    }
                    else if(qLevel >= 8){
                        addHealth(0.15);
                    }
                    else if(qLevel >=7){
                        addHealth(0.10);
                    }
                    else if(qLevel >=6){
                        addHealth(0.05);
                    }
                  

                    if(qLevel < 10){
                        bullet.remove();
                    }
                   
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
                // console.log("boss not hit");

            }
            else {

                if (playerShip.secondaryDamage < 1) {
                    boss.health -= playerShip.secondaryDamage;
                }
                else {
                    boss.health--;
                }

                secondaryHit(enemyBossBox);
                // console.log("boss health: " + boss.health);
                if (boss.health <= 0) {
                    bossDeath(enemyBossBox, document.getElementsByClassName("boss")[0]);
                }

            }
        }

    }

    // check ultimate hits for smallEnemies
    let ultimateLaser = document.getElementsByClassName("ultimateLaser")[0];
    if(ultimateLaser != undefined){
        for(let i = 0; i < enemies.length; i++){
            let enemyShip = enemies[i].reference;
            if(enemyShip != "empty"){
                let enemyShipBox = enemyShip.getBoundingClientRect();
                let ultimateLaserBox = ultimateLaser.getBoundingClientRect();
        
                if(enemyShipBox.left >= ultimateLaserBox.left + ultimateLaserBox.width || enemyShipBox.top >= ultimateLaserBox.top + ultimateLaserBox.height ||
                    enemyShipBox.left + enemyShipBox.width <= ultimateLaserBox.left || enemyShipBox.top + enemyShipBox.height <= ultimateLaserBox.top){
                        // enemy not hit
                }
                else{
                    enemies[i].health -= playerShip.damageAbsorbed/10 + 1;
                    ultimateHit(enemyShipBox);
                    if(enemies[i].health <= 0 ){
                        // console.log("testingSMALL");
                        
                        smallEnemyDeath(enemyShip);
                        enemies[i].reference = "empty";
                    }
                }
            }
           
    
            
        }
        // check ultimate hits for bosses
        let enemyBoss = document.getElementsByClassName("boss")[0];
        
        if(enemyBoss != undefined){
            let enemyBossBox = enemyBoss.getBoundingClientRect();
            let ultimateLaserBox = ultimateLaser.getBoundingClientRect();
            if(enemyBossBox.left >= ultimateLaserBox.left + ultimateLaserBox.width || enemyBossBox.top >= ultimateLaserBox.top + ultimateLaserBox.height ||
                enemyBossBox.left + enemyBossBox.width <= ultimateLaserBox.left || enemyBossBox.top + enemyBossBox.height <= ultimateLaserBox.top){
                    // enemy not hit
            }
            else{
                // console.log(boss.health);
                boss.health -= playerShip.damageAbsorbed/10 + 1;
                // console.log(playerShip.damageAbsorbed);
                // console.log(boss.health);
                
                
                ultimateHit(enemyBossBox);
                if(boss.health <= 0 ){
                    // console.log("testingBOSS");
                    
                    bossDeath(enemyBossBox,enemyBoss);
                }
            }
        }
    }
    


}
function checkPlayerHit() {

    let playerBox = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
    let enemyProjectiles = document.getElementsByClassName("enemyProjectile");
    let playerShield = document.getElementsByClassName("playerShield")[0];
    for (let i = 0; i < enemyProjectiles.length; i++) {
        let projectileBox = enemyProjectiles[i].getBoundingClientRect();
        if(playerShield != undefined){
            let playerShieldBox = playerShield.getBoundingClientRect();
            if (playerShieldBox.left >= projectileBox.left + projectileBox.width || playerShieldBox.top >= projectileBox.top + projectileBox.height ||
                playerShieldBox.left + playerShieldBox.width <= projectileBox.left || playerShieldBox.top + playerShieldBox.height <= projectileBox.top) {
                // no overlap
            }
            else{
                if(enemyProjectiles[i].classList.contains("artilleryExplode")){
                    playerShip.damageAbsorbed += currentEnemySmallDamage / 2;
                }
                else{
                    playerShip.damageAbsorbed += currentEnemySmallDamage;
                }
                
                primaryHit(projectileBox);
                enemyProjectiles[i].remove();
            }
        }
        else if(enemyProjectiles[i].classList.contains("artilleryExplode")){
            if (playerBox.left >= projectileBox.left + projectileBox.width || playerBox.top >= projectileBox.top + projectileBox.height ||
                playerBox.left + playerBox.width <= projectileBox.left || playerBox.top + playerBox.height <= projectileBox.top) {
                // no overlap
            }
            else{
                // console.log("you have been hit");
                primaryHit(projectileBox);
                enemyProjectiles[i].remove();
                playerShip.health -= currentEnemySmallDamage/2;
                playerShip.scoreMultiplier = playerShip.scoreMultiplier / 4;
                // console.log(playerShip.health);
            }
        }
        else if (projectileBox.top + projectileBox.height > playerBox.top && projectileBox.top < playerBox.top + playerBox.height && projectileBox.left > playerBox.left + playerBox.width / 3 && projectileBox.right < playerBox.left + playerBox.width - playerBox.width / 3) {
            // console.log("you have been hit");
            primaryHit(projectileBox);
            enemyProjectiles[i].remove();
            playerShip.health -= currentEnemySmallDamage;
            playerShip.scoreMultiplier = playerShip.scoreMultiplier / 4;
            // console.log(playerShip.health);


        }
    }
    if (playerShip.health <= 0) {
        endGame();

    }

}
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                           Enemy Shots, Apply Health to enemies, fireArtillery
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function fireArtillery(){
    let playerShip = document.getElementsByClassName("playerShip")[0];
    
    let gameArena = document.getElementsByClassName("playingField")[0];


    let repeatArtillery = setInterval(function(){
        let playerShipBox = playerShip.getBoundingClientRect();
        let artillery = document.createElement("div");
        artillery.classList.add("artilleryIndicator");
        artillery.classList.add("enemyProjectile");
        artillery.style.top = playerShipBox.top - 100 + Math.random()*(200 + playerShipBox.height) + "px";
        artillery.style.left = playerShipBox.left - 100 + Math.random()*(200 + playerShipBox.width) + "px";

        let artilleryY = artillery.style.top;
        let artilleryX = artillery.style.left;

        gameArena.appendChild(artillery);

        setTimeout(function(){
            artillery.classList.remove("artilleryIndicator");
            artillery.classList.add("artilleryExplode");
            artillery.classList.add("artilleryexplode" + artilleryExplodeIndex);
            artillery.style.top = artilleryY + "px";
            artillery.style.left = artilleryX + "px";
            $(".artilleryexplode" + artilleryExplodeIndex).animate({opacity: "0.01" },{duration:300 , queue: false, complete: function(){
                artillery.remove()
            }});
        },1000);
        
    }, 300);

    setTimeout(function(){
        clearInterval(repeatArtillery);
    },300*artilleryAmount);


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

                let duration = 6000 - totalRounds * 100;
                if (duration <= 500) {
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

    let boss = document.getElementsByClassName("boss")[0];
    if (boss != undefined) {
        if(boss.src.indexOf("boss0") != -1){
            bossShotCounter0++;
        }
        if(boss.src.indexOf("boss1") != -1){
            bossShotCounter1++;
        }
        if(boss.src.indexOf("boss2") != -1){
            bossShotCounter2++;
        }
        
        


        let bossBox = boss.getBoundingClientRect();


        repeatBossShot = setInterval(function () {
            let bossBulletPosition = 0;
            
            for (let i = 0; i < 6; i++) {
                let playerBox = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
                let bossBullet = document.createElement("div");
                // console.log(bossBullet);

                bossBullet.classList.add("bossBullet");
                bossBullet.classList.add("enemyProjectile");
                bossBullet.classList.add("bossbullet" + bossBulletIndex);

                bossBullet.style.top = (bossBox.top + 100) + "px"
                bossBullet.style.left = (bossBox.left + bossBulletPosition) + "px";
                bossBulletPosition += 300 / 6;
                gameArena.appendChild(bossBullet);

                let duration = 3000 - totalRounds * 30;
                if (duration < 700) {
                    duration = 700;
                }

                if (boss.src.indexOf("boss0") != -1) {
                    $(".bossbullet" + bossBulletIndex).animate({ top: (playerBox.top + 20) + "px" }, { duration: duration, queue: false });
                    $(".bossbullet" + bossBulletIndex).animate({ left: (playerBox.left + 75 / 2) + "px" }, { duration: duration, queue: false });
                    bossBulletIndex++;
                    setTimeout(function () {
                        bossBullet.remove();
                    }, duration);
                }
                else if (boss.src.indexOf("boss1") != -1){
                    $(".bossbullet" + bossBulletIndex).animate({ top: (playerBox.top - 200 + Math.random() * (window.innerHeight - playerBox.top + 200)) + "px" }, { duration: duration, queue: false });
                    $(".bossbullet" + bossBulletIndex).animate({ left: (playerBox.left - 600 + Math.random() * (1200 + playerBox.width)) + "px" }, { duration: duration, queue: false });
                    bossBulletIndex++;
                    setTimeout(function () {
                        bossBullet.remove();
                    }, duration);
                }
                else if (boss.src.indexOf("boss2") != -1){
                    bossBullet.classList.add("bossbullet" + bossRainIndex);
                    $(".bossbullet" + bossBulletIndex).animate({ top:  window.innerHeight + "px" }, { duration: duration, queue: false, complete:function(){
                        bossBullet.remove();
                    } });
                 
                   
                    bossBulletIndex++;
                  

                 

                    
                }

            }
        }, 100)
        var bossShotMultiple;
        bossRainIndex++;
        if(boss.src.indexOf("boss0") != -1){
            if (bossShotCounter0 == 3) {
                bossShotCounter0 = 0;
                if (bossShotMultiple0 < 15) {
                    bossShotMultiple0++;
                }
    
            }
            bossShotMultiple = bossShotMultiple0;
        }
        if(boss.src.indexOf("boss1") != -1){
            if (bossShotCounter1 == 3) {
                bossShotCounter1 = 0;
                if (bossShotMultiple1 < 5) {
                    bossShotMultiple1 ++;
                }
    
            }
            bossShotMultiple = bossShotMultiple1;
        }

        if(boss.src.indexOf("boss2") != -1){
            if (bossShotCounter2 == 3) {
                bossShotCounter2 = 0;
                if (bossShotMultiple2 < 10) {
                    bossShotMultiple2 ++;
                }
    
            }
            bossShotMultiple = bossShotMultiple2;
        }
        

        
        setTimeout(function () {
            clearInterval(repeatBossShot);
        }, 100 * (bossShotMultiple))



    }







    

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

                enemies[i].health = (playerShip.primaryDamage * 15)

            }
            else if (source.indexOf("boss") != -1) {
                if (totalRounds >= 70) {
                    enemies[i].health = healthScaling * 10;
                }
            }
        }

    }
}

// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                           Add Health to Player, Move Player, Stop Player
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function addHealth(health) {
    if (playerShip.health < maximumHP) {
        playerShip.health += health
    }
    if (playerShip.health > maximumHP) {
        playerShip.health -= (playerShip.health - maximumHP);
    }

}
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








// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                           Main Menu Button Listeners and functions
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************

$(".startButton").click(function () {

    $(".mainMenu").slideToggle(1000);
    setTimeout(function () { startGame(); }, 1000);
});
$(".restartButton").click(function () {

    toggleDeathScreen();
    location.reload();
});
$(".returnMenu").click(function () {
    toggleDeathScreen();
    location.reload();


});
$(".controlButton").click(function(){
    $(".controls").slideToggle();
})
$(".objectivesButton").click(function(){
    $(".objectives").slideToggle();
})
function toggleDeathScreen() {
    $(".scoreDeath").text("Score: " + playerShip.score);
    $(".roundDeath").text("Rounds Beaten: " + totalRounds);
    $(".deathScreen").toggle(500);

}