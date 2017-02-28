Game.buyPower = function(power) {
  if(Game.p_SkillPoints > 0) {
    var selectionLevel = Game.powerLevel(power);
    var canUpgrade = true;
    switch(power) {
      case Game.SKILL_DISASSEMBLY:
      case Game.SKILL_TERMINAL_ILLNESS:
      case Game.SKILL_OVERCHARGE:
      case Game.SKILL_UNDERMINE:
      case Game.SKILL_HOLD_THE_LINE:
      case Game.SKILL_STAND_YOUR_GROUND:
      case Game.SKILL_ARTFUL_DODGER:
      case Game.SKILL_EYE_FOR_AN_EYE:
      case Game.SKILL_ABSORPTION_SHIELD:
      case Game.SKILL_REFLECTIVE_SHIELD:
      case Game.SKILL_RECLAIMED_KNOWLEDGE:
      // case Game.BOOST_HEALINGPOTION:
      // case Game.BOOST_DEBUFFPOTION:
        if(selectionLevel === 1) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
        break;
      default:
        if(selectionLevel === 5) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
    }
    if(canUpgrade) {
      switch(power) {
        case Game.SKILL_ABSORPTION_SHIELD:
          // Absorption Shield
          if(Game.powerLevel(Game.SKILL_DIVINE_SHIELD) < 5) {
            Game.toastNotification("You need maximum level in Divine Shield to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.SKILL_REFLECTIVE_SHIELD) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Reflective Shield.");
            canUpgrade = false;
          }
          break;
        case Game.SKILL_REFLECTIVE_SHIELD:
          // Reflective Shield
          if(Game.powerLevel(Game.SKILL_DIVINE_SHIELD) < 5) {
            Game.toastNotification("You need maximum level in Divine Shield to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.SKILL_ABSORPTION_SHIELD) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Absorption Shield.");
            canUpgrade = false;
          }
          break;
      }
    }
    if(canUpgrade) {
      if(selectionLevel === 0) {
        Game.p_Powers.push(new Array(power, 1));
      }
      else {
        for(var x = 0; x < Game.p_Powers.length; x++) {
          if(Game.p_Powers[x][0] === power) {
            Game.p_Powers[x][1]++;
          }
        }
      }
      Game.p_SkillPoints--;
      Game.updatePowers = true;
    }
  }
  Game.badgeCheck(Game.BADGE_POWER); // Unlimited Power!
  Game.drawActivePanel();
}
Game.getPowerLevelCap = function(power) {
  switch(power) {
    case Game.SKILL_PICKPOCKET:
    case Game.SKILL_CAVITY_SEARCH:
    case Game.SKILL_BARTERING:
    case Game.SKILL_THOROUGH_LOOTING:
    case Game.SKILL_HAGGLING:
    case Game.SKILL_FIVE_FINGER_DISCOUNT:
    case Game.SKILL_PATIENCE_AND_DISCIPLINE:
    case Game.SKILL_BOUNTIFUL_BAGS:
    case Game.SKILL_LUCK_OF_THE_DRAW:
    case Game.SKILL_FAST_LEARNER:
    case Game.SKILL_PROPER_CARE:
    case Game.SKILL_MASTER_TINKERER:
    case Game.SKILL_LUCKY_STAR:
    case Game.SKILL_HIGH_MAINTENANCE:
    case Game.SKILL_HANGING_BY_A_THREAD:
    case Game.SKILL_DEADLY_FORCE:
    case Game.SKILL_NIMBLE_FINGERS:
    case Game.SKILL_KEEN_EYE:
    case Game.SKILL_FLURRY:
    case Game.SKILL_KEENER_EYE:
    case Game.SKILL_EXPOSE_WEAKNESS:
    case Game.SKILL_EMPOWERED_FLURRY:
    case Game.SKILL_SNEAK_ATTACK:
    case Game.SKILL_PRESS_THE_ADVANTAGE:
    case Game.SKILL_WILD_SWINGS:
    case Game.SKILL_ADRENALINE_RUSH:
    case Game.SKILL_EXECUTE:
    case Game.SKILL_TURN_THE_TABLES:
    case Game.SKILL_ARMOUR_MASTERY:
    case Game.SKILL_ANCESTRAL_FORTITUDE:
    case Game.SKILL_SURVIVAL_INSTINCTS:
    case Game.SKILL_SHIELD_WALL:
    case Game.SKILL_SHIELD_CRUSH:
    case Game.SKILL_VICTORY_RUSH:
    case Game.SKILL_VENGEANCE:
    case Game.SKILL_LAST_BASTION:
    case Game.SKILL_BLADED_ARMOUR:
    case Game.SKILL_DIVINE_SHIELD:
    case Game.SKILL_SECOND_WIND:
    case Game.SKILL_RIPOSTE:
      return 5;
    case Game.SKILL_DISASSEMBLY:
    case Game.SKILL_TERMINAL_ILLNESS:
    case Game.SKILL_OVERCHARGE:
    case Game.SKILL_UNDERMINE:
    case Game.SKILL_HOLD_THE_LINE:
    case Game.SKILL_STAND_YOUR_GROUND:
    case Game.SKILL_ARTFUL_DODGER:
    case Game.SKILL_EYE_FOR_AN_EYE:
    case Game.SKILL_ABSORPTION_SHIELD:
    case Game.SKILL_REFLECTIVE_SHIELD:
    case Game.SKILL_RECLAIMED_KNOWLEDGE:
    // case Game.BOOST_HEALINGPOTION:
    // case Game.BOOST_DEBUFFPOTION:
      return 1;
    default:
      return 0;
  }
}
Game.getPowerName = function(power) {
  for(var x = 0; x < Game.SKILL_LIST.length; x++) {
    if(Game.SKILL_LIST[x][2] == power) return Game.SKILL_LIST[x][0];
  }
}
Game.getPowerDesc = function(power) {
  for(var x = 0; x < Game.SKILL_LIST.length; x++) {
    if(Game.SKILL_LIST[x][2] == power) return Game.SKILL_LIST[x][1];
  }
}
Game.resetPowers = function() {
  var totalSpent = 0;
  for(var a = 0; a < Game.p_Powers.length; a++) {
    totalSpent += Game.p_Powers[a][1];
  }
  var scrapCost = Math.ceil((totalSpent + Game.p_SkillPoints)/3);
  if(Game.p_Scrap < scrapCost) {
    Game.toastNotification("You need " + scrapCost + " scrap to reset your powers.");
    return;
  }
  if(confirm("Are you sure you wish to reset your power point allocation? \n\nThis will cost a total of " + scrapCost + " scrap and cannot be undone.")) {
    Game.p_Powers = [];
    Game.p_SkillPoints += totalSpent;
    Game.p_Scrap -= scrapCost;
    Game.toastNotification("Power points have been reset.");
    Game.updatePowers = true;
    Game.TRACK_RESETS++;
    Game.badgeCheck(Game.BADGE_RESETS); // Indecisive
    Game.drawActivePanel();
  }
}

document.getElementById("loadedPowers").style.display = "";