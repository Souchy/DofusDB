public static function targetPassmaskLetterExclusion(fighterCaster:HaxeFighter, fighterAffected:HaxeFighter, fighterTarget:HaxeFighter, fightContext:FightContext, mask:String, masks:Array, throughPortal:Boolean, affectsCaster:Boolean) : Boolean
      {
         var value:* = null as Object;
         var result:* = false;
         var percentLifePoints:Number = NaN;
         var maskIndex1:* = 0;
         var maskIndex2:int = 0;
         var masksLength:int = 0;
         var maskIndex3:int = 0;
         var caster:HaxeFighter = fighterCaster;
         var index:int = !!affectsCaster ? 1 : 0;
         switch(mask.length)
         {
            case 0:
            case 1:
               value = 0;
               break;
            default:
               value = Std.parseInt(mask.substring(index + 1));
         }
         var maskLetter:String = mask.charAt(index);
         if(maskLetter == "B")
         {
            result = Boolean(fighterAffected.playerType == PlayerTypeEnum.HUMAN && fighterAffected.breed == value);
         }
         else if(maskLetter == "E")
         {
            result = Boolean(fighterAffected.hasState(value));
         }
         else if(maskLetter == "F")
         {
            result = Boolean(fighterAffected.playerType != PlayerTypeEnum.HUMAN && fighterAffected.breed == value);
         }
         else if(maskLetter == "K")
         {
            result = Boolean(!!fighterAffected.hasState(8) && caster.getCarried(fightContext) == fighterAffected || fighterAffected.pendingEffects.filter(function(fighterCaster:EffectOutput):Boolean
            {
               return fighterCaster.throwedBy == caster.id;
            }).length > 0);
         }
         else if(maskLetter == "P")
         {
            result = Boolean(fighterAffected.id == caster.id || !!fighterAffected.data.isSummon() && Number(fighterAffected.data.getSummonerId()) == caster.id || !!fighterAffected.data.isSummon() && Number(caster.data.getSummonerId()) == Number(fighterAffected.data.getSummonerId()) || !!caster.data.isSummon() && Number(caster.data.getSummonerId()) == fighterAffected.id);
         }
         else if(maskLetter == "Q")
         {
            result = int(fightContext.getFighterCurrentSummonCount(fighterAffected)) >= int(fighterAffected.data.getCharacteristicValue(26));
         }
         else if(maskLetter == "R")
         {
            result = Boolean(throughPortal);
         }
         else if(maskLetter == "T")
         {
            result = Boolean(fighterAffected.wasTelefraggedThisTurn());
         }
         else if(maskLetter == "U")
         {
            result = Boolean(fighterAffected.isAppearing());
         }
         else if(maskLetter == "V")
         {
            percentLifePoints = fighterAffected.getPendingLifePoints().min / int(fighterAffected.data.getMaxHealthPoints()) * 100;
            result = percentLifePoints <= value;
         }
         else if(maskLetter == "W")
         {
            result = Boolean(fighterAffected.wasTeleportedInInvalidCellThisTurn(fightContext));
         }
         else if(maskLetter == "Z")
         {
            result = Boolean(fighterAffected.playerType == PlayerTypeEnum.SIDEKICK && fighterAffected.breed == value);
         }
         else if(maskLetter == "b")
         {
            result = Boolean(fighterAffected.playerType != PlayerTypeEnum.HUMAN || fighterAffected.breed != value);
         }
         else if(maskLetter == "e")
         {
            result = !fighterAffected.hasState(value);
         }
         else if(maskLetter == "f")
         {
            result = Boolean(fighterAffected.playerType == PlayerTypeEnum.HUMAN || fighterAffected.breed != value);
         }
         else
         {
            if(maskLetter != "O")
            {
               if(maskLetter != "o")
               {
                  if(maskLetter == "p")
                  {
                     result = !(fighterAffected.id == caster.id || !!fighterAffected.data.isSummon() && Number(fighterAffected.data.getSummonerId()) == caster.id || !!fighterAffected.data.isSummon() && Number(caster.data.getSummonerId()) == Number(fighterAffected.data.getSummonerId()) || !!caster.data.isSummon() && Number(caster.data.getSummonerId()) == fighterAffected.id);
                  }
                  else if(maskLetter == "q")
                  {
                     result = int(fightContext.getFighterCurrentSummonCount(fighterAffected)) < int(fighterAffected.data.getCharacteristicValue(26));
                  }
                  else if(maskLetter == "r")
                  {
                     result = !throughPortal;
                  }
                  else if(maskLetter == "v")
                  {
                     percentLifePoints = fighterAffected.getPendingLifePoints().min / int(fighterAffected.data.getMaxHealthPoints()) * 100;
                     result = percentLifePoints > value;
                  }
                  else if(maskLetter == "z")
                  {
                     result = Boolean(fighterAffected.playerType != PlayerTypeEnum.SIDEKICK || fighterAffected.breed != value);
                  }
               }
               §§goto(addr475);
            }
            result = Boolean(fighterTarget != null && fighterAffected.id == fighterTarget.id);
         }
         addr475:
         if(SpellManager.maskIsOneOfCondition(mask))
         {
            maskIndex1 = int(masks.indexOf(mask)) + 1;
            if(result)
            {
               maskIndex2 = maskIndex1;
               masksLength = masks.length;
               while(maskIndex2 < masksLength)
               {
                  maskIndex3 = maskIndex2++;
                  if(masks[maskIndex3].charCodeAt(index) == mask.charCodeAt(index))
                  {
                     masks[maskIndex3] = " ";
                  }
               }
            }
            else
            {
               maskIndex2 = maskIndex1;
               masksLength = masks.length;
               while(maskIndex2 < masksLength)
               {
                  maskIndex3 = maskIndex2++;
                  if(masks[maskIndex3].charCodeAt(index) == mask.charCodeAt(index))
                  {
                     result = true;
                     break;
                  }
               }
            }
         }
         return result;
      }
