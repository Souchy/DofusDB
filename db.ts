import { ActionIds } from './code/ActionIds';
import { SpellZone } from './formulas';
import { loadavg } from "os";
import versions from './versions.json'
import maps_kolo_ids from './scraped/common/mapIdsFlat.json'

import { DI, IEventAggregator, Registration } from 'aurelia';
import { HttpClient } from '@aurelia/fetch-client';
import importgreenlist from './static/greenlistEffects.json'


import jsonFeatures from '../DofusDB/features.json'
// import jsonVersions from '../DofusDB/versions.json'
import zango from 'zangodb';
import { Util } from '../ts/util';


export class db {

	private http = new HttpClient();

	// lang should be stored on the client (local storage / session storage / cache / cookie)
	public lang_default = "fr";
	public lang: string = this.lang_default;
	private _version: string = versions[0]; // first version is the latest

	// actual json fetched 
	public jsonSpells: any;
	// public jsonSpellsDetails: any;
	public jsonBreeds: any;
	public jsonSummons: any;
	public jsonStates: any;
	public i18n_fr: any;
	public i18n_en: any;
	public jsonMaps: {} = {};
	public jsonGreenListEffects = importgreenlist;
	public isItemsLoaded = false;
	// json names
	public jsonSpellsName = "spells.json";
	// public jsonSpellsDetailsName = "spellsDetails.json";
	public jsonBreedsName = "breeds.json";
	public jsonSummonsName = "summons.json";

	// zangodb
	public zdb: zango.Db;
	public items: zango.Collection;
	public itemSets: zango.Collection;

	// selected
	public breedId: number = 1;
	private _selectedSpellSlot: number = 0;
	private _selectedOsaSummonSlot: number = -1;


	public constructor(@IEventAggregator readonly ea: IEventAggregator) {
		this.zdb = new zango.Db("encyclofus-" + this.version, 0, { items: []});
		this.items = this.zdb.collection('items');

		// load cached version and language
		let ver = localStorage.getItem("version");
		if (ver) this.setVersion(ver);
		let lan = localStorage.getItem("language");
		if (lan) this.setLanguage(lan);
		let spellSlot = +localStorage.getItem("selectedSpellSlot");
		if (spellSlot) this.selectedSpellSlot = spellSlot;
		let osaSlot = +localStorage.getItem("selectedOsaSummonSlot");
		if (osaSlot) this.selectedOsaSlot = osaSlot;
		if(spellSlot < 0 && osaSlot < 0)
			this.selectedSpellSlot = 0;
		// console.log("db slot: " + this.selectedSpellSlot + ", " + this.selectedOsaSlot)
	}

	public promiseLoadingSpells: Promise<boolean>;
	// public promiseLoadingSpellsDetails: Promise<boolean>;
	public promiseLoadingBreeds: Promise<boolean>;
	public promiseLoadingSummons: Promise<boolean>;

	public get isLoaded() {
		return this.jsonSpells && this.jsonBreeds
			&& this.jsonSummons && this.jsonStates && this.i18n_fr && this.i18n_en
			// && this.jsonSpellsDetails 
	}

	public get isLoadedI18n() {
		if(this.lang == "fr") return this.i18n_fr;
		return this.i18n_en;
	}

	public isFeature(name: string): boolean {
		return jsonFeatures[name];
	}

	public checkFeature(name: string): boolean {
		if(this.isFeature(name)) {
			return this.checkFeatureVersion(jsonFeatures[name]);
		}
		return true;
	}
	public checkFeatureVersion(version: string): boolean {
		let va = versions.indexOf(this.version);
		let vf = versions.indexOf(version);
		return va <= vf; // (plus petit = plus r??cent dans le tableau)
	}

	public setLanguage(lang: string) {
		if (this.lang == lang) {
			// do nothing
		} else {
			this.lang = lang;
			localStorage.setItem("language", lang);
			this.loadJson();
		}
	}

	public get version() {
		return this._version;
	}
	public setVersion(version: string) {
		if (this.version == version) {
			// do nothing
		} else
			if (!versions.includes(version)) {
				alert("Invalid version")
			} else {
				this._version = version;
				localStorage.setItem("version", version);
				this.loadJson();
			}
	}

	public get selectedSpellSlot() {
		return this._selectedSpellSlot;
	}
	public set selectedSpellSlot(slot: number) {
		if(this._selectedSpellSlot != slot) {
			this._selectedSpellSlot = slot;
			localStorage.setItem("selectedSpellSlot", slot + "");
			// console.log("db set slot: " + this._selectedSpellSlot + ", " + this._selectedOsaSummonSlot)
		}
	}

	public get selectedOsaSlot() {
		return this._selectedOsaSummonSlot;
	}
	public set selectedOsaSlot(slot: number) {
		if(this._selectedOsaSummonSlot != slot) {
			this._selectedOsaSummonSlot = slot;
			localStorage.setItem("selectedOsaSummonSlot", slot + "");
			// console.log("db set slot: " + this._selectedSpellSlot + ", " + this._selectedOsaSummonSlot)
		}
	}

	public async loadJson() {
		this.promiseLoadingSpells = this.fetchJson(this.gitFolderPath + this.jsonSpellsName, (json) => this.jsonSpells = json);
		// this.promiseLoadingSpellsDetails = this.fetchJson(this.gitFolderPath + this.lang + "/" + this.jsonSpellsDetailsName,
		// 	(json) => this.jsonSpellsDetails = json
		// );
		this.promiseLoadingBreeds = this.fetchJson(this.gitFolderPath + this.jsonBreedsName, (json) => this.jsonBreeds = json);
		this.promiseLoadingSummons = this.fetchJson(this.gitFolderPath + this.jsonSummonsName, (json) => this.jsonSummons = json);
		// console.log("loaded = promise: " + this.promiseLoadingSpells)

		await this.promiseLoadingBreeds;
		await this.promiseLoadingSummons;

		let result = await this.promiseLoadingSpells;
		// result = await this.promiseLoadingSpellsDetails;

		await this.fetchJson(this.gitFolderPath + "i18n_fr.json", (json) => this.i18n_fr = json);
		await this.fetchJson(this.gitFolderPath + "i18n_en.json", (json) => this.i18n_en = json);
		await this.fetchJson(this.gitFolderPath + "states.json", (json) => this.jsonStates = json);
		// for (let i of maps_kolo_ids) {
		// await this.fetchJson(this.getMapPath(i), (json) => this.jsonMaps[i] = json);
		// }

		if(this.checkFeatureVersion(jsonFeatures.items) && Util.isLocal()) {
			await this.fetchJson(this.gitFolderPath + "characteristics.json", (json) => this.jsonCharacteristics = json);
			await this.fetchJson(this.gitFolderPath + "effects.json", (json) => this.jsonEffects = json);
			this.fetchJson(this.gitFolderPath + "itemtypes.json", (json: []) => {
				console.log("loaded itemtypes: " + json.length)
				this.jsonItemTypes = json;
			})
			this.fetchJson(this.gitFolderPath + "itemsets.json", (json: []) => {
				console.log("loaded itemsets: " + json.length)
				this.jsonItemSets = json;
			})
			this.fetchJson(this.gitFolderPath + "items.json", (json: []) => {
				console.log("loaded items: " + json.length)
				this.jsonItems = json;
				this.isItemsLoaded = true;
				this.items.insert(json);
			})
		}

		this.ea.publish("db:loaded");
	}
	public jsonEffects;
	public jsonCharacteristics;
	public jsonItemTypes;
	public jsonItemSets;
	public jsonItems;

	public async loadMap(mapid: string) {
		// console.log("load map " + mapid)
		if (!mapid) return;
		let promise = await this.fetchJson(this.getMapPath(mapid), (json) => this.jsonMaps[mapid] = json);
		if (promise) {
			// console.log("db.loaded map: " + mapid + " = " + this.jsonMaps[mapid])
			this.ea.publish("db:loadmap");
		} else {
			console.log("db.loadMap failed")
		}
	}

	public async fetchJson(path: string, setter: (json) => any) {
		return this.http.fetch(path)
			.then(response => response.status == 404 ? null : response.text())
			.then(data => {
				if (data == null) return false;
				setter(JSON.parse(data));
				return true;
			}).catch(() => {
				return false;
			});
	}

	// https://raw.githubusercontent.com/Souchy/DofusDB/master/scraped/2.65/fr/spellsDetails.json
	// "http://192.168.2.11:9000/src/DofusDB/" //
	private dofusDBGithubUrl = "https://raw.githubusercontent.com/Souchy/DofusDB/master/";
	private githubScrapedUrlPath = this.dofusDBGithubUrl + "scraped/";
	private commonUrlPath: string = this.githubScrapedUrlPath + "common/";
	public get gitFolderPath() {
		return this.githubScrapedUrlPath + this.version + "/";
	}

	public getMapPath(id: string): string {
		return this.commonUrlPath + "map_kolo/" + id + ".json";
	}

	public getSpellIconPath(spellId: number): string {
		let iconid = this.jsonSpells[spellId].iconId;
		// console.log("getSpellIconPath " + spellId + " = " + iconid); //JSON.stringify(this.jsonSpells[spellId]));
		return this.githubScrapedUrlPath + this.version + "/sprites/spells/" + iconid + ".png";
	}
	public getMonsterIconPath(monsterId: number): string {
		return this.githubScrapedUrlPath + this.version + "/sprites/monsters/" + monsterId + ".png";
	}

	public getI18n(id: string): string {
		try {
			if (this.lang == "fr")
				return this.i18n_fr[id];
			if (this.lang == "en")
				return this.i18n_en[id];
		} catch(error) {
			console.log("db.getI18n error key: " + id + ". Wait 30 seconds for the site to load.");
			return id;
		}
	}

	public getIconPath(name: string) {
		return this.commonUrlPath + name;
	}

	public getAoeIconUrl(effect: any) {
		// SEE:  EffectInstance, SpellheaderBlock.getSpellZoneChunkParams, SpellTooltipUi.getSpellZoneIconUri
		let zoneEffect = SpellZone.parseZone(effect.rawZone);
		// if(effect.effectUid == 285104) {
			// console.log("zone: " + JSON.stringify(zoneEffect))
		// }
		let aoeName = zoneEffect.zoneName;
		if(aoeName == "star") 
			return this.commonUrlPath + "icons/star.png";
		if(aoeName == "squareChecker") 
			return this.commonUrlPath + "icons/check.png";
		if (aoeName == "line3") 
			aoeName = "line";
		if (aoeName)
			return this.commonUrlPath + "areas/" + aoeName + ".png";
		// return "vertical-align: middle; width: 37px; height: 32px; background-image: url('" + this.commonUrlPath + "areas/" + aoeName + ".png');"
		// 	+ "background-repeat: no-repeat; background-position: 50%;"; //background-position: " + 0 + "px; background-position-y: " + 7 + "px;";
		else return "";
	}

	public getBreedIconStyle(breedIndex: number) {
		let url = this.commonUrlPath + "big.png";
		let pos = "background-position: -56px " + Math.ceil(-56.8 * breedIndex) + "px;";
		if (breedIndex == 19 - 1) {
			url = this.gitFolderPath + "sprites/spells/350.png"; // ic??ne flamiche
			pos = "background-size: 55px; background-position: 50%";
		}
		if(breedIndex == 20 - 1) {
			url = this.gitFolderPath + "sprites/spells/4313.png"; // ic??ne forgelance
			pos = "background-size: 55px; background-position: 50%";
		}
		return "height: 54px; width: 54px;" +
			"margin-bottom: 5px; margin-left: 2px; margin-right: 3px;" +
			"box-sizing: border-box;" +
			"background: transparent url('" + url + "') 0 0 no-repeat; " + pos;
	}

	// fighter, enemy, ally, caster
	public getFighterIconStyle(mod: string) {
		// if (mod.includes("{enemy}")) return this.fighterSprite('enemy.png', 0, 9);
		// if (mod.includes("{ally}")) return this.fighterSprite('ally.png', 0, 9);
		// if (mod.includes("{fighter}")) return this.fighterSprite('fighter.png', 0, 9);
		// if (mod.includes("{caster}")) return this.fighterSprite('caster.png', 0, 9);

		return this.commonUrlPath + mod + ".png";
	}

	// private fighterSprite(imgName: string, x: number, y: number) {
	// 	return "vertical-align: middle; width: 22px; height: 32px; background-image: url('" + this.commonUrlPath + imgName + "'); background-repeat: no-repeat;"
	// 		+ "background-position: 50%;";
	// 	// + "background-position: " + x + "px; background-position-y: " + y + "px;";
	// }

	public getModIconStyle(mod: string) {
		mod = mod.replace("(", "").replace(")", "").replace(".", "");
		let words = mod.toLowerCase().split(" ");

		// console.log("mod: " + mod)
		// console.log("words: " + words)

		if (mod.toLowerCase().includes("r??sistance pouss??e")) return this.modSprite(97, 832);
		if (mod.toLowerCase().includes("r??sistance critique")) return this.modSprite(97, 1200);
		if (mod.toLowerCase().includes("esquive pm")) return this.modSprite(97, 1016);
		if (mod.toLowerCase().includes("esquive pa")) return this.modSprite(97, 1064);
		if (mod.toLowerCase().includes("retrait pa")) return this.modSprite(97, 1340);
		if (mod.toLowerCase().includes("retrait pm")) return this.modSprite(97, 1340);

		if (words.includes("pa")) return this.modSprite(97, 245);
		if (words.includes("pm")) return this.modSprite(97, 52);
		if (words.includes("port??e")) return this.modSprite(97, 128);

		if (words.includes("initiative")) return this.modSprite(97, 205);
		if (words.includes("invocation")) return this.modSprite(97, 507);
		if (words.includes("% critique")) return this.modSprite(97, 589);
		if (words.includes("prospection")) return this.modSprite(97, 279);

		if (words.includes("vie")) return this.modSprite(97, 919);
		if (words.includes("vitalit??")) return this.modSprite(97, 319);
		if (words.includes("sagesse")) return this.modSprite(97, 358);

		if (words.includes("neutre")) return this.modSprite(95, 15);
		if (words.includes("force") || words.includes("terre")) return this.modSprite(97, 432);
		if (words.includes("intelligence") || words.includes("feu")) return this.modSprite(97, 394);
		if (words.includes("chance") || words.includes("eau")) return this.modSprite(97, 89);
		if (words.includes("agilit??") || words.includes("air")) return this.modSprite(97, 167);
		if (words.includes("puissance")) return this.modSprite(97, 1108);

		if (words.includes("tacle")) return this.modSprite(97, 545);
		if (words.includes("fuite")) return this.modSprite(97, 469);

		if (words.includes("soin") || words.includes("soigne") || mod.toLowerCase().includes("pv rendus")) return this.modSprite(97, 966);
		if (mod == "Dommages") return this.modSprite(97, 1156);
		if (mod == "Dommages Pouss??e") return this.modSprite(97, 872);
		if (mod == "Dommages Critiques") return this.modSprite(97, 1248);
		if (mod == "Puissance aux pi??ges") return this.modSprite(97, 672);
		if (mod == "Dommages aux pi??ges") return this.modSprite(97, 712);

		return "";
	}

	private modSprite(x: number, y: number) {
		y -= 6;
		// x -= 1;
		// return "display: inline-block; zoom: 1.0; vertical-align: middle; width: 22px; height: 22px; background-image: url('/src/DofusDB/scraped/icons.png'); background-position: -" + x + "px; background-position-y: -" + y + "px;"
		return "vertical-align: middle; width: 22px; height: 32px; background-image: url('" + this.commonUrlPath + "icons.png');"
			+ "background-position: -" + x + "px; background-position-y: -" + y + "px;"
	}

	public isEffectState(e) {
		// ??tat
		// return e.effectId == 950 || e.effectId == 951;
		return e.effectId == ActionIds.ACTION_FIGHT_SET_STATE
			|| e.effectId == ActionIds.ACTION_FIGHT_UNSET_STATE;
	}
	public isEffectChargeCooldown(e) {
		// augmente ou r??duit le cooldown du sort 
		// return e.effectId == 1035 || e.effectId == 1036;
		return e.effectId == ActionIds.ACTION_CHARACTER_ADD_SPELL_COOLDOWN // 1035
			|| e.effectId == ActionIds.ACTION_CHARACTER_REMOVE_SPELL_COOLDOWN // 1036
			|| e.effectId == ActionIds.ACTION_CHARACTER_SET_SPELL_COOLDOWN // 1045
	}
	public isEffectCharge(e) {
		// effet de charge
		// return e.effectId == 293 || e.effectId == 281 || e.effectId == 290 || e.effectId == 291 || e.effectId == 280;
		return e.effectId == ActionIds.ACTION_BOOST_SPELL_BASE_DMG
			|| e.effectId == ActionIds.ACTION_BOOST_SPELL_RANGE_MIN
			|| e.effectId == ActionIds.ACTION_BOOST_SPELL_RANGE_MAX
			|| e.effectId == ActionIds.ACTION_BOOST_SPELL_MAXPERTURN
			|| e.effectId == ActionIds.ACTION_BOOST_SPELL_MAXPERTARGET
			|| e.effectId == ActionIds.ACTION_BOOST_SPELL_AP_COST // 285
			|| e.effectId == ActionIds.ACTION_BOOST_SPELL_NOLINEOFSIGHT // 289 

	}
	public isSubSpell(e) {
		// state condition, fouet osa dragocharge, +1 combo, morsure albinos
		// return e.effectId == 1160 || e.effectId == 2160 || e.effectId == 2794 || e.effectId == 792 || e.effectId == 1018;
		// in different order
		return e.effectId == ActionIds.ACTION_CASTER_EXECUTE_SPELL // 1160
			|| e.effectId == ActionIds.ACTION_CASTER_EXECUTE_SPELL_GLOBAL_LIMITATION // 2160
			|| e.effectId == ActionIds.ACTION_TARGET_EXECUTE_SPELL_GLOBAL_LIMITATION // 2792
			|| e.effectId == ActionIds.ACTION_TARGET_EXECUTE_SPELL_WITH_ANIMATION_GLOBAL_LIMITATION // 2793
			|| e.effectId == ActionIds.ACTION_TARGET_EXECUTE_SPELL_ON_CELL // 2794
			|| e.effectId == ActionIds.ACTION_TARGET_EXECUTE_SPELL_ON_CELL_GLOBAL_LIMITATION // 2795
			|| e.effectId == ActionIds.ACTION_TARGET_EXECUTE_SPELL // 792
			|| e.effectId == ActionIds.ACTION_TARGET_EXECUTE_SPELL_WITH_ANIMATION // 793
			|| e.effectId == ActionIds.ACTION_TARGET_EXECUTE_SPELL_ON_SOURCE // 1017
			|| e.effectId == ActionIds.ACTION_SOURCE_EXECUTE_SPELL_ON_TARGET // 1018
			|| e.effectId == ActionIds.ACTION_SOURCE_EXECUTE_SPELL_ON_SOURCE // 1019
			|| e.effectId == ActionIds.ACTION_CHARACTER_PROTECTION_FROM_SPELL

	}
	public isSummonEffect(e: any) {
		// return e.effectId == 181 || e.effectId == 405 || e.effectId == 1008 || e.effectId == 1011 || e.effectId == 2796;
		return e.effectId == ActionIds.ACTION_SUMMON_CREATURE
			|| e.effectId == ActionIds.ACTION_FIGHT_KILL_AND_SUMMON
			|| e.effectId == ActionIds.ACTION_SUMMON_BOMB
			|| e.effectId == ActionIds.ACTION_SUMMON_SLAVE
			|| e.effectId == ActionIds.ACTION_FIGHT_KILL_AND_SUMMON_SLAVE;

	}
	public isCellEffect(e: any) {
		// return (e.effectId == 400 || e.effectId == 401 || e.effectId == 402 || e.effectId == 1091 || e.effectId == 1165);
		return e.effectId == ActionIds.ACTION_FIGHT_ADD_TRAP_CASTING_SPELL // 400
			|| e.effectId == ActionIds.ACTION_FIGHT_ADD_GLYPH_CASTING_SPELL // 401
			|| e.effectId == ActionIds.ACTION_FIGHT_ADD_GLYPH_CASTING_SPELL_ENDTURN // 402
			|| e.effectId == ActionIds.ACTION_FIGHT_ADD_GLYPH_AURA // 1091
			|| e.effectId == ActionIds.ACTION_FIGHT_ADD_GLYPH_CASTING_SPELL_IMMEDIATE // 1165
	}

	public hasDispellIcon(e) {
		// this.isEffectState(e) || 
		if (this.isEffectCharge(e) || this.isEffectChargeCooldown(e) || this.isSubSpell(e) || this.isCellEffect(e) || this.isSummonEffect(e)) {
			return false;
		}
		// "triggers": "DA"
		if (e.triggers.startsWith("D")) {
			return false;
		}
		if (e.duration > 0)
			return true;
		return false;
	}

	public static readonly IS_DISPELLABLE = 1;
	public static readonly IS_DISPELLABLE_ONLY_BY_DEATH = 2;
	public static readonly IS_NOT_DISPELLABLE = 3;
	public getDispellIcon(e) {
		if (!this.hasDispellIcon(e)) {
			return "";
		}
		if (this.jsonGreenListEffects.dispell1.includes(e.effectUid))
			e.dispellable = db.IS_DISPELLABLE;
		if (this.jsonGreenListEffects.dispell2.includes(e.effectUid))
			e.dispellable = db.IS_DISPELLABLE_ONLY_BY_DEATH;
		if (this.jsonGreenListEffects.dispell3.includes(e.effectUid))
			e.dispellable = db.IS_NOT_DISPELLABLE;

		let name = "";
		if (e.dispellable == db.IS_DISPELLABLE) {
			name = "icons/dispell.webp";
		}
		if (e.dispellable == db.IS_DISPELLABLE_ONLY_BY_DEATH) {
			name = "icons/dispell_no.webp";
		}
		if (e.dispellable == db.IS_NOT_DISPELLABLE) {
			name = "icons/dispell_no.webp";
		}
		return this.commonUrlPath + name;
		// return "vertical-align: middle; width: 25px; height: 32px; background-image: url('" + this.commonUrlPath + name + "'); background-repeat: no-repeat;"
		// 	+ "background-position: 50%;";
	}

}

const container = DI.createContainer();
container.register(
	Registration.singleton(db, db)
);
