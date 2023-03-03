public static function isIncludedByMask(fighterCaster:HaxeFighter, masks:Array, fighterTarget:HaxeFighter) : Boolean
{
   var isSameTeam:* = false;
   var isSummon:Boolean = false;
   var index:int = 0;
   var mask:* = null as String;
   var isSameId:* = fighterTarget.id == fighterCaster.id;
   if(isSameId)
   {
      if(int(masks.indexOf("c")) != -1 || int(masks.indexOf("C")) != -1 || int(masks.indexOf("a")) != -1)
      {
         return true;
      }
   }
   else
   {
      isSameTeam = fighterCaster.teamId == fighterTarget.teamId;
      isSummon = fighterTarget.data.isSummon();
      index = 0;
      while(index < int(masks.length))
      {
         mask = masks[index];
         index++;
         if(mask == "A")
         {
            if(!isSameTeam)
               return true;
         }
         else if(mask == "D")
         {
            if(!isSameTeam && fighterTarget.playerType == PlayerTypeEnum.SIDEKICK)
               return true;
         }
         else if(mask == "H")
         {
            if(!isSameTeam && fighterTarget.playerType == PlayerTypeEnum.HUMAN && !isSummon)
               return true;
         }
         else if(mask == "I")
         {
            if(!isSameTeam && fighterTarget.playerType != PlayerTypeEnum.SIDEKICK && isSummon && !fighterTarget.isStaticElement)
               return true;
         }
         else if(mask == "J")
         {
            if(!isSameTeam && fighterTarget.playerType != PlayerTypeEnum.SIDEKICK && isSummon)
               return true;
         }
         else if(mask == "L")
         {
            if(!isSameTeam && (fighterTarget.playerType == PlayerTypeEnum.HUMAN && !isSummon || fighterTarget.playerType == PlayerTypeEnum.SIDEKICK))
               return true;
         }
         else if(mask == "M")
         {
            if(!isSameTeam && fighterTarget.playerType != PlayerTypeEnum.HUMAN && !isSummon && !fighterTarget.isStaticElement)
               return true;
         }
         else if(mask == "S")
         {
            if(!isSameTeam && fighterTarget.playerType != PlayerTypeEnum.SIDEKICK && isSummon && fighterTarget.isStaticElement)
               return true;
         }
         else
         {
            if(mask != "a")
            {
               if(mask != "g")
               {
                  if(mask == "d")
                  {
                     if(!!isSameTeam && fighterTarget.playerType == PlayerTypeEnum.SIDEKICK)
                     {
                        return true;
                     }
                  }
                  else if(mask == "h")
                  {
                     if(!!isSameTeam && fighterTarget.playerType == PlayerTypeEnum.HUMAN && !isSummon)
                     {
                        return true;
                     }
                  }
                  else if(mask == "i")
                  {
                     if(!!isSameTeam && fighterTarget.playerType != PlayerTypeEnum.SIDEKICK && isSummon && !fighterTarget.isStaticElement)
                     {
                        return true;
                     }
                  }
                  else if(mask == "j")
                  {
                     if(!!isSameTeam && fighterTarget.playerType != PlayerTypeEnum.SIDEKICK && isSummon)
                     {
                        return true;
                     }
                  }
                  else if(mask == "l")
                  {
                     if(!!isSameTeam && (fighterTarget.playerType == PlayerTypeEnum.HUMAN && !isSummon || fighterTarget.playerType == PlayerTypeEnum.SIDEKICK))
                     {
                        return true;
                     }
                  }
                  else if(mask == "m")
                  {
                     if(!!isSameTeam && fighterTarget.playerType != PlayerTypeEnum.HUMAN && !isSummon && !fighterTarget.isStaticElement)
                     {
                        return true;
                     }
                  }
                  else if(mask == "s")
                  {
                     if(!!isSameTeam && fighterTarget.playerType != PlayerTypeEnum.SIDEKICK && isSummon && fighterTarget.isStaticElement)
                     {
                        return true;
                     }
                  }
                  continue;
               }
            }
            if(isSameTeam)
            {
               return true;
            }
         }
      }
   }
   return false;
}
