/*import { db } from "../db";
import { ActionIds } from "./ActionIds";

const UNKNOWN_NAME: string = "???";
export class EffectInstance {

    private static db: db;

    private static getEmoticonName(id: number): string {
        //    var o:Emoticon = Emoticon.getEmoticonById(id);
        //    return !!o ? o.name : UNKNOWN_NAME;
        return "emote???";
    }

    private static getItemTypeName(id: number): string {
        // var o: ItemType = ItemType.getItemTypeById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "item???"
    }

    private static getMonsterName(id: number): string {
        // var o: Monster = Monster.getMonsterById(id);
        // return !!o ? o.name : I18n.getUiText("ui.effect.unknownMonster");
        let monster = EffectInstance.db.jsonSummons[id];
        return EffectInstance.db.getI18n(monster.nameId);
    }

    private static getCompanionName(id: number): string {
        // var o: Companion = Companion.getCompanionById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "item???"
    }

    private static getMonsterGrade(pId: number, pGrade: number): string {
        // var m: Monster = Monster.getMonsterById(pId);
        // return !!m ? m.getMonsterGrade(pGrade).level.toString() : UNKNOWN_NAME;
        let monster = EffectInstance.db.jsonSummons[pId];
        return monster.grades[pGrade].level.toString();
    }

    private static getSpellName(id: number): string {
        // var o: Spell = Spell.getSpellById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        let spell = EffectInstance.db.jsonSpells[id];
        return EffectInstance.db.getI18n(spell.nameId);
    }

    private static getSpellLevelName(id: number): string {
        // var o: SpellLevel = SpellLevel.getLevelById(id);
        // var name: string = !!o ? this.getSpellName(o.spellId) : UNKNOWN_NAME;
        // return !!o ? this.getSpellName(o.spellId) : UNKNOWN_NAME;
        let spell = EffectInstance.db.jsonSpells[id];
        return EffectInstance.db.getI18n(spell.nameId);
    }

    private static getLegendaryPowerCategoryName(id: number): string {
        // var powerCategory: LegendaryPowerCategory = LegendaryPowerCategory.getLegendaryPowerCategoryById(id);
        // return !!powerCategory ? powerCategory.categoryName : UNKNOWN_NAME;
        return "legendpower??"
    }

    private static getJobName(id: number): string {
        // var o: Job = Job.getJobById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "job??"
    }

    private static getDocumentTitle(id: number): string {
        // var o: Document = Document.getDocumentById(id);
        // return !!o ? o.title : UNKNOWN_NAME;
        return "document??"
    }

    private static getAlignmentSideName(id: number): string {
        // var o: AlignmentSide = AlignmentSide.getAlignmentSideById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "alignment??"
    }

    private static getItemName(id: number): string {
        // var o: Item = Item.getItemById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "item??"
    }

    private static getMonsterSuperRaceName(id: number): string {
        // var o: MonsterSuperRace = MonsterSuperRace.getMonsterSuperRaceById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "monsterSuperRace??"
    }

    private static getMonsterRaceName(id: number): string {
        // var o: MonsterRace = MonsterRace.getMonsterRaceById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "monsterRace??"
    }

    private static getTitleName(id: number): string {
        // var o: Title = Title.getTitleById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "title??"
    }

    private static getMountFamilyName(id: number): string {
        // var o: MountFamily = MountFamily.getMountFamilyById(id);
        // return !!o ? o.name : UNKNOWN_NAME;
        return "mountFamily??"
    }

    public static prepareDescription(desc: string, effectId: number, forTooltip: boolean = false, short: boolean = false): string {
        var aTmp: any[] = null;
        var spellState//:SpellState = null;
        // var nYear: string = null;
        // var nMonth: string = null;
        // var nDay: string = null;
        // var nHours: string = null;
        // var nMinutes: string = null;
        var lang: string = null;
        var level: number = 0;
        // var remainingXpPercentage: number = 0;
        // var currentMapping: CharacterXPMapping = null;
        // var nextMapping: CharacterXPMapping = null;
        var text: string = null;
        // var currentLevelXP: Number = NaN;
        // var nextLevelXP: Number = NaN;
        var i: number = 0;
        var firstValue: number = 0;
        var lastValue: number = 0;
        if (desc == null) {
            return "";
        }
        var sEffect: string = "";
        var hasAddedSpanTag: Boolean = false;
        var spellModif: Boolean = false;
        if (desc.indexOf("#") != -1) {
            aTmp = [this.parameter0, this.parameter1, this.parameter2, this.parameter3, this.parameter4];
            if (this.parameter0 > 0 && this.parameter1 > 0 && this.bonusType == -1) {
                aTmp = [this.parameter1, this.parameter0, this.parameter2, this.parameter3, this.parameter4];
            }
            switch (effectId) {
                case ActionIds.ACTION_CHARACTER_DISPELL_SPELL:
                    aTmp[1] = this.getSpellName(!!aTmp[0] ? +(aTmp[0]) : (!!aTmp[1] ? +(aTmp[1]) : +(aTmp[2])));
                    break;
                case ActionIds.ACTION_CHARACTER_LEARN_EMOTICON:
                    aTmp[2] = this.getEmoticonName(aTmp[0]);
                    break;
                case ActionIds.ACTION_CHARACTER_BOOST_ONE_WEAPON_DAMAGE_PERCENT:
                case ActionIds.ACTION_ITEM_GIFT_CONTENT:
                    aTmp[0] = this.getItemTypeName(aTmp[0]);
                    break;
                case ActionIds.ACTION_ITEM_WRAPPER_COMPATIBLE_OBJ_TYPE:
                    aTmp[0] = this.getItemTypeName(!!aTmp[0] ? +(aTmp[0]) : +(aTmp[2]));
                    break;
                case ActionIds.ACTION_CHARACTER_TRANSFORM:
                case ActionIds.ACTION_SUMMON_CREATURE:
                case ActionIds.ACTION_FIGHT_KILL_AND_SUMMON:
                case ActionIds.ACTION_FIGHT_KILL_AND_SUMMON_SLAVE:
                case ActionIds.ACTION_LADDER_ID:
                case ActionIds.ACTION_SUMMON_BOMB:
                case ActionIds.ACTION_SUMMON_SLAVE:
                    aTmp[0] = this.getMonsterName(aTmp[0]);
                    break;
                case ActionIds.ACTION_CHARACTER_REFLECTOR_UNBOOSTED:
                    if (!aTmp[0] && !aTmp[1] && aTmp[2]) {
                        aTmp[0] = aTmp[2];
                    }
                    aTmp[5] = "m";
                    aTmp[6] = aTmp[1] != null ? false : Math.abs(aTmp[0]) == 1;
                    aTmp[7] = aTmp[1] != null ? false : aTmp[0] == 0;
                    break;
                case ActionIds.ACTION_ITEM_CHANGE_DURABILITY:
                    if (aTmp[2] && aTmp[1] == null) {
                        aTmp[1] = 0;
                    }
                case ActionIds.ACTION_BOOST_SPELL_RANGE_MAX:
                case ActionIds.ACTION_BOOST_SPELL_RANGE_MIN:
                case ActionIds.ACTION_BOOST_SPELL_RANGEABLE:
                case ActionIds.ACTION_BOOST_SPELL_DMG:
                case ActionIds.ACTION_BOOST_SPELL_HEAL:
                case ActionIds.ACTION_BOOST_SPELL_AP_COST:
                case ActionIds.ACTION_DEBOOST_SPELL_AP_COST:
                case ActionIds.ACTION_BOOST_SPELL_CAST_INTVL:
                case ActionIds.ACTION_BOOST_SPELL_CC:
                case ActionIds.ACTION_BOOST_SPELL_CASTOUTLINE:
                case ActionIds.ACTION_BOOST_SPELL_NOLINEOFSIGHT:
                case ActionIds.ACTION_BOOST_SPELL_MAXPERTURN:
                case ActionIds.ACTION_BOOST_SPELL_MAXPERTARGET:
                case ActionIds.ACTION_BOOST_SPELL_CAST_INTVL_SET:
                case ActionIds.ACTION_BOOST_SPELL_BASE_DMG:
                case ActionIds.ACTION_DEBOOST_SPELL_RANGE_MAX:
                case ActionIds.ACTION_DEBOOST_SPELL_RANGE_MIN:
                case ActionIds.ACTION_CASTER_EXECUTE_SPELL:
                    aTmp[0] = this.getSpellName(aTmp[0]);
                    spellModif = true;
                    break;
                case ActionIds.ACTION_CAST_STARTING_SPELL:
                    aTmp[0] = "{spellNoLvl," + aTmp[0] + "," + aTmp[1] + "}";
                    break;
                case ActionIds.ACTION_CHARACTER_LEARN_SPELL:
                    if (aTmp[2] == null) {
                        aTmp[2] = aTmp[0];
                    }
                    aTmp[2] = this.getSpellLevelName(aTmp[2]);
                    break;
                case ActionIds.ACTION_LEGENDARY_POWER_SPELL:
                    aTmp[2] = "legendaryPowerSpell!!" //I18n.getUiText("ui.itemtooltip.giveSpellCategory", [this.getLegendaryPowerCategoryName(aTmp[0])]);
                    break;
                case ActionIds.ACTION_CHARACTER_GAIN_JOB_XP:
                    aTmp[0] = aTmp[2];
                    aTmp[1] = this.getJobName(aTmp[1]);
                    break;
                case ActionIds.ACTION_CHARACTER_LEARN_SPELL_FORGETTABLE:
                    aTmp[2] = this.getSpellName(aTmp[!!aTmp[2] ? 2 : 0]);
                    break;
                case ActionIds.ACTION_CHARACTER_UNLEARN_GUILDSPELL:
                    aTmp[2] = this.getSpellName(aTmp[0]);
                    break;
                case ActionIds.ACTION_CHARACTER_READ_BOOK:
                    aTmp[2] = this.getDocumentTitle(aTmp[0]);
                    break;
                case ActionIds.ACTION_CHARACTER_SUMMON_MONSTER:
                    aTmp[2] = this.getMonsterName(aTmp[1]);
                    break;
                case ActionIds.ACTION_CHARACTER_SUMMON_MONSTER_GROUP:
                case ActionIds.ACTION_CHARACTER_SUMMON_MONSTER_GROUP_DYNAMIC:
                    aTmp[1] = this.getMonsterGrade(aTmp[2], aTmp[0]);
                    aTmp[2] = this.getMonsterName(aTmp[2]);
                    break;
                // case ActionIds.ACTION_FAKE_ALIGNMENT:
                // case ActionIdProtocol.ACTION_SHOW_ALIGNMENT:
                //     aTmp[2] = this.getAlignmentSideName(aTmp[0]);
                //     break;
                case ActionIds.ACTION_CHARACTER_REFERENCEMENT:
                    aTmp[0] = this.getJobName(aTmp[0]);
                    break;
                case ActionIds.ACTION_LADDER_SUPERRACE:
                    aTmp[0] = this.getMonsterSuperRaceName(aTmp[0]);
                    break;
                case ActionIds.ACTION_LADDER_RACE:
                    aTmp[0] = this.getMonsterRaceName(aTmp[0]);
                    break;
                case ActionIds.ACTION_GAIN_TITLE:
                    aTmp[2] = this.getTitleName(aTmp[0]);
                    break;
                case ActionIds.ACTION_TARGET_EXECUTE_SPELL:
                case ActionIds.ACTION_TARGET_EXECUTE_SPELL_WITH_ANIMATION:
                case ActionIds.ACTION_TARGET_EXECUTE_SPELL_ON_SOURCE:
                case ActionIds.ACTION_SOURCE_EXECUTE_SPELL_ON_TARGET:
                case ActionIds.ACTION_SOURCE_EXECUTE_SPELL_ON_SOURCE:
                case ActionIds.ACTION_CHARACTER_ADD_SPELL_COOLDOWN:
                case ActionIds.ACTION_CHARACTER_REMOVE_SPELL_COOLDOWN:
                case ActionIds.ACTION_CHARACTER_PROTECTION_FROM_SPELL:
                case ActionIds.ACTION_CHARACTER_SET_SPELL_COOLDOWN:
                case ActionIds.ACTION_TARGET_EXECUTE_SPELL_ON_CELL:
                case ActionIds.ACTION_DECORS_PLAY_ANIMATION_D2:
                    aTmp[0] = this.getSpellName(aTmp[0]);
                    break;
                // case ActionIdProtocol.ACTION_SHOW_GRADE:
                // case ActionIdProtocol.ACTION_SHOW_LEVEL:
                // case ActionIds.ACTION_ITEM_SUMMON_MONSTER_GROUP_MAX_LOOT_SHARES:
                //     aTmp[2] = aTmp[0];
                //     break;
                case ActionIds.ACTION_ITEM_SUMMON_MONSTER_REWARD_RATE:
                    if (aTmp[0] == 0) {
                        aTmp[0] = "-";
                    }
                    else {
                        aTmp[0] = "+";
                    }
                    aTmp[0] += aTmp[1];
                    break;
                // case ActionIds.ACTION_ITEM_PETS_SHAPE:
                //     if (aTmp[1] > 6) {
                //         aTmp[0] = I18n.getUiText("ui.petWeight.fat", [aTmp[1]]);
                //     }
                //     else if (aTmp[2] > 6) {
                //         aTmp[0] = I18n.getUiText("ui.petWeight.lean", [aTmp[2]]);
                //     }
                //     else if (this is EffectInstancenumbereger && aTmp[0] > 6)
                //     {
                //         aTmp[0] = I18n.getUiText("ui.petWeight.lean", [aTmp[0]]);
                //     }
                //   else {
                //         aTmp[0] = I18n.getUiText("ui.petWeight.nominal");
                //     }
                //     break;
                // case ActionIds.ACTION_ITEM_PETS_EAT:
                //     if (aTmp[0]) {
                //         aTmp[0] = this.getItemName(aTmp[0]);
                //     }
                //     else {
                //         aTmp[0] = I18n.getUiText("ui.common.none");
                //     }
                //     break;
                case ActionIds.ACTION_ITEM_DUNGEON_KEY_DATE:
                case ActionIds.ACTION_ITEM_MIMICRY_OBJ_GID:
                case ActionIds.ACTION_ITEM_WRAPPER_LOOK_OBJ_GID:
                case ActionIds.ACTION_RIDE_HARNESS_GID:
                    aTmp[0] = this.getItemName(aTmp[0]);
                    break;
                case ActionIds.ACTION_RIDE_GAIN_CAPACITY:
                    aTmp[0] = this.getMountFamilyName(aTmp[0]);
                    break;
                case ActionIds.ACTION_FIGHT_CHALLENGE_AGAINST_MONSTER:
                    aTmp[1] = this.getMonsterName(aTmp[1]);
                    break;
                case ActionIds.ACTION_PET_SET_POWER_BOOST:
                case ActionIds.ACTION_PET_POWER_BOOST:
                    aTmp[2] = this.getItemName(aTmp[0]);
                    break;
                case ActionIds.ACTION_FIGHT_SET_STATE:
                case ActionIds.ACTION_FIGHT_UNSET_STATE:
                case ActionIds.ACTION_FIGHT_DISABLE_STATE:
                    spellState = aTmp[2] != null ? SpellState.getSpellStateById(aTmp[2]) : SpellState.getSpellStateById(aTmp[0]);
                    if (spellState) {
                        if (spellState.isSilent) {
                            return "";
                        }
                        aTmp[2] = spellState.name;
                    }
                    else {
                        aTmp[2] = UNKNOWN_NAME;
                    }
                    break;
                case ActionIds.ACTION_SET_CRAFTERMAGE:
                case ActionIds.ACTION_SET_OWNER:
                case ActionIds.ACTION_SET_CRAFTER:
                    aTmp[3] = "{player," + aTmp[3] + "}";
                    break;
                case ActionIds.ACTION_SET_COMPANION:
                    aTmp[0] = this.getCompanionName(aTmp[0]);
                    break;
                // case ActionIds.ACTION_EVOLUTIVE_OBJECT_EXPERIENCE:
                //     if (!aTmp[2]) {
                //         aTmp[2] = 0;
                //     }
                //     if (!aTmp[1]) {
                //         aTmp[1] = 0;
                //     }
                //     if (aTmp[1] == 0) {
                //         aTmp[2] = I18n.getUiText("ui.common.maximum");
                //     }
                //     else {
                //         aTmp[2] = I18n.getUiText("ui.tooltip.monsterXpAlone", [aTmp[2] + " / " + aTmp[1]]);
                //     }
                //     break;
                case ActionIds.ACTION_EVOLUTIVE_PET_LEVEL:
                    aTmp[0] = this.getItemTypeName(aTmp[0]);
                    aTmp[2] = aTmp[2] - 1;
                    break;
                case ActionIds.ACTION_SUPERFOOD_EXPERIENCE:
                    aTmp[2] = aTmp[0];
                    break;
                case ActionIds.ACTION_ITEM_CHANGE_DURATION:
                case ActionIds.ACTION_PETS_LAST_MEAL:
                case ActionIds.ACTION_MARK_NOT_TRADABLE:
                // case ActionIdProtocol.ACTION_ITEM_EXPIRATION:
                //     if (aTmp[0] == undefined && aTmp[1] == undefined && aTmp[2] > 0) {
                //         aTmp[0] = aTmp[2];
                //         break;
                //     }
                //     if (aTmp[0] == null && aTmp[1] == null && aTmp[2] == null) {
                //         break;
                //     }
                //     aTmp[2] = aTmp[2] == undefined ? 0 : aTmp[2];
                //     nYear = aTmp[0];
                //     nMonth = aTmp[1].substr(0, 2);
                //     nDay = aTmp[1].substr(2, 2);
                //     nHours = aTmp[2].substr(0, 2);
                //     nMinutes = aTmp[2].substr(2, 2);
                //     lang = XmlConfig.getInstance().getEntry("config.lang.current");
                //     switch (lang) {
                //         case LanguageEnum.LANG_FR:
                //             aTmp[0] = nDay + "/" + nMonth + "/" + nYear + " " + nHours + ":" + nMinutes;
                //             break;
                //         case LanguageEnum.LANG_EN:
                //             aTmp[0] = nMonth + "/" + nDay + "/" + nYear + " " + nHours + ":" + nMinutes;
                //             break;
                //         default:
                //             aTmp[0] = nMonth + "/" + nDay + "/" + nYear + " " + nHours + ":" + nMinutes;
                //     }
                //     break;
                case ActionIds.SMITHMAGIC_FORCE_PROBABILITY:
                    if (aTmp[0] == undefined && aTmp[1] == undefined && aTmp[2] > 0) {
                        aTmp[0] = aTmp[2];
                        aTmp[2] = 0;
                    }
                    break;
                // case ActionIds.ACTION_CHARACTER_GAIN_XP_WO_BOOST:
                //     level = aTmp[1];
                //     remainingXpPercentage = aTmp[2];
                //     currentMapping = CharacterXPMapping.getCharacterXPMappingById(level);
                //     nextMapping = CharacterXPMapping.getCharacterXPMappingById(level + 1);
                //     if (currentMapping == null) {
                //         _log.log(LogLevel.WARN, "Xp Mapping is null for Level " + level);
                //     }
                //     else {
                //         currentLevelXP = currentMapping.experiencePonumbers;
                //         nextLevelXP = 0;
                //         if (nextMapping != null) {
                //             nextLevelXP = (nextMapping.experiencePonumbers - currentMapping.experiencePonumbers) * remainingXpPercentage / 100;
                //         }
                //         aTmp[0] = StringUtils.formatenumberToString(currentLevelXP + nextLevelXP);
                //     }
                //     break;
                // case ActionIds.ACTION_ITEM_CUSTOM_EFFECT:
                //     for (i = 0; i < aTmp.length; i++) {
                //         aTmp[i] = aTmp[i] == null ? 0 : aTmp[i];
                //     }
                //     aTmp[0] = I18n.getUiText("ui.customEffect." + aTmp[2]);
                //     aTmp[2] = null;
                //     text = "";
                //     switch (aTmp[1]) {
                //         case 0:
                //             text = aTmp[0].replace(aTmp[0], "<span class=\'bonus\'>" + aTmp[0]);
                //             break;
                //         case 1:
                //             text = aTmp[0].replace(aTmp[0], "<span class=\'malus\'>" + aTmp[0]);
                //             break;
                //         case 2:
                //             text = aTmp[0].replace(aTmp[0], "<span class=\'neutral\'>" + aTmp[0]);
                //             break;
                //         case 3:
                //             text = aTmp[0].replace(aTmp[0], "<span class=\'exotic\'>" + aTmp[0]);
                //     }
                //     aTmp[1] = null;
                //     aTmp[0] = text + "</span>";
                //     break;
                case ActionIds.ACTION_FIGHT_ADD_PORTAL:
                    if (aTmp[2] == null) {
                        aTmp[2] = 0;
                    }
                    break;
                case ActionIds.ACTION_CHARACTER_BOOST_MAXIMUM_SUMMONED_CREATURES:
                case ActionIds.ACTION_CHARACTER_BOOST_MAXIMUM_WEIGHT:
                case ActionIds.ACTION_CHARACTER_DEBOOST_MAXIMUM_WEIGHT:
                case ActionIds.ACTION_CHARACTER_BOOST_HEAL_BONUS:
                case ActionIds.ACTION_CHARACTER_DEBOOST_HEAL_BONUS:
                case ActionIds.ACTION_CHARACTER_BOOST_DAMAGES:
                case ActionIds.ACTION_CHARACTER_DEBOOST_DAMAGES:
                case ActionIds.ACTION_CHARACTER_BOOST_EARTH_DAMAGES:
                case ActionIds.ACTION_CHARACTER_DEBOOST_EARTH_DAMAGES:
                case ActionIds.ACTION_CHARACTER_BOOST_FIRE_DAMAGES:
                case ActionIds.ACTION_CHARACTER_DEBOOST_FIRE_DAMAGES:
                case ActionIds.ACTION_CHARACTER_BOOST_WATER_DAMAGES:
                case ActionIds.ACTION_CHARACTER_DEBOOST_WATER_DAMAGES:
                case ActionIds.ACTION_CHARACTER_BOOST_AIR_DAMAGES:
                case ActionIds.ACTION_CHARACTER_DEBOOST_AIR_DAMAGES:
                case ActionIds.ACTION_CHARACTER_BOOST_NEUTRAL_DAMAGES:
                case ActionIds.ACTION_CHARACTER_DEBOOST_NEUTRAL_DAMAGES:
                case ActionIds.ACTION_CHARACTER_BOOST_TRAP:
                case ActionIds.ACTION_CHARACTER_BOOST_CRITICAL_DAMAGES_BONUS:
                case ActionIds.ACTION_CHARACTER_DEBOOST_CRITICAL_DAMAGES_BONUS:
                case ActionIds.ACTION_CHARACTER_BOOST_PUSH_DAMAGE:
                case ActionIds.ACTION_CHARACTER_DEBOOST_PUSH_DAMAGE:
                case ActionIds.ACTION_CHARACTER_BOOST_EARTH_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_DEBOOST_EARTH_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_BOOST_FIRE_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_DEBOOST_FIRE_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_BOOST_AIR_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_DEBOOST_AIR_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_BOOST_WATER_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_DEBOOST_WATER_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_BOOST_NEUTRAL_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_DEBOOST_NEUTRAL_ELEMENT_RESIST:
                case ActionIds.ACTION_CHARACTER_BOOST_CRITICAL_DAMAGES_REDUCTION:
                case ActionIds.ACTION_CHARACTER_DEBOOST_CRITICAL_DAMAGES_REDUCTION:
                case ActionIds.ACTION_CHARACTER_BOOST_PUSH_DAMAGE_REDUCTION:
                case ActionIds.ACTION_CHARACTER_DEBOOST_PUSH_DAMAGE_REDUCTION:
                    aTmp[5] = "m";
                    aTmp[6] = aTmp[1] != null ? false : Math.abs(aTmp[0]) == 1;
                    aTmp[7] = aTmp[1] != null ? false : aTmp[0] == 0;
            }
            if (forTooltip && aTmp) {
                if (spellModif && aTmp[2] != null) {
                    hasAddedSpanTag = true;
                    aTmp[2] += "</span>";
                }
                else if (aTmp[1] != null) {
                    hasAddedSpanTag = true;
                    aTmp[1] += "</span>";
                }
                else if (aTmp[0] != null) {
                    hasAddedSpanTag = true;
                    aTmp[0] += "</span>";
                }
            }
            sEffect = PatternDecoder.getDescription(desc, aTmp);
            if (sEffect == null || sEffect == "") {
                return "";
            }
        }
        else {
            if (short) {
                return "";
            }
            sEffect = desc;
        }
        if (forTooltip) {
            if (hasAddedSpanTag && sEffect.indexOf("</span>") != -1) {
                if (short) {
                    firstValue = desc.indexOf("#");
                    lastValue = desc.lastIndexOf("#");
                    if (firstValue != lastValue && firstValue >= 0 && lastValue >= 0) {
                        sEffect = sEffect.substring(0, sEffect.indexOf("</span>"));
                    }
                }
                else if (spellModif) {
                    sEffect = sEffect.replace(aTmp[2], "<span class=\'#valueCssClass\'>" + aTmp[2]);
                }
                else {
                    sEffect = "<span class=\'#valueCssClass\'>" + sEffect;
                }
            }
            if (hasAddedSpanTag && sEffect.indexOf("%") != -1) {
                sEffect = sEffect.replace("%", "<span class=\'#valueCssClass\'>%</span>");
            }
        }
        if (this.modificator != 0) {
            sEffect += " " + I18n.getUiText("ui.effect.boosted.spell.complement", [this.modificator], "%");
        }
        if (this.random > 0) {
            if (this.group > 0) {
                sEffect += " (" + I18n.getUiText("ui.common.random") + ")";
            }
            else {
                sEffect += " " + I18n.getUiText("ui.effect.randomProbability", [this.random], "%");
            }
        }
        return sEffect;

        // return "";
    }

}
*/
