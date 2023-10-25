const Attack_Value = 10;
const MonsterAttack_Value = 14;
const StrongAttack_Value = 17;
const healthValue = 9;
const Mode_Attack = 0;
const Mode_StrongAttack = 1;

  
function getUserValue(){
  const enteredValue = prompt(
  // to allow user to type number
  "Please enter the value of monster and player",
  "100"
);
 const parsedValue = parseInt(enteredValue);
if (isNaN(parsedValue) || parsedValue <= 0) {
  throw {
    message : "invalid userinput"                      // throw is used to customise our own error message 
  }                                                    // intentionally thrown an error to use try catch later 
}                                                        //otherwise we simply could have set the value to 100 as default
 return parsedValue;
}
let chosenMaxLife;
try {
  chosenMaxLife = getUserValue();
} catch (error) {
  console.log(error);
  chosenMaxLife= 100;
  alert('choosen value was not a number');
}
 
let monsterCurrentHealth = chosenMaxLife;
let playerCurrentHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];
const LOG_EVENT_PLAYER_ATTACK = "PLAYER ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER STRONG ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER HEAL";
const LOG_EVENT_GAME_OVER = "GAME OVER";



adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, PlayerHealth) {
  let LogEntry;
  switch (event) {
    case LOG_EVENT_PLAYER_ATTACK:
      LogEntry = {
        event: event,
        value: value,
        target: "Monster",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: PlayerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      LogEntry = {
        event: event,
        value: value,
        target: "Monster",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: PlayerHealth,
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      LogEntry = {
        event: event,
        value: value,
        target: "Player",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: PlayerHealth,
      };
      break;
      case LOG_EVENT_PLAYER_HEAL:
        LogEntry = {
          event: event,
          value: value,
          target: "Player",
          finalMonsterHealth: monsterHealth,
          finalPlayerHealth: PlayerHealth,
        };
        break;    
    case  LOG_EVENT_GAME_OVER:
      LogEntry = {
        event: event,
        value: value,
        target: "Player",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: PlayerHealth,
      };
      break;
      default:
        LogEntry = {};
  }
  // if (event === LOG_EVENT_PLAYER_ATTACK) {
  //   LogEntry = {
  //     event: event,
  //     value: value,
  //     target: "Monster",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: PlayerHealth,
  //   };
  // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   LogEntry = {
  //     event: event,
  //     value: value,
  //     target: "Monster",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: PlayerHealth,
  //   };
  // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
  //   LogEntry = {
  //     event: event,
  //     value: value,
  //     target: "Player",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: PlayerHealth,
  //   };
  // } else if (event === LOG_EVENT_PLAYER_HEAL) {
  //   LogEntry = {
  //     event: event,
  //     value: value,
  //     target: "Player",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: PlayerHealth,
  //   };
  // } else if (event === LOG_EVENT_GAME_OVER) {
  //   LogEntry = {
  //     event: event,
  //     value: value,
  //     target: "Player",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: PlayerHealth,
  //   };
  // }
  battleLog.push(LogEntry);
}

function reset() {
  monsterCurrentHealth = chosenMaxLife;
  playerCurrentHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerLife = playerCurrentHealth;
  const playerDamage = dealPlayerDamage(MonsterAttack_Value);
  playerCurrentHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    monsterCurrentHealth,
    playerCurrentHealth
  );
  if (playerCurrentHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    playerCurrentHealth = initialPlayerLife;
    alert(" you would be dead but bonus life saved you.");
    setPlayerHealth(initialPlayerLife);
  } else if (monsterCurrentHealth <= 0 && playerCurrentHealth > 0) {
    alert("You WON");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "player WON",
      monsterCurrentHealth,
      playerCurrentHealth
    );
    reset();  
  } else if (playerCurrentHealth <= 0 && monsterCurrentHealth > 0) {
    alert("you lost");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "player Lost",
      monsterCurrentHealth,
      playerCurrentHealth
    );
    reset();
  } else if (monsterCurrentHealth <= 0 && playerCurrentHealth <= 0) {
    alert("you have a draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW",
      monsterCurrentHealth,
      playerCurrentHealth
    );
    reset();
  }
}

function attackMonster(Mode) {
  const maxDamage = Mode === Mode_Attack ? Attack_Value : StrongAttack_Value; // using ternary operator
  const logEvent =
    Mode === Mode_Attack
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (Mode === Mode_Attack) {
  //   maxDamage = Attack_Value;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (Mode === Mode_StrongAttack) {
  //   maxDamage = StrongAttack_Value;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  monsterCurrentHealth -= damage;
  writeToLog(logEvent, damage, monsterCurrentHealth, playerCurrentHealth);
  endRound();
}

function attackHandler() {
  attackMonster(Mode_Attack);
}
function strongAttackHandler() {
  attackMonster(Mode_StrongAttack);
}
function Heal() {
  let healValue;
  if (playerCurrentHealth >= chosenMaxLife - healthValue) {
    alert("you can't heal more  for now");
    healValue = chosenMaxLife - playerCurrentHealth;
  } else {
    healValue = healthValue;
  }
  increasePlayerHealth(healValue);
  playerCurrentHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    monsterCurrentHealth,
    playerCurrentHealth
  );
  endRound();
}

function printLogHandler() {
  // for(let i=0; i < battleLog.length; i++){
  //   console.log(battleLog[i]);
  // }
let i =0;
  for( const logEntry of battleLog){                          //accessing element of an array ie. object
    console.log(`#${i}`);
    for(const key in logEntry){                               //accessing key and its value of an object. 
      console.log(`${key}=> ${logEntry[key]}`)
    } 
    i++;
  }
  
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", Heal);
logBtn.addEventListener("click", printLogHandler);
