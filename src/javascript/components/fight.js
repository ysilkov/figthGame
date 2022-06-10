import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {

    const healthBarsContainer = document.getElementsByClassName('arena___health-bar');
    const healthBars = [ ...healthBarsContainer ];
    const statusInfo = {
      block: false,  
      currentHealth: 100,
      timeOfCrit: Date.now(),
      critInput: []
    }

    const figtherLeft = { 
      ...firstFighter, 
      ...statusInfo, 
      healthBar: healthBars[0], 
      position: 'left'
    }

    const figtherRight = { 
      ...secondFighter, 
      ...statusInfo, 
      healthBar: healthBars[1], 
      position: 'right'
    }

    function showStatus(fighter) {
      if(document.getElementById(`${fighter.position}-status-marker`)) {
        document.getElementById(`${fighter.position}-status-marker`).remove();
      }
    }

    function attackRelease(attacker, defender) {
      if(attacker.block) {
        showStatus(attacker);
        return void 0;
      }

      if(defender.block) {
        showStatus(defender);
        return void 0;
      }

      const totalDamage = getDamage(attacker, defender);

      if(!totalDamage) {
        showStatus(attacker);
        return void 0;
      }

      if(attacker.critInput.length === 3) {
        showStatus(attacker);
      }

      showStatus(defender, `-${totalDamage.toFixed(1)}`);
      defender.currentHealth = defender.currentHealth - totalDamage / defender.health * 100;
      if(defender.currentHealth < 0) {
        resolve(attacker);
      }

      defender.healthBar.style.width = `${defender.currentHealth}%`;
    }

    function critShock(fighter) {
      const currentTime = Date.now();
      fighter.block = false;

      if(currentTime - fighter.timeOfCrit < 10000) {
        return false;
      }

      if(!fighter.critInput.includes(event.code)) {
        fighter.critInput.push(event.code);
      }

      if(fighter.critInput.length === 3) {
        fighter.timeOfCrit = currentTime;
        return true;
      }
      
    }
    
     
    function onDown(event) {
      if(!event.repeat) {
        switch(event.code) {
          case controls.PlayerOneAttack: {
            attackRelease(figtherLeft, figtherRight);
            break;
          }

          case controls.PlayerTwoAttack: {
            attackRelease(figtherRight, figtherLeft);
            break;
          }

          case controls.PlayerOneBlock: {
            figtherLeft.block = true;
            break;
          }

          case controls.PlayerTwoBlock: {
            figtherRight.block = true;
            break;
          }
          case controls.PlayerTwoBlock: {
            figtherRight.block = true;
            break;
          }

        }

        if(controls.PlayerOneCriticalHitCombination.includes(event.code)) {
          critShock(figtherLeft) ? attackRelease(figtherLeft, figtherRight) : null;
        }

        if(controls.PlayerTwoCriticalHitCombination.includes(event.code)) {
          critShock(figtherRight) ? attackRelease(figtherRight, figtherLeft) : null;
        }
      }
    }

    function onUp(event) {
      switch(event.code) {
        case controls.PlayerOneBlock: figtherLeft.block = false; break;
        case controls.PlayerTwoBlock: figtherRight.block = false; break;
      }

      if(figtherLeft.critInput.includes(event.code)) {
        return figtherLeft.critInput.splice(figtherLeft.critInput.indexOf(event.code), 1);
      }

      if(figtherRight.critInput.includes(event.code)) {
        return figtherRight.critInput.splice(figtherRight.critInput.indexOf(event.code), 1);
      }
    }

    document.addEventListener('keydown', onDown);
    document.addEventListener('keyup', onUp);
  });
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
  let criticalHitChance = fighter.critInput.length === 3 ? 2 : Math.random() + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  const dodjeChance = Math.random() + 1;
  return fighter.defense * dodjeChance;
}