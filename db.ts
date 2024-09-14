import { ActionIds } from './code/ActionIds';
import { SpellZone } from './formulas';
import versions from './versions.json'
import maps_kolo_ids from './scraped/common/mapIdsFlat.json'

import { DI, IEventAggregator, Registration } from 'aurelia';
import { HttpClient } from '@aurelia/fetch-client';
import importgreenlist from './static/greenlistEffects.json'


import jsonFeatures from '../DofusDB/features.json'
import { Statics } from './statics';
import { DofusCharacteristic, DofusEffectModel, DofusItem, DofusSet, DofusSpell } from '../ts/dofusModels';

export class db {

	private static http = new HttpClient();

	// lang should be stored on the client (local storage / session storage / cache / cookie)
	public lang_default = "fr";
	public lang: string = this.lang_default;
	// private _version: string = versions[0]; // first version is the latest
	private _effectMode: string = "basic";

	// actual json fetched 
	public data: DB = new DB("1");
	// json to compare with (i.e. a previous version)
	public data2: DB = new DB("2");
	//
	public jsonMaps: {} = {};
	public jsonGreenListEffects = importgreenlist;

	// selected
	public breedId: number = 1;
	private _selectedSpellSlot: number = 0;
	private _selectedOsaSummonSlot: number = -1;



	public constructor(@IEventAggregator readonly ea: IEventAggregator) {
		// data
		this.data.version = versions[0];
		this.data2.version = versions[1];
		this.data.ea = ea;
		this.data2.ea = ea;
		// connect to mongo
		// this.getToken();
		// load cached version and language
		let ver = localStorage.getItem("version");
		if (ver) this.setVersion(ver);
		let ver2 = localStorage.getItem("version2");
		if (ver2) this.setVersion2(ver2);
		let lan = localStorage.getItem("language");
		if (lan) this.setLanguage(lan);
		let mod = localStorage.getItem("effectMode");
		if (mod) this.setEffectMode(mod)
		let spellSlot = +localStorage.getItem("selectedSpellSlot");
		if (spellSlot) this.selectedSpellSlot = spellSlot;
		let osaSlot = +localStorage.getItem("selectedOsaSummonSlot");
		if (osaSlot) this.selectedOsaSlot = osaSlot;
		if (spellSlot < 0 && osaSlot < 0)
			this.selectedSpellSlot = 0;
		// console.log("db slot: " + this.selectedSpellSlot + ", " + this.selectedOsaSlot)
	}

	public promiseLoadingSpells: Promise<boolean>;
	// public promiseLoadingSpellsDetails: Promise<boolean>;
	public promiseLoadingBreeds: Promise<boolean>;
	public promiseLoadingSummons: Promise<boolean>;

	public get isLoaded() {
		return this.data.isLoaded
		// return this.jsonSpells && this.jsonBreeds
		// 	&& this.jsonSummons && this.jsonStates 
		// 	&& this.i18n_fr && this.i18n_en
	}

	public get isLoadedI18n() {
		if (this.lang == "fr") return this.data.jsonI18n_fr;
		if (this.lang == "en") return this.data.jsonI18n_en;
		if (this.lang == "es") return this.data.jsonI18n_es;
		return false;
	}

	public isFeature(name: string): boolean {
		return jsonFeatures[name];
	}

	public checkFeature(name: string): boolean {
		if (this.isFeature(name)) {
			return this.checkFeatureVersion(jsonFeatures[name]);
		}
		return true;
	}
	public checkFeatureVersion(version: string): boolean {
		let va = versions.indexOf(this.version);
		let vf = versions.indexOf(version);
		return va <= vf; // (plus petit = plus récent dans le tableau)
	}

	public setLanguage(lang: string) {
		if (this.lang != lang) {
			// console.log("db set language")
			this.lang = lang;
			localStorage.setItem("language", lang);
			this.data.loadJson().then((b) => {
				// console.log("db1 publish loaded")
				this.data.isLoaded = true;
				this.ea.publish("db:loaded");
			})
			this.data2.loadJson().then((b) => {
				// console.log("db2 publish loaded")
				this.data2.isLoaded = true;
				this.ea.publish("db:loaded:2");
			})
		}
	}
	public setEffectMode(mode: string) {
		// console.log("db setEffectMode: " + this._effectMode + " -> " + mode)
		if (this._effectMode != mode) {
			this._effectMode = mode;
			localStorage.setItem("effectMode", mode);
		}
	}

	public get effectMode() {
		return this._effectMode;
	}
	public get version() {
		return this.data.version;
	}
	public setVersion(version: string) {
		if (this.version == version) {
			// do nothing
		} else {
			// console.log("db set version")
			if (!versions.includes(version)) {
				// alert("Invalid version")
				version = versions[0]
			}
			this.data.version = version;
			let nextidx = Math.min(versions.indexOf(version) + 1, versions.length - 2); // 2 to ignore first version which was 2.64
			this.data2.version = versions[nextidx];
			// console.log("setVersion: " + this.data.version + " -> " + this.data2.version)
			localStorage.setItem("version", version);
			this.data.loadJson().then((b) => {
				// console.log("db1 publish loaded")
				this.data.isLoaded = true;
				this.ea.publish("db:loaded");
			})
			this.data2.loadJson().then((b) => {
				// console.log("db2 publish loaded")
				this.data2.isLoaded = true;
				this.ea.publish("db:loaded:2");
			})
		}
	}
	public setVersion2(version: string) {
		if (this.data2.version == version) {
			// do nothing
		} else {
			this.data2.version = version;
			this.data2.isLoaded = false;
			localStorage.setItem("version2", version);
			this.data2.loadJson().then((b) => {
				// console.log("db2 publish loaded " + version);
				this.data2.isLoaded = true;
				this.ea.publish("db:loaded:2");
			})
		}
	}


	public get selectedSpellSlot() {
		return this._selectedSpellSlot;
	}
	public set selectedSpellSlot(slot: number) {
		if (this._selectedSpellSlot != slot) {
			this._selectedSpellSlot = slot;
			localStorage.setItem("selectedSpellSlot", slot + "");
			// console.log("db set slot: " + this._selectedSpellSlot + ", " + this._selectedOsaSummonSlot)
		}
	}

	public get selectedOsaSlot() {
		return this._selectedOsaSummonSlot;
	}
	public set selectedOsaSlot(slot: number) {
		if (this._selectedOsaSummonSlot != slot) {
			this._selectedOsaSummonSlot = slot;
			localStorage.setItem("selectedOsaSummonSlot", slot + "");
			// console.log("db set slot: " + this._selectedSpellSlot + ", " + this._selectedOsaSummonSlot)
		}
	}

	public async loadMap(mapid: string) {
		// console.log("load map " + mapid)
		if (!mapid) return;
		let promise = await db.fetchJson(this.getMapPath(mapid), (json) => this.jsonMaps[mapid] = json);
		if (promise) {
			// console.log("db.loaded map: " + mapid + " = " + this.jsonMaps[mapid])
			this.ea.publish("db:loadmap");
		} else {
			console.log("db.loadMap failed")
		}
	}

	// https://raw.githubusercontent.com/Souchy/DofusDB/master/scraped/2.65/fr/spellsDetails.json
	// "http://192.168.2.11:9000/src/DofusDB/" //
	public static dofusDBGithubUrl = "https://raw.githubusercontent.com/Souchy/DofusDB/master/";
	public static githubScrapedUrlPath = db.dofusDBGithubUrl + "scraped/";
	public commonUrlPath: string = db.githubScrapedUrlPath + "common/";
	public get gitFolderPath() {
		return db.githubScrapedUrlPath + this.version + "/";
	}
	public static async fetchJson(path: string, setter: (json) => any) {
		return db.http.fetch(path)
			.then(response => response.status == 404 ? null : response.text())
			.then(data => {
				if (data == null) return false;
				setter(JSON.parse(data));
				return true;
			}).catch(() => {
				return false;
			});
	}
	public getMapPath(id: string): string {
		return this.commonUrlPath + "map_kolo/" + id + ".json";
	}

	public getSpellIconPath(spellId: number): string {
		let iconid = this.data.jsonSpells[spellId]?.iconId;
		if (!iconid) iconid = this.data2?.jsonSpells[spellId]?.iconId;
		return db.githubScrapedUrlPath + this.version + "/sprites/spells/" + iconid + ".png";
		// console.log("getSpellIconPath " + spellId + " = " + iconid); //JSON.stringify(this.jsonSpells[spellId]));
	}
	public getSpellObjectIconPath(spell: any): string {
		let iconid = spell.iconId
		return db.githubScrapedUrlPath + this.version + "/sprites/spells/" + iconid + ".png";
	}

	public getMonsterIconPath(monsterId: number): string {
		return db.githubScrapedUrlPath + this.version + "/sprites/monsters/" + monsterId + ".png";
	}

	public getI18n(id, lang: string = ""): string {
		if (lang == "")
			lang = this.lang;
		try {
			if (lang == "fr") {
				let str = this.data.jsonI18n_fr[id];
				if (str == undefined) str = this.data2.jsonI18n_fr[id];
				if (str == undefined) str = this.data.jsonI18n_en[id];
				if (str == undefined) str = this.data2.jsonI18n_en[id];
				if (str == undefined) throw new Error("missing text");
				return str;
			}
			if (lang == "en") {
				let str = this.data.jsonI18n_en[id];
				if (str == undefined) str = this.data2.jsonI18n_en[id];
				if (str == undefined) str = this.data.jsonI18n_fr[id];
				if (str == undefined) str = this.data2.jsonI18n_fr[id];
				if (str == undefined) throw new Error("missing text");
				return str;
			}
			if (lang == "es") {
				let str = this.data.jsonI18n_es[id];
				if (str == undefined) str = this.data2.jsonI18n_es[id];
				if (str == undefined) str = this.getI18n(id, "en");
				if (str == undefined) throw new Error("missing text");
				return str;
			}
		} catch (error) {
			// console.log("db.getI18n error key: " + id + ". Wait 30 seconds for the site to load.");
			if (lang == "fr")
				return "Texte manquant";
			if (lang == "en")
				return "Missing text";
			if (lang == "en")
				return "Falta texto";
		}
	}

	public hasI18n(id: string, lang: string = ""): boolean {
		let tex = this.getI18n(id, lang);
		if (tex == "Texte manquant") return false;
		if (tex == "Missing text") return false;
		if (tex == "Falta texto") return false;
		return true;
	}

	public getIconPath(name: string) {
		return this.commonUrlPath + name;
	}

	public getAoeIconUrl(effect: any) {
		if (this.checkFeature("unity")) {
			// out/ui/guidebook/Sprite/
			// combat_zoneeffet_anneau_200x200.png
			// combat_zoneeffet_anneauvrai_200x200.png
			// combat_zoneeffet_cerclerond_200x200.png
			// combat_zoneeffet_ligne_200x200.png
			// combat_zoneeffet_diagonale_200x200.png
			// combat_zoneeffet_etoile_200x200.png
			// combat_zoneeffet_point_200x200.png
			// combat_zoneeffet_vraiecroix_200x200.png
			// combat_zoneeffet_vraiecroixvide_200x200.png
			let zone = SpellZone.parseZoneUnity(effect.zoneDescr);
			// console.log("Zone: ");
			// let comparer = {
			// 	zoneDescr: effect.zoneDescr,
			// 	SpellZone: zone
			// }
			// console.log(comparer);
			if(zone) {
				return this.commonUrlPath + "icons/" + zone?.zoneName?.toLowerCase() + ".webp";
			} else {
				return "";
			}
		}

		// SEE:  EffectInstance, SpellheaderBlock.getSpellZoneChunkParams, SpellTooltipUi.getSpellZoneIconUri
		if (effect.rawZone == "C") // caster
			return "";

		let zoneEffect = SpellZone.parseZone(effect.rawZone);
		// if(effect.effectUid == 285104) {
		// console.log("zone: " + JSON.stringify(zoneEffect))
		// }
		let aoeName = zoneEffect.zoneName;
		if (aoeName == "star")
			return this.commonUrlPath + "icons/star.png";
		if (aoeName == "squareChecker")
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
		let pos;
		if (breedIndex == 19 - 1) {
			url = this.commonUrlPath + "commonSpell.png"; //this.gitFolderPath + "sprites/spells/350.png"; // icône flamiche
			pos = "background-size: 55px; background-position: 50%";
		} else
			if (breedIndex == 21 - 1) {
				url = this.gitFolderPath + "sprites/spells/10973.png"; // icône ferrage
				pos = "background-size: 55px; background-position: 50%";
			} else {
				if (breedIndex == 20 - 1) {
					breedIndex--;
				}
				pos = "background-position: 0px " + Math.ceil(-56.8 * breedIndex) + "px;";
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
		// console.log("mod: "+ mod);
		if (mod == "allyExceptCaster") mod = "ally";
		if (mod == "allExceptCaster") mod = "fighter";
		return this.commonUrlPath + mod + ".png";
	}

	// private fighterSprite(imgName: string, x: number, y: number) {
	// 	return "vertical-align: middle; width: 22px; height: 32px; background-image: url('" + this.commonUrlPath + imgName + "'); background-repeat: no-repeat;"
	// 		+ "background-position: 50%;";
	// 	// + "background-position: " + x + "px; background-position-y: " + y + "px;";
	// }

	public getModIconStyle(mod: string, item: boolean = false) {
		mod = mod.replace("(", "").replace(")", "").replace(".", "");
		let words = mod.toLowerCase().split(/[ ']/);

		// console.log("getModIconStyle: " + mod + " : " + words)

		// console.log("mod: " + mod)
		// console.log("words: " + words)

		if (mod.toLowerCase().includes("résistance poussée")) return this.modSprite(97, 832, item);
		if (mod.toLowerCase().includes("résistance critique")) return this.modSprite(97, 1200, item);
		if (mod.toLowerCase().includes("esquive pm")) return this.modSprite(97, 1016, item);
		if (mod.toLowerCase().includes("esquive pa")) return this.modSprite(97, 1064, item);
		if (mod.toLowerCase().includes("retrait pa")) return this.modSprite(97, 1340, item);
		if (mod.toLowerCase().includes("retrait pm")) return this.modSprite(97, 1340, item);

		if (words.includes("pa")) return this.modSprite(97, 245, item);
		if (words.includes("pm")) return this.modSprite(97, 52, item);
		if (words.includes("portée")) return this.modSprite(97, 128, item);

		if (words.includes("initiative")) return this.modSprite(97, 205, item);
		if (words.includes("invocation")) return this.modSprite(97, 507, item);
		if (words.includes("% critique")) return this.modSprite(97, 589, item);
		if (words.includes("prospection")) return this.modSprite(97, 279, item);

		if (words.includes("vie")) return this.modSprite(97, 919, item);
		if (words.includes("vitalité")) return this.modSprite(97, 319, item);
		if (words.includes("sagesse")) return this.modSprite(97, 358, item);

		if (words.includes("neutre")) return this.modSprite(95, 15, item);
		if (words.includes("force") || words.includes("terre")) return this.modSprite(97, 432, item);
		if (words.includes("intelligence") || words.includes("feu")) return this.modSprite(97, 394, item);
		if (words.includes("chance") || words.includes("eau")) return this.modSprite(97, 89, item);
		if (words.includes("agilité") || words.includes("air")) return this.modSprite(97, 167, item);
		if (words.includes("puissance")) return this.modSprite(97, 1108, item);

		if (words.includes("tacle")) return this.modSprite(97, 545, item);
		if (words.includes("fuite")) return this.modSprite(97, 469, item);

		if (words.includes("soin") || words.includes("soigne") || mod.toLowerCase().includes("pv rendus")) return this.modSprite(97, 966, item);
		if (mod == "Dommages") return this.modSprite(97, 1156, item);
		if (mod == "Dommages Poussée") return this.modSprite(97, 872, item);
		if (mod == "Dommages Critiques") return this.modSprite(97, 1248, item);
		if (mod == "Puissance aux pièges") return this.modSprite(97, 672, item);
		if (mod == "Dommages aux pièges") return this.modSprite(97, 712, item);

		return "";
	}

	private modSprite(x: number, y: number, item: boolean = false) {
		// str = str.replace("height: 32px;", "height: 22px;");
		if (item)
			y -= 2;
		else
			y -= 6;
		let height = item ? 22 : 32;
		// x -= 1;
		// return "display: inline-block; zoom: 1.0; vertical-align: middle; width: 22px; height: 22px; background-image: url('/src/DofusDB/scraped/icons.png'); background-position: -" + x + "px; background-position-y: -" + y + "px;"
		return "vertical-align: middle; width: 22px; height: " + height + "px; background-image: url('" + this.commonUrlPath + "icons.png');"
			+ "background-position: -" + x + "px; background-position-y: -" + y + "px;"
	}

	public isEffectState(e) {
		return Statics.isEffectState(e);
	}
	public static isEffectState(e) {
		return Statics.isEffectState(e);
	}
	public static isEffectChargeCooldown(e) {
		return Statics.isEffectChargeCooldown(e);
	}
	public static isEffectCharge(e) {
		return Statics.isEffectCharge(e);
	}
	public static isSubSpell(e) {
		return Statics.isSubSpell(e);
	}
	public static isSummonEffect(e: any) {
		return Statics.isSummonEffect(e);
	}
	public static isCellEffect(e: any) {
		return Statics.isCellEffect(e);
	}

	public hasDispellIcon(e) {
		// this.isEffectState(e) || 
		if (db.isEffectCharge(e) || db.isEffectChargeCooldown(e) || db.isSubSpell(e) || db.isCellEffect(e) || db.isSummonEffect(e)) {
			return false;
		}
		// "triggers": "DA"
		// if (e.triggers.startsWith("D")) {
		// 	return false;
		// }
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
		// console.log("dispellIcon: " + name)
		return this.commonUrlPath + name;
		// return "vertical-align: middle; width: 25px; height: 32px; background-image: url('" + this.commonUrlPath + name + "'); background-repeat: no-repeat;"
		// 	+ "background-position: 50%;";
	}


	public static getStatSections(): Map<string, number> {
		var sections = new Map<string, number>();
		sections.set("quickfus.filter.sections.pseudo", 0);
		// sections.set("quickfus.filter.sections.pseudoProperty", 10);
		// sections.set("quickfus.filter.sections.specials", 1);
		sections.set("quickfus.filter.sections.primary", 2);
		sections.set("quickfus.filter.sections.secondary", 3);
		sections.set("quickfus.filter.sections.damage", 4);
		sections.set("quickfus.filter.sections.resistance", 5);
		return sections;
	}
	public characRes = [37, 33, 34, 35, 36];
	public characResEle = [33, 34, 35, 36];
	public pseudoCharacs = [
		{
			"id": 10000,
			"name": "numres",
			"categoryId": 0,
			"mask": this.characRes,
			"count": true,
			"subcategoryId": 0
		},
		{
			"id": 10001,
			"name": "numresele",
			"categoryId": 0,
			"mask": this.characResEle,
			"count": true,
			"subcategoryId": 0
		},
		{
			"id": 10002,
			"name": "totres",
			"categoryId": 0,
			"mask": this.characRes,
			"count": false,
			"subcategoryId": 0
		},
		{
			"id": 10003,
			"name": "totresele",
			"categoryId": 0,
			"mask": this.characResEle,
			"count": false,
			"subcategoryId": 0
		},
		// 11 000+ = properties
		{
			"id": 11004,
			"name": "isLegendary",
			"categoryId": 0,
			"mask": [],
			"count": false,
			"subcategoryId": 1
		},
		// 12 000+ = specials
		// {
		// 	"id": 12004,
		// 	"name": "changed",
		// 	"categoryId": 0,
		// 	"mask": [],
		// 	"count": false,
		// 	"subcategoryId": 2
		// },
	];

	private token: any;
	public isConnected() {
		return this.token;
	}
	public async getToken() {
		if (this.token != "") return this.token;
		let res = await db.http.get("https://realm.mongodb.com/api/client/v2.0/app/data-ewvjc/auth/providers/anon-user/login");
		let json = await res.json();
		this.token = json.access_token;
		this.ea.publish("mongo:login", json.access_token);
		return this.token;
	}
	public async mongoItemsAggregate(pipeline): Promise<any> {
		let token = await this.getToken();
		// console.log("fetch with token: " + JSON.stringify(token));
		let url = "https://data.mongodb-api.com/app/data-ewvjc/endpoint/data/v1/action/aggregate";
		let bod = {
			"dataSource": "SouchyAtlasCluster0",
			"database": "encyclofus-2-66-5-18", // quickfus
			"collection": "items",
			"pipeline": pipeline
		}
		let pro = db.http.fetch(url, {
			method: "post",
			headers: {
				Authorization: 'Bearer ' + token
			},
			body: JSON.stringify(bod)
		});
		let res = await pro;
		if (res.ok) {
			// console.log("response ok: " + JSON.stringify(res));
			let json = await res.json();
			return json.documents;
		} else {
			// console.log("response not ok: " + JSON.stringify(res));
			this.token = "";
			return this.mongoItemsAggregate(pipeline);
		}
	}

	public parseStateToString(mask) {
		let stateId = +mask;
		let state = this.data.jsonStates[stateId];
		if (!state) {
			console.log("state doesnt exist: " + stateId)
			return "";
		}
		let stateName = this.getI18n(state.nameId);
		if (stateName && stateName.includes("{")) {
			stateName = stateName.replace("{", "").replace("}", "");
			let data = stateName.split(",");
			let html = data.find(t => t.includes("::")).split("::")[1];
			// console.log("state: " + html);
			return html;
		}
		else
			return `<font color="#ebc304">${stateName}</font>`
	}
}


export class DB {
	public name: string;
	public version: string;
	public isLoaded: boolean = false;
	public ea: IEventAggregator;
	// private http = new HttpClient();

	public jsonSpells: Record<string, DofusSpell>;
	public jsonBreeds: any;
	public jsonSummons: any;
	public jsonStates: any;
	public jsonI18n_fr: any;
	public jsonI18n_en: any;
	public jsonI18n_es: any;
	public jsonEffects: DofusEffectModel[]
	public jsonCharacteristics: any[]
	public jsonItems: DofusItem[]
	public jsonItemTypes: any[]
	public jsonItemSets: DofusSet[]
	// public jsonBombSpells: any[]

	public jsonCharacteristicsById: Record<number, DofusCharacteristic> = {};
	public jsonEffectsById: Record<number, DofusEffectModel> = {};
	public jsonItemsById: Record<number, DofusItem> = {};
	public jsonItemSetsById: Record<number, DofusSet> = {};

	public promiseItems: Promise<boolean>;
	public promiseItemSets: Promise<boolean>;
	public promiseItemTypes: Promise<boolean>;

	constructor(name: string) {
		this.name = name;
	}

	public async loadJson() { //: Promise<[boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]> {
		this.isLoaded = false;
		// console.log("data loading")

		this.promiseItems = db.fetchJson(this.gitFolderPath + "items.json", (json) => {
			this.jsonItems = json
			Object.assign(this.jsonItemsById, ...this.jsonItems.map((x) => ({ [x.id]: x })));
		});
		this.promiseItemSets = db.fetchJson(this.gitFolderPath + "itemsets.json", (json) => {
			this.jsonItemSets = json;
			Object.assign(this.jsonItemSetsById, ...this.jsonItemSets.map((x) => ({ [x.id]: x })));
		});
		this.promiseItemTypes = db.fetchJson(this.gitFolderPath + "itemtypes.json", (json) => this.jsonItemTypes = json);

		let promise = Promise.all([
			db.fetchJson(this.gitFolderPath + "i18n_fr.json", (json) => this.jsonI18n_fr = json).then((result) => {
				if (result) return true;
				return db.fetchJson(db.githubScrapedUrlPath + versions[0] + "/" + "i18n_fr.json", (json) => this.jsonI18n_fr = json)
			}),
			db.fetchJson(this.gitFolderPath + "i18n_en.json", (json) => this.jsonI18n_en = json).then((result) => {
				if (result) return true;
				return db.fetchJson(db.githubScrapedUrlPath + versions[0] + "/" + "i18n_en.json", (json) => this.jsonI18n_en = json)
			}),
			db.fetchJson(this.gitFolderPath + "i18n_es.json", (json) => this.jsonI18n_es = json).then((result) => {
				if (result) return true;
				return db.fetchJson(db.githubScrapedUrlPath + versions[0] + "/" + "i18n_es.json", (json) => this.jsonI18n_es = json)
			}),
			db.fetchJson(this.gitFolderPath + "spells.json", (json) => this.jsonSpells = json),
			db.fetchJson(this.gitFolderPath + "breeds.json", (json) => this.jsonBreeds = json),
			db.fetchJson(this.gitFolderPath + "summons.json", (json) => this.jsonSummons = json),
			db.fetchJson(this.gitFolderPath + "states.json", (json) => this.jsonStates = json),
			db.fetchJson(this.gitFolderPath + "effects.json", (json) => {
				this.jsonEffects = json;
				Object.assign(this.jsonEffectsById, ...this.jsonEffects.map((x) => ({ [x.id]: x })));
			}),
			db.fetchJson(this.gitFolderPath + "characteristics.json", (json) => {
				this.jsonCharacteristics = json;
				Object.assign(this.jsonCharacteristicsById, ...this.jsonCharacteristics.map((x) => ({ [x.id]: x })));
			}),
			this.promiseItems,
			this.promiseItemSets,
			this.promiseItemTypes
			// db.fetchJson(this.gitFolderPath + "bombspells.json", (json) =>  this.jsonBombSpells = json)
		]);

		this.manipulateSets();

		await promise;
		this.isLoaded = true;
		this.ea.publish("db:loaded:" + this.name);
		// console.log("data loading 1")
		return promise;
	}
	public get gitFolderPath() {
		return db.githubScrapedUrlPath + this.version + "/";
	}

	public async manipulateSets() {
		await this.promiseItemSets;
		await this.promiseItems
		this.jsonItemSets = this.jsonItemSets.map(set => {
			if (!set.itemsData)
				set.itemsData = [];
			if (set.itemsData?.length == 0) {
				let items = set.items.map(i => this.jsonItems.find(i2 => i2.id == i)).filter(i => i != null);
				set.itemsData = items;
			}
			// console.log(set)
			return set;
		})
			.filter((value, index, array) => value.effects.length > 0)
			.sort((a, b) => {
				let diff = this.highestItemLevel(b) - this.highestItemLevel(a);
				if (diff != 0) return diff;
				else return b.id - a.id;
			});
	}

	public highestItemLevel(set: DofusSet) {
		if (!set.itemsData)
			return 0;
		let levels: number[] = set.itemsData.map(i => i.level)
		let max = Math.max(...levels);
		// console.log("Max set item level: " + max)
		return max;
	}

	public getI18n(id, lang: string): string {
		try {
			if (lang == "fr") {
				let str = this.jsonI18n_fr[id];
				if (str == undefined) throw new Error("missing text");
				return str;
			}
			if (lang == "en") {
				let str = this.jsonI18n_en[id];
				if (str == undefined) throw new Error("missing text");
				return str;
			}
			if (lang == "es") {
				let str = this.jsonI18n_es[id];
				if (str == undefined) throw new Error("missing text");
				return str;
			}
		} catch (error) {
			return null;
		}
	}

}

const container = DI.createContainer();
container.register(
	Registration.singleton(db, db)
);
