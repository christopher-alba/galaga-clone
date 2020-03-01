
// global variables
let enemyID = 0;
var enemies = [];
let enemiesLeft = 2;
let roundCounter = 0;
let currentBossHP = 20;
let currentEnemySmallDamage = 1;
let chanceToFire = 10;
let bulletIndex = 0;
let bossBulletIndex = 0;
let primaryIndex = 0;
let gameOn = true;

var sensor1;
var sensor2;
// Objects
var playerShip = {
    health: 10,
    experience: 0,
    powerups: {

    },
    primary: true,
    secondary: true,
    tertiary: true,
    ultimate: true,
    primaryDamage: 1,
    secondaryDamage:4,
    tertiaryDamage:16,
    ultimateDamage:10,
    score: 0,


}

var boss = {
    health: 20,
    spawned: false,
}






// functions
function primaryHit(bulletBox){
    let gameArena = document.getElementsByClassName("playingField")[0];
    let bulletExplosion = document.createElement("div");
    bulletExplosion.classList.add("primaryExplode");
    
    bulletExplosion.style.top = bulletBox.top + "px";
    bulletExplosion.style.left = (bulletBox.left + 2 ) + "px";
    gameArena.appendChild(bulletExplosion);
    $(".primaryExplode").animate({top:"50px"});
    
    
    setTimeout(function(){
        bulletExplosion.remove()
    },200);
}
function checkEnemyHit(){
    let bullets = document.getElementsByClassName("primary");
    let gameArena = document.getElementsByClassName("playingField")[0];
    
    
    
    for(let i = 0; i < bullets.length; i++){
        let bullet = bullets[i];
        let bulletBox = bullet.getBoundingClientRect();
        // check if bullets hit large boss

        if(bullet != undefined && boss.spawned == true){
           
            
            let enemyBoss = document.getElementsByClassName("boss")[0];
            var enemyBossBox;
            if(enemyBoss != undefined){
                enemyBossBox = enemyBoss.getBoundingClientRect();
                if(bulletBox.top < enemyBossBox.top+enemyBossBox.height && bulletBox.left  > enemyBossBox.left && bulletBox.right < enemyBossBox.right){
                    //console.log("enemy boss hit");
                    bullet.remove();
                    primaryHit(bulletBox);
                    boss.health--;
    
                    
                }
                if(boss.health <= 0){
                    enemyBoss.remove();
                    let bossDeath = document.createElement("div");
                    bossDeath.classList.add("bossDeath");
                    bossDeath.style.top = enemyBossBox.top + "px";
                    bossDeath.style.left = enemyBossBox.left + "px";
                    gameArena.appendChild(bossDeath);
                    setTimeout(function(){
                        bossDeath.remove();
                    },1000)
                    
                    boss.spawned = false;
                    currentBossHP += 20;
                    boss.health = currentBossHP;
                    roundCounter = 0;
                }
            }
             
        
            
           
        }
       
        // check if bullets hit small enemies
        for(let j = 0; j < enemies.length; j++){
            let enemyShip = enemies[j].reference;
            if(bullet != undefined && enemyShip != "empty"){
                let bulletBox = bullet.getBoundingClientRect();
                let enemyShipBox = enemyShip.getBoundingClientRect();

                //if primary weapon hit
                if(bulletBox.top < enemyShipBox.top + enemyShipBox.height && bulletBox.top + bulletBox.height > enemyShipBox.top && bulletBox.left  > enemyShipBox.left && bulletBox.right < enemyShipBox.right){
                //console.log("enemy ship hit");
                 enemies[j].health-= playerShip.primaryDamage;
                 bullet.remove();
                 primaryHit(bulletBox);
                 
                 }
             }
             
             if(enemies[j].health <= 0){

                if(enemyShip != "empty"){
                    
                    let enemyDeath = document.createElement("div");
                    let enemyShipBox = enemyShip.getBoundingClientRect();
                    enemyDeath.classList.add("enemyDeath");
                    enemyDeath.style.top = enemyShipBox.top + "px";
                    enemyDeath.style.left = enemyShipBox.left + "px";
                    gameArena.appendChild(enemyDeath);

                    setTimeout(function(){
                        enemyDeath.remove();
                    },1000)

                    enemyShip.remove();
                    enemiesLeft--;
                    console.log("enemies left: " + enemiesLeft);
                    
                }
                 enemies[j].reference = "empty";
                 
             }
        }
        
    }
    
}
function checkPlayerHit(){
    
    let playerBox = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
    let enemyProjectiles = document.getElementsByClassName("enemyProjectile");

    for(let i = 0; i < enemyProjectiles.length; i++){
        let projectileBox = enemyProjectiles[i].getBoundingClientRect();

        if(projectileBox.top + projectileBox.height > playerBox.top && projectileBox.top < playerBox.top + playerBox.height && projectileBox.left > playerBox.left + playerBox.width/3 && projectileBox.right < playerBox.left + playerBox.width - playerBox.width/3 ){
            console.log("you have been hit");
            primaryHit(projectileBox);
            enemyProjectiles[i].remove();
            playerShip.health--;
            console.log(playerShip.health);
            
            
        }
    }
    if(playerShip.health <= 0){
        endGame();
     
    }

}
function endGame(){
    let playerShip = document.getElementsByClassName("playerShip")[0];
    let enemyShips =  $(".enemyShip");
    let boss = document.getElementsByClassName("boss")[0];

    for(let i = 0; i < enemyShips.length; i++){
        if(enemyShips[i] != undefined){
            enemyShips[i].remove();
        }
    }
    if(playerShip != undefined ){
        playerShip.remove();
    }
    if(boss != undefined){
        boss.remove();
    }
    clearInterval(sensor1);
    clearInterval(sensor2);
    setTimeout(function(){
        $(".mainMenu").slideToggle(1000);
    },1000)
    
    gameOn = false;
    resetStats();
}
function resetStats(){
    // global variables
enemyID = 0;
enemies = [];

enemiesLeft = 2;
roundCounter = 0;
currentBossHP = 20;
currentEnemySmallDamage = 1;
chanceToFire = 10;
bulletIndex = 0;
bossBulletIndex = 0;
primaryIndex = 0;

// Objects
playerShip = {
    health: 10,
    experience: 0,
    powerups: {

    },
    primary: true,
    secondary: true,
    tertiary: true,
    ultimate: true,
    primaryDamage: 1,
    secondaryDamage:4,
    tertiaryDamage:16,
    ultimateDamage:10,
    score: 0,


}

boss = {
    health: 20,
    spawned: false,
}
}
function startGame(){
    gameOn = true;
    displayPlayer();
    displayGUI();
    let numberOfEnemies = 2;
    displayEnemy(numberOfEnemies);

    
    sensor1 = setInterval(function(){
    if(gameOn == true){
        deleteEmpty();
        checkEnemyHit();
        checkPlayerHit();
        if(enemiesLeft == 0){
    
            
            
            
    
            if(roundCounter == 1){
                enemiesLeft = numberOfEnemies;
                currentEnemySmallDamage++;
                roundCounter++;
                displayBoss();
                displayEnemy(numberOfEnemies);
                boss.spawned = true;
                console.log(boss.health);
                
                
            }
            else{
                if(boss.spawned == false && roundCounter < 2){
                    roundCounter++;
                    numberOfEnemies += 2;
                    enemiesLeft = numberOfEnemies;
                    displayEnemy(numberOfEnemies);
                }
                
            
                
            }
            
        }
    }
    
        
        
    },45);

    sensor2 = setInterval(function(){
        if(gameOn == true){
            enemyShots();
        }
        
        
       
    },2000);
}
function enemyShots(){

   
    
    var gameArena = document.getElementsByClassName("playingField")[0];
    //get all enemy planes
    let enemyPlanes = document.getElementsByClassName("enemyShip");
   
    // console.log(enemyPlanes);
    for(let i = 0; i < enemyPlanes.length; i++){
        if(Math.random()*10 <= chanceToFire){
            let enemyPlane = enemyPlanes[i];
            // console.log(enemyPlane);
            
            let enemyPlaneBox = enemyPlane.getBoundingClientRect();

            let enemyBullet = document.createElement("div");
            enemyBullet.classList.add("enemyBullet");
            enemyBullet.classList.add("enemyProjectile");
            enemyBullet.classList.add("enemybullet"+ bulletIndex);
            
            
          
            enemyBullet.style.top = (enemyPlaneBox.top + 50) + "px";
            enemyBullet.style.left = (enemyPlaneBox.left + 75/2) + "px";
            // console.log(enemyBullet);
            // console.log(enemyPlane);
            
            
        
            gameArena.appendChild(enemyBullet);
            $(".enemybullet"+bulletIndex).animate({top:( enemyPlaneBox.top + window.innerHeight)+ "px"},{duration:6000, queue: false});
            setTimeout(function(){
                // console.log( $(".enemybullet"+bulletIndex));
                
            enemyBullet.remove();
            },6000);
            bulletIndex++;
            
            
           
        }
    }


    if(document.getElementsByClassName("boss")[0] != undefined){
       
        
        let bossBox = document.getElementsByClassName("boss")[0].getBoundingClientRect();
        let bossBulletPosition = 0;
        let playerBox = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();
        for(let i = 0; i < 6; i++){
            let bossBullet = document.createElement("div");
            // console.log(bossBullet);
            
            bossBullet.classList.add("bossBullet");
            bossBullet.classList.add("enemyProjectile");
            bossBullet.classList.add("bossbullet" + bossBulletIndex);
            
            bossBullet.style.top = (bossBox.top + 100) + "px"
            bossBullet.style.left = (bossBox.left + bossBulletPosition) + "px";
            bossBulletPosition += 300/6;
            gameArena.appendChild(bossBullet);

         
            $(".bossbullet"+bossBulletIndex).animate({top:(playerBox.top + 20) + "px"},{duration:6000, queue: false});
            $(".bossbullet"+bossBulletIndex).animate({left:(playerBox.left + 75/2) + "px"},{duration:6000, queue: false});
            bossBulletIndex++;
            setTimeout(function(){
                bossBullet.remove();
            },6000);
        }
    }

    

    
    

    
    //generate a random number between 1 and 10, each plane starts off with 100% chance of firing, the more planes, the lower the chance of firing
    
    //if within the range fire shots
        //for each plane that can fire a shot, generate a small projectile using a div container

}


function makeEnemies(numberOfEnemies){
    for(let i = 0; i < numberOfEnemies; i++){
        enemies.push(new Enemy());
    }
}
function deleteEmpty(){
    for(let i = 0; i < enemies.length; i++){
        if(enemies[i].reference == "empty"){
            enemies.splice(i,1);
        }
    }
}
function displayBoss(){
    let enemyBoss = document.createElement("img");
    enemyBoss.src = "images/boss.png";
    enemyBoss.classList.add("boss");

    let gameArena = document.getElementsByClassName("playingField")[0];
        gameArena.appendChild(enemyBoss);
}

function displayEnemy(numberOfEnemies){


    

    for(let i = 0; i < numberOfEnemies; i++){

        

        let enemyShip = document.createElement("img");
        enemyShip.src = "images/enemyShip.png";
        enemyShip.classList.add("enemyShip");
        enemyShip.classList.add(enemyID);
        enemyID++;
        
        enemyShip.style.left = (Math.random()*(window.innerWidth - 400)+200) + "px"; 
        enemyShip.style.top = (Math.random()*(100)+50) + "px"; 
       //console.log(enemyShip.style.left);
        
        
        
        let gameArena = document.getElementsByClassName("playingField")[0];
        gameArena.appendChild(enemyShip);

    }
  
    makeEnemies(numberOfEnemies);
    
}
function Enemy(){
    this.health = 5;
    this.damage = currentEnemySmallDamage;

    // get all displayed enemy ships
    let allEnemies = $(".enemyShip");
   //console.log(allEnemies);
    
    // check through each enemy in enemies array if they have the reference
  
    let possibleEnemies = allEnemies;
    for(let i = 0; i < enemies.length; i++){
        for(let j = 0; j < allEnemies.length; j++){

            if(enemies[i].reference == allEnemies[j]){

                possibleEnemies.splice(j, 1,"empty");
                
            }

        }
    }
    //console.log(possibleEnemies);
    
    // if they don't have the reference, add reference to this enemy
    for(let i = 0; i < possibleEnemies.length; i++){
        if(possibleEnemies[i] != "empty"){
            this.reference = possibleEnemies[i];
            //console.log("testing ");
            
        }
    }
    //console.log("Enemies: ");
    
    //console.log(enemies);
    
    
}
function displayPlayer(){

    let gameArena = document.getElementsByClassName("playingField")[0];
    let playerShip = document.createElement("img");
    playerShip.src = "images/playerShip.png"
    playerShip.classList.add("playerShip");
    gameArena.appendChild(playerShip);

}
// ship weapons
function firePrimary(){
    if(playerShip.primary == true){
        
        //console.log("firing primary");
        var primary = document.createElement("div"); 

        primary.classList.add("primary");     
        primary.classList.add("primary" + primaryIndex);       
        
        let ship = document.getElementsByClassName("playerShip")[0].getBoundingClientRect();

        primary.style.position = "absolute";
        
        primary.style.top = (ship.top ) + "px";
        primary.style.left = (ship.left + 75/2) + "px";

        var gameArena = document.getElementsByClassName("playingField")[0];
                          
        gameArena.appendChild(primary);

        $(".primary" + primaryIndex).animate({top: "0px"},{ duration: 500, queue: false });
        primaryIndex++;

        setTimeout(function(){   primary.remove();   }, 500);
        
        
        //fire primary
        playerShip.primary = false;
        
        setTimeout(function(){   playerShip.primary = true; }, 100);
    }
}
function fireSecondary(){
    if(playerShip.secondary == true){
        //console.log("firing secondary");
        //fire secondary
        playerShip.secondary = false;

        setTimeout(function(){   playerShip.secondary = true; }, 10000);
    }
}
function fireTertiary(){
    if(playerShip.tertiary == true){
        //console.log("firing tertiary");
        //fire tertiary
        playerShip.tertiary = false;

        setTimeout(function(){   playerShip.tertiary = true; }, 25000);
    }
}
function fireUltimate(){
    if(playerShip.ultimate == true){
        //console.log("firing ultimate");
        //fire ultimate
        playerShip.ultimate = false;

        setTimeout(function(){   playerShip.ultimate = true; }, 60000);
    }
}
function moveShip(keyPressed){

   
    if(gameOn == true){
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

if(ship.top <= 100){
    stopUp = true;
}
if(ship.top >= window.innerHeight - 150){
    stopDown = true;
}
if( ship.right >= window.innerWidth - 100){
    stopRight = true;
}
if(ship.left <= 100){
    stopLeft = true;
}




switch (keyPressed) {
    case 37:
        // alert('Left key pressed');
        if(stopLeft == false){
            $(".playerShip").animate({left:'-=55px'},{ duration: 100, queue: false });
        }
        
        break;
    case 38:
        if(stopUp == false){
            $(".playerShip").animate({top:'-=55px'},{ duration: 100, queue: false });
        }
        // alert('Up key pressed');
        
        break;
    case 39:

        if(stopRight == false){
            $(".playerShip").animate({left:'+=55px'},{ duration: 100, queue: false });
        }
        //alert('Right key pressed');
        
            
        break;
    case 40:
        if(stopDown == false){
            $(".playerShip").animate({top: '+=55px'},{ duration: 100, queue: false });
        }
            //alert('Down key pressed');
        
        break;
}

    }
    
   


}

$(document).keydown(function(event){

    
    if(gameOn == true){
        let keypressed = event.keyCode
        if(keypressed == 81){
            firePrimary();
        }
        if(keypressed == 37 || keypressed == 38 || keypressed == 39 || keypressed == 40){
            moveShip(event.keyCode);
        }
        if(keypressed == 87){
            fireSecondary();
        }
        if(keypressed == 69){
            fireTertiary();
        }
        if(keypressed == 82){
            fireUltimate();
        }
        
    }
    
    
   
});

$(".startButton").click(function(){
    
    $(".mainMenu").slideToggle(1000);
    setTimeout(function(){ startGame();},1000);
})