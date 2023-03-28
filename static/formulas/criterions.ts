import { inject } from "aurelia";
import { db } from "../../db";

export class Criteria {
    public name: string
    public operator: string
    public value: string
}
export class CriteriaGroup {
    public operator
    public criterions: any[] = [] 
}
/**
 * ItemCriterion
 * GroupItemCriterion
 * ItemCriterionOperator
 */
export class Citerions {

    public static readonly SUPERIOR: string = ">";
    public static readonly INFERIOR: string = "<";
    public static readonly EQUAL: string = "=";
    public static readonly DIFFERENT: string = "!";
    public static readonly OPERATORS_LIST: string[] = [Citerions.SUPERIOR, Citerions.INFERIOR, Citerions.EQUAL, Citerions.DIFFERENT, "#", "~", "s", "S", "e", "E", "v", "i", "X", "/"];

    public static parse(str: string) {
        let groups = []
        let i = -1;
        try {
            while((i = str.indexOf("(")) >= 0) {
                let j = str.indexOf(")");
                let group = str.slice(i, j + 1);
                str = str.replace(group, "");
                group = group.replace("(", "").replace(")", "")
                groups.push(group);
            }
        } catch(ex) {
            console.error(ex)
        }
        let root = this.splitGroupToCriterions(str);
        for(let g of groups) {
            let cg = this.splitGroupToCriterions(g);
            root.criterions.push(cg)
        }
        // console.log({root})
        return root;
    }

    private static splitGroupToCriterions(group: string): CriteriaGroup {
        let cg = new CriteriaGroup();
        if(group.includes("&")) cg.operator = "&";
        if(group.includes("|")) cg.operator = "|";
        for (let c of group.split(cg.operator)) { 
            // console.log("c: "+ c)
            cg.criterions.push(this.getInfos(c));
        }
        cg.criterions = cg.criterions.filter(s => s != null);
        return cg;
    }

    public static getInfos(criteria: string): Criteria {
        for (let operator of Citerions.OPERATORS_LIST) {
            if (criteria.indexOf(operator) == 2) {
                let c = new Criteria();
                c.name = criteria.split(operator)[0]
                c.operator = operator
                c.value = criteria.split(operator)[1]
                return c;
            }
        }
    }


    /*
    public getCriteriaFromString(pCriteriaStringForm: string) { // : Vector.<IItemCriterion>
        var stringCriterion: string = null;
        var tabSingleCriteria: [] = null;
        var stringCriterion2: string = null;
        var newGroupCriterion: GroupItemCriterion = null;
        var criteriaStringForm: string = pCriteriaStringForm;
        var criteria: [] = [] // = new Vector.<IItemCriterion>();
        if (!criteriaStringForm || criteriaStringForm.length == 0) {
            return criteria;
        }
        var tabParenthesis: string[] = StringUtils.getDelimitedText(criteriaStringForm, "(", ")", true);
        for (stringCriterion in tabParenthesis) {
            newGroupCriterion = new GroupItemCriterion(stringCriterion);
            criteria.push(newGroupCriterion);
            criteriaStringForm = StringUtils.replace(criteriaStringForm, stringCriterion, "");
        }
        tabSingleCriteria = criteriaStringForm.split(/[&|]/);
        for (stringCriterion2 in tabSingleCriteria) {
            if (stringCriterion2 != "") {
                criteria.push(ItemCriterionFactory.create(stringCriterion2));
            }
        }
        return criteria;
    }
    */
}


export class CriterionUtil {

    public static knownCriteriaList: string[] = ["CS", "Cs", "CV", "Cv", "CA", "Ca", "CI", "Ci", "CW", "Cw", "CC", "Cc", "PG", "PJ", "Pj", "PM", "PA", "PN", "PE", "<NO>", "PS", "PR", "PL", "PK", "Pg", "Pr", "Ps", "Pa", "PP", "PZ", "CM", "Qa", "CP", "ca", "cc", "ci", "cs", "cv", "cw", "Pl"];

    public static create(criteria: Criteria, db: db): Criteria { // : ItemCriterion {
        let result: string = "";
        let s = criteria.name;
        let operator = criteria.operator;
        // var s: string = criteria.slice(0, 2);
        // var operator: string = criteria.charAt(2);
        // operator = operator.replace("X", "!").replace("E", "=")

        let caracIndex = this.getKnownCriteriaIndex(s);
        if (caracIndex >= 0) {
            // return this.getCaractext(s);

        }
        let i18nName: string;
        switch (s) {
            case "Po":
                i18nName = "ui.common.doNotPossess";
                // criterion = new ObjectItemCriterion(pServerCriterionForm);
                break;
            case "PO":
                i18nName = "ui.common.doNotPossess";
                // criterion = new ObjectItemCriterion(pServerCriterionForm);
                break;
            case "Pk":
                i18nName = "ui.criterion.setBonus";
                // criterion = new BonusSetItemCriterion(pServerCriterionForm);
                break;
            case "PK":
                // criterion = new KamaItemCriterion(pServerCriterionForm);
                break;
        }
        /*
        switch (s) {
            case "BI":
                // criterion = new UnusableItemCriterion(pServerCriterionForm);
                break;
            case "EA":
                // criterion = new MonsterGroupChallengeCriterion(pServerCriterionForm);
                break;
            case "EB":
                // criterion = new NumberOfMountBirthedCriterion(pServerCriterionForm);
                break;
            case "Ec":
                // criterion = new NumberOfItemMadeCriterion(pServerCriterionForm);
                break;
            case "Eu":
                // criterion = new RuneByBreakingItemCriterion(pServerCriterionForm);
                break;
            case "GM":
                // criterion = new GuildMasterItemCriterion(pServerCriterionForm);
                break;
            case "Kd":
                // criterion = new ArenaDuelRankCriterion(pServerCriterionForm);
                break;
            case "KD":
                // criterion = new ArenaMaxDuelRankCriterion(pServerCriterionForm);
                break;
            case "Ks":
                // criterion = new ArenaSoloRankCriterion(pServerCriterionForm);
                break;
            case "KS":
                // criterion = new ArenaMaxSoloRankCriterion(pServerCriterionForm);
                break;
            case "Kt":
                // criterion = new ArenaTeamRankCriterion(pServerCriterionForm);
                break;
            case "KT":
                // criterion = new ArenaMaxTeamRankCriterion(pServerCriterionForm);
                break;
            case "MK":
                // criterion = new MapCharactersItemCriterion(pServerCriterionForm);
                break;
            case "Oa":
                // criterion = new AchievementPointsItemCriterion(pServerCriterionForm);
                break;
            case "OA":
                // criterion = new AchievementItemCriterion(pServerCriterionForm);
                break;
            case "Ob":
                // criterion = new AchievementAccountItemCriterion(pServerCriterionForm);
                break;
            case "Of":
                // criterion = new MountFamilyItemCriterion(pServerCriterionForm);
                break;
            case "OH":
                // criterion = new NewHavenbagItemCriterion(pServerCriterionForm);
                break;
            case "OO":
                // criterion = new AchievementObjectiveValidated(pServerCriterionForm);
                break;
            case "Os":
                // criterion = new SmileyPackItemCriterion(pServerCriterionForm);
                break;
            case "OV":
                // criterion = new SubscriptionDurationItemCriterion(pServerCriterionForm);
                break;
            case "Ow":
                // criterion = new AllianceItemCriterion(pServerCriterionForm);
                break;
            case "Ox":
                // criterion = new AllianceRightsItemCriterion(pServerCriterionForm);
                break;
            case "Oz":
                // criterion = new AllianceAvAItemCriterion(pServerCriterionForm);
                break;
            // case "Pa":
            //     // criterion = new AlignmentLevelItemCriterion(pServerCriterionForm);
            //     break;
            // case "PA":
            //     // criterion = new SoulStoneItemCriterion(pServerCriterionForm);
            //     break;
            case "Pb":
                // criterion = new FriendlistItemCriterion(pServerCriterionForm);
                break;
            case "PB":
                // criterion = new SubareaItemCriterion(pServerCriterionForm);
                break;
            case "Pe":
                // criterion = new PremiumAccountItemCriterion(pServerCriterionForm);
                break;
            // case "PE":
            //     // criterion = new EmoteItemCriterion(pServerCriterionForm);
            //     break;
            case "Pf":
                // criterion = new RideItemCriterion(pServerCriterionForm);
                break;
            // case "Pg":
            //     // criterion = new GiftItemCriterion(pServerCriterionForm);
            //     break;
            // case "PG":
            //     // criterion = new BreedItemCriterion(pServerCriterionForm);
            //     break;
            case "Pi":
            case "PI":
                // criterion = new SkillItemCriterion(pServerCriterionForm);
                break;
            // case "PJ":
            // case "Pj":
            //     // criterion = new JobItemCriterion(pServerCriterionForm);
            //     break;
            case "Pk":
                // criterion = new BonusSetItemCriterion(pServerCriterionForm);
                break;
            // case "PK":
            //     // criterion = new KamaItemCriterion(pServerCriterionForm);
            //     break;
            // case "PL":
            //     // criterion = new LevelItemCriterion(pServerCriterionForm);
            //     break;
            // case "Pl":
            //     // criterion = new PrestigeLevelItemCriterion(pServerCriterionForm);
            //     break;
            case "Pm":
                // criterion = new MapItemCriterion(pServerCriterionForm);
                break;
            // case "PN":
            //     // criterion = new NameItemCriterion(pServerCriterionForm);
            //     break;
            // case "PO":
            //     // criterion = new ObjectItemCriterion(pServerCriterionForm);
            //     break;
            // case "Po":
            //     // criterion = new AreaItemCriterion(pServerCriterionForm);
            //     break;
            // case "Pp":
            // case "PP":
            //     // criterion = new PVPRankItemCriterion(pServerCriterionForm);
            //     break;
            // case "Pr":
            //     // criterion = new SpecializationItemCriterion(pServerCriterionForm);
            //     break;
            // case "PR":
            //     // criterion = new MariedItemCriterion(pServerCriterionForm);
            //     break;
            // case "Ps":
            //     // criterion = new AlignmentItemCriterion(pServerCriterionForm);
            //     break;
            // case "PS":
            //     // criterion = new SexItemCriterion(pServerCriterionForm);
            //     break;
            case "PT":
                // criterion = new SpellItemCriterion(pServerCriterionForm);
                break;
            case "PU":
                // criterion = new BonesItemCriterion(pServerCriterionForm);
                break;
            case "Pw":
                // criterion = new GuildItemCriterion(pServerCriterionForm);
                break;
            case "PW":
                // criterion = new WeightItemCriterion(pServerCriterionForm);
                break;
            case "Px":
                // criterion = new GuildRightsItemCriterion(pServerCriterionForm);
                break;
            case "PX":
                // criterion = new AccountRightsItemCriterion(pServerCriterionForm);
                break;
            case "Py":
                // criterion = new GuildLevelItemCriterion(pServerCriterionForm);
                break;
            case "Pz":
                break;
            // case "PZ":
            //     // criterion = new SubscribeItemCriterion(pServerCriterionForm);
            //     break;
            // case "Qa":
            // case "Qc":
            // case "Qf":
            //     // criterion = new QuestItemCriterion(pServerCriterionForm);
            //     break;
            case "Qo":
                // criterion = new QuestObjectiveItemCriterion(pServerCriterionForm);
                break;
            case "SC":
                // criterion = new ServerTypeItemCriterion(pServerCriterionForm);
                break;
            case "Sc":
                // criterion = new StaticCriterionItemCriterion(pServerCriterionForm);
                break;
            case "Sd":
                // criterion = new DayItemCriterion(pServerCriterionForm);
                break;
            case "SG":
                // criterion = new MonthItemCriterion(pServerCriterionForm);
                break;
            case "SI":
                // criterion = new ServerItemCriterion(pServerCriterionForm);
                break;
            case "ST":
                // criterion = new ServerSeasonTemporisCriterion(pServerCriterionForm);
                break;
            case "Sy":
                // criterion = new CommunityItemCriterion(pServerCriterionForm);
                break;
            case "HS":
                // criterion = new StateCriterion(pServerCriterionForm);
                break;
            case "HA":
                // criterion = new AlterationCriterion(pServerCriterionForm);
                break;
            case "OS":
                // criterion = new OnlySetCriterion(pServerCriterionForm);
                break;
            case "So":
                // criterion = new OptionalFeatureEnabledCriterion(pServerCriterionForm);
                break;
            case "IE":
                // criterion = new IdolsEquippedCriterion(pServerCriterionForm);
                break;
            default:
            // _log.warn("Criterion \'" + s + "\' unknow or unused (" + pServerCriterionForm + ")");
        }
        */
        return criteria;
    }

    public static getKnownCriteriaIndex(_criterionRef) {
        return this.knownCriteriaList.indexOf(_criterionRef);
    }

    
    public static getCriterionBool(c: Criteria) {
        switch (c.name) {
            case "PZ": // ??
                if (c.value == "1") return "condition.subscribed"
                else return "condition.unsubscribed"
            case "Bl": // ??
                if (c.value == "1") return "condition.unequipable"
                else c.name
            case "Ps":
                if (c.value == "1") return "condition.alignment.bonta"
                if (c.value == "2") return "condition.alignment.brakmar"
                else return c.name
            default:
                return null;
        }
    }
    public static getCriterion(criteria: Criteria) {
        switch (criteria.name) {
            case "Qf": return "null" // quête
            case "PK": return "condition.kamas";
            case "Pk": return "condition.setBonus";
            case "Mw": // ??
                return "null";
            case "PE": // connaitre l'attitude 'super-héros'
                return "null";
            case "PL":
                return "total.level";
            case "Ca":
                return "base.agility";
            case "CA":
                return "total.agility";
            case "Cc":
                return "base.chance";
            case "CC":
                return "total.chance";
            case "Ce":
                return "base.energy";
            case "CE":
                return "total.energy";
            case "CH":
                return "total.honour";
            case "CD":
                return "total.dishonour"
            case "Ci":
                return "base.intelligence";
            case "CI":
                return "total.intelligence";
            case "CL":
                return "total.hp";
            case "CM":
                return "total.mp";
            case "CP":
                return "total.ap";
            case "Cs":
                return "base.strength";
            case "CS":
                return "total.strength";
            case "Cv":
                return "base.vitality";
            case "CV":
                return "total.vitality";
            case "Cw":
                return "base.wisdom";
            case "CW":
                return "total.wisdom";
            case "Ct":
                return "total.evade";
            case "CT":
                return "total.block";
            case "ca":
                return "add.agility";
            case "cc":
                return "add.chance";
            case "ci":
                return "add.intelligence";
            case "cs":
                return "add.strength";
            case "cv":
                return "add.vitality";
            case "cw":
                return "add.wisdom";
            default:
                return null;
        }
    }


}
