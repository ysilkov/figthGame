import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    let fighterLeft = {
      fighter: firstFighter,
      health: firstFighter.health,
      blockCritical: false,
      position: document.getElementById('left-fighter-indicator')
    };
    let fighterRight = {
      fighter: secondFighter,
      health: secondFighter.health,
      blockCritical: false,
      position: document.getElementById('right-fighter-indicator')
    };
  
    let clickButtom = new Set();

  document.addEventListener('keydown', (event) => {
    clickButtom.add(event.code);

    switch (event.code) {
      case controls.PlayerOneAttack:
        if (!clickButtom.has(controls.PlayerOneBlock) && !clickButtom.has(controls.PlayerTwoBlock)) {
          shock(fighterLeft, fighterRight);
        }
        if (clickButtom.has(controls.PlayerTwoBlock)) {
          showIconHit(fighterRight, 'block');
        } 
        break;
      case controls.PlayerTwoAttack:
        if (!clickButtom.has(controls.PlayerTwoBlock) && !clickButtom.has(controls.PlayerOneBlock)) {
          shock(fighterRight, fighterLeft);
        }
        if (clickButtom.has(controls.PlayerOneBlock)) {
          showIconHit(fighterLeft, 'block');
        } 
        break;
      }
    if (!fighterLeft.blockCriticalHit &&
        controls.PlayerOneCriticalHitCombination.includes(event.code) &&
        checkKeysCriticalHit(controls.PlayerOneCriticalHitCombination, clickButtom)) {
      shock(fighterLeft, fighterRight, true);
    }
    if (!fighterTwo.blockCriticalHit &&
        controls.PlayerTwoCriticalHitCombination.includes(event.code) &&
        checkKeysCriticalHit(controls.PlayerTwoCriticalHitCombination, clickButtom)) {
      shock(fighterRight, fighterLeft, true);
    }
  });

  document.addEventListener('keyup', (event) => {
    clickButtom.delete(event.code);
  });

  function shock(attacker, defender, isCritical = false) {
    let damage;
    if (isCritical) {
      damage = getCriticalDamage(attacker.fighter);
      attacker.blockCritical = true;
      setTimeout(() => {
        attacker.blockCritical = false;
      }, 10000);
    } else {
      damage = getDamage(attacker.fighter, defender.fighter);
    }
    defender.health -= damage;
    setFighterHealthBar(defender);
    if (defender.health <= 0) resolve(attacker.fighter);
  }
});
}

export function getDamage(attacker, defender) {
  const hitPower = getHitPower(attacker);
  const blockPower = getBlockPower(defender);
  let damage = hitPower - blockPower;
  damage = damage > 0 ? damage : 0;
  return damage;
}

export function getCriticalDamage(attacker) {
  const damage = attacker.attack * 2;
  return damage;
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() + 1;
  const power = fighter.attack * criticalHitChance;
  return power;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() + 1;
  const power = fighter.defense * dodgeChance;
  return power;
}

function checkKeysCriticalHit(keys, pressed) {
  for (let key of keys) {
    if (!pressed.has(key)) {
      return false;
    }
  }
  return true;
}
export function setFighterHealthBar(player) {
  let percent = (player.health * 100) / player.fighter.health;
  /* if (percent < 0) percent = 0;
  player.indicator.style.width = `${percent}%`; */
}


/* export function showIconHit(fighter, type = 'hit') {
  let cls = 'arena___health-hit';
  if (type === 'crit') cls = 'arena___health-crit';
  if (type === 'block') cls = 'arena___health-block';
  fighter.indicator.classList.add(cls);
  setTimeout(() => {
    fighter.indicator.classList.remove(cls);
  }, 200);
} */