import { inject } from "aurelia";
import { db } from "../../db";

export class Criteria {
    public name
    public operator
    public value
}

// @inject(db)
export class Citerions {

    public static readonly SUPERIOR: string = ">";
    public static readonly INFERIOR: string = "<";
    public static readonly EQUAL: string = "=";
    public static readonly DIFFERENT: string = "!";
    public static readonly OPERATORS_LIST: string[] = [Citerions.SUPERIOR, Citerions.INFERIOR, Citerions.EQUAL, Citerions.DIFFERENT, "#", "~", "s", "S", "e", "E", "v", "i", "X", "/"];

    // public constructor(readonly db: db) {

    // }

    // public translate(criterias: string, db: db) {

    // }

    public static parseGroup(criterias: string): Criteria[] {
        let criterions: Criteria[] = [];
        let subCriterions: string[] = this.splitParenthesises(criterias);
        for (let sub of subCriterions) {
            criterias = criterias.replace("(" + sub + ")", "");
            criterions.push(...this.parseGroup(sub))
        }
        criterions.push(...this.splitGroupToCriterions(criterias));
        return criterions
    }

    private static splitGroupToCriterions(group: string): Criteria[] {
        let solos: Criteria[] = [];
        for (let c of group.split(/[&|]/)) {
            solos.push(this.getInfos(c));
        }
        return solos;
    }

    public static splitParenthesises(text: string): string[] {
        let arr: string[] = [];
        let i = -1;
        while ((i = text.indexOf("(")) >= 0) {
            let j = text.indexOf(")");
            let parenthesis = text.slice(i + 1, j);
            arr.push(parenthesis);
            text = text.slice(j + 1);
        }
        return arr;
    }

    public static getInfos(criteria: string): Criteria {
        var operator: string = null;
        for (operator in Citerions.OPERATORS_LIST) {
            if (criteria.indexOf(operator) == 2) {
                //   let _operator = new ItemCriterionOperator(operator);
                // let _criterionRef = criteria.split(operator)[0];
                // let _criterionValue = criteria.split(operator)[1];
                // let _criterionValueText = criteria.split(operator)[1];
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

    public static getCaractext(_criterionRef: string): string { // , forTooltip: Boolean = false): string {
        var readableCriterionRef: string = null;
        switch (_criterionRef) {
            case "CM":
                readableCriterionRef = "ui.stats.movementPoints";
                break;
            case "CP":
                readableCriterionRef = "ui.stats.actionPoints";
                break;
            case "CH":
                readableCriterionRef = "ui.stats.honourPoints";
                break;
            case "CD":
                readableCriterionRef = "ui.stats.disgracePoints";
                break;
            case "CT":
                readableCriterionRef = "ui.stats.takleBlock";
                break;
            case "Ct":
                readableCriterionRef = "ui.stats.takleEvade";
                break;
            default:
                let index = this.getKnownCriteriaIndex(_criterionRef);
                if (index > -1) {
                    readableCriterionRef = "ui.item.characteristics"; //.split(",")[index]; //I18n.getUiText("ui.item.characteristics").split(",")[index];
                } else {
                    // _log.warn("Unknown criteria \'" + _criterionRef + "\'");
                }
        }
        // if (forTooltip) {
        //     return index > -1 ? readableCriterionRef + " " + "<span class=\'#valueCssClass\'>" + this._operator.text + " " + this._criterionValue + "</span>" : null;
        // }
        return readableCriterionRef; // + " " + this._operator.text + " " + this._criterionValue;
    }


}
