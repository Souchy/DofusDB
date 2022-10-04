import { loadavg } from "os";
import versions from './versions.json'

import { DI, Registration } from 'aurelia';
import { HttpClient } from '@aurelia/fetch-client';

export class db {

	private http = new HttpClient();

	// lang should be stored on the client (local storage / session storage / cache / cookie)
	public lang_default = "fr";
	public lang: string = this.lang_default;
	private _version: string = versions[0]; // first version is the latest

	// actual json fetched 
	public jsonSpells: any;
	public jsonSpellsDetails: any;
	public jsonBreeds: any;
	public jsonSummons: any;
	public jsonStates: any;
	public i18n_fr: any;
	public i18n_en: any;
	// json names
	public jsonSpellsName = "spells.json";
	public jsonSpellsDetailsName = "spellsDetails.json";
	public jsonBreedsName = "breeds.json";
	public jsonSummonsName = "summons.json";
	public breedId: number = 1;

	public constructor() {
		// load cached version and language
		let ver = localStorage.getItem("version");
		if (ver) this.setVersion(ver);
		let lan = localStorage.getItem("language");
		if (lan) this.setLanguage(lan);
	}

	public promiseLoadingSpells: Promise<boolean>;
	public promiseLoadingSpellsDetails: Promise<boolean>;
	public promiseLoadingBreeds: Promise<boolean>;
	public promiseLoadingSummons: Promise<boolean>;

	public get isLoaded() {
		return this.jsonSpells && this.jsonSpellsDetails && this.jsonBreeds 
			&& this.jsonSummons && this.jsonStates && this.i18n_fr && this.i18n_en;
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

	public async loadJson() {
		this.promiseLoadingSpells = this.fetchJson(this.gitFolderPath + this.jsonSpellsName, (json) => this.jsonSpells = json);
		this.promiseLoadingSpellsDetails = this.fetchJson(this.gitFolderPath + this.lang + "/" + this.jsonSpellsDetailsName,
			(json) => this.jsonSpellsDetails = json
		);
		this.promiseLoadingBreeds = this.fetchJson(this.gitFolderPath + this.jsonBreedsName, (json) => this.jsonBreeds = json);
		this.promiseLoadingSummons = this.fetchJson(this.gitFolderPath + this.jsonSummonsName, (json) => this.jsonSummons = json);
		// console.log("loaded = promise: " + this.promiseLoadingSpells)

		await this.promiseLoadingBreeds;
		await this.promiseLoadingSummons;

		let result = await this.promiseLoadingSpells;
		result = await this.promiseLoadingSpellsDetails;

		await this.fetchJson(this.gitFolderPath + "i18n_fr.json", (json) => this.i18n_fr = json);
		await this.fetchJson(this.gitFolderPath + "i18n_en.json", (json) => this.i18n_en = json);
		await this.fetchJson(this.gitFolderPath + "states.json", (json) => this.jsonStates = json);
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
	private dofusDBGithubUrl = "https://raw.githubusercontent.com/Souchy/DofusDB/master/";
	private githubScrapedUrlPath = this.dofusDBGithubUrl + "scraped/";
	private commonUrlPath: string = this.githubScrapedUrlPath + "common/";
	public get gitFolderPath() {
		return this.githubScrapedUrlPath + this.version + "/";
	}

	public getSpellIconPath(spellId: number): string {
		let iconid = this.jsonSpells[spellId].iconId;
		// console.log("getSpellIconPath " + spellId + " = " + iconid); //JSON.stringify(this.jsonSpells[spellId]));
		return this.githubScrapedUrlPath + this.version + "/sprites/spells/" + iconid + ".png";
	}
	public getMonsterIconPath(monsterId: number): string {
		return this.githubScrapedUrlPath + this.version + "/sprites/monsters/" + monsterId + ".png";
	}

	public getI18n(id: number): string {
		if (this.lang == "fr")
			return this.i18n_fr[id];
		if (this.lang == "en")
			return this.i18n_en[id];
	}

	public getIconPath(name: string) {
		return this.commonUrlPath + name;
	}

	public getAoeIconStyle(effect: any) {
		let aoeName; 
		if(effect.rawZone.startsWith("P")) aoeName = "point";
		if(effect.rawZone.startsWith("C")) aoeName = "circle";
		if(effect.rawZone.startsWith("G")) aoeName = "square";
		if(effect.rawZone.startsWith("L")) aoeName = "line";
		if(effect.rawZone.startsWith("l")) aoeName = "line";
		if(effect.rawZone.startsWith("T")) aoeName = "line2";
		if(effect.rawZone.startsWith("X")) aoeName = "cross";
		if(effect.rawZone.startsWith("+")) aoeName = "x";
		if(effect.rawZone.startsWith("O")) aoeName = "check"; // FIXME
		if(effect.rawZone.startsWith("Q")) aoeName = "check"; // FIXME
		if(effect.rawZone.startsWith("U")) aoeName = "arc";   // FIXME
		if(aoeName)
			return "vertical-align: middle; width: 37px; height: 32px; background-image: url('" + this.commonUrlPath + "icons/" + aoeName + ".webp');"
				+ "background-repeat: no-repeat; background-position: 50%;"; //background-position: " + 0 + "px; background-position-y: " + 7 + "px;";
		else return "";
	}
	public getBreedIconStyle(breedIndex: number) {
		let url = this.commonUrlPath + "big.png";
		let pos = "background-position: -56px " + Math.ceil(-56.8 * breedIndex) + "px;";
		if(breedIndex == 19 - 1) {
			url = this.gitFolderPath + "sprites/spells/350.png"; // icône flamiche
			pos = "background-size: 55px; background-position: 50%";
		}
		return "height: 54px; width: 54px;" +
			"margin-bottom: 5px; margin-left: 2px; margin-right: 3px;" +
			"box-sizing: border-box;" +
			"background: transparent url('"+url+"') 0 0 no-repeat; " + pos;
	}

	public getFighterIconStyle(mod: string) {
		if (mod.includes("{enemy}")) return this.fighterSprite('enemy.png', 0, 9);
		if (mod.includes("{ally}")) return this.fighterSprite('ally.png', 0, 9);
		if (mod.includes("{fighter}")) return this.fighterSprite('fighter.png', 0, 9);
		if (mod.includes("{caster}")) return this.fighterSprite('caster.png', 0, 9);
		return "";
	}

	private fighterSprite(imgName: string, x: number, y: number) {
		return "vertical-align: middle; width: 22px; height: 32px; background-image: url('" + this.commonUrlPath + imgName + "'); background-repeat: no-repeat;"
			+ "background-position: 50%;";
			// + "background-position: " + x + "px; background-position-y: " + y + "px;";
	}

	public getModIconStyle(mod: string) {
		if (mod.toLowerCase().includes(" pa ")) return this.modSprite(97, 245);
		if (mod.toLowerCase().includes(" pm ")) return this.modSprite(97, 52);
		if (mod.toLowerCase().includes("portée")) return this.modSprite(97, 128);

		if (mod.toLowerCase().includes("initiative")) return this.modSprite(97, 205);
		if (mod.toLowerCase().includes("invocation")) return this.modSprite(97, 507);
		if (mod.toLowerCase().includes("% critique")) return this.modSprite(97, 589);
		if (mod.toLowerCase().includes("prospection")) return this.modSprite(97, 279);

		if (mod.toLowerCase().includes("vie")) return this.modSprite(97, 919);
		if (mod.toLowerCase().includes("vitalité")) return this.modSprite(97, 319);
		if (mod.toLowerCase().includes("sagesse")) return this.modSprite(97, 358);

		if (mod.toLowerCase().includes("neutre")) return this.modSprite(95, 15);
		if (mod.toLowerCase().includes("force") || mod.toLowerCase().includes(" terre")) return this.modSprite(97, 432);
		if (mod.toLowerCase().includes("intelligence") || mod.toLowerCase().includes(" feu")) return this.modSprite(97, 394);
		if (mod.toLowerCase().includes("chance") || mod.toLowerCase().includes(" eau")) return this.modSprite(97, 89);
		if (mod.toLowerCase().includes("agilité") || mod.toLowerCase().includes(" air")) return this.modSprite(97, 167);
		if (mod == "Puissance") return this.modSprite(97, 1108);

		if (mod.toLowerCase().includes("tacle")) return this.modSprite(97, 545);
		if (mod.toLowerCase().includes("fuite")) return this.modSprite(97, 469);

		if (mod.toLowerCase().includes("résistance poussée")) return this.modSprite(97, 832);
		if (mod.toLowerCase().includes("résistance critique")) return this.modSprite(97, 1200);
		if (mod.toLowerCase().includes("esquive pm")) return this.modSprite(97, 1016);
		if (mod.toLowerCase().includes("esquive pa")) return this.modSprite(97, 1064);
		if (mod.toLowerCase().includes("retrait pa")) return this.modSprite(97, 1340);
		if (mod.toLowerCase().includes("retrait pm")) return this.modSprite(97, 1340);

		if (mod.toLowerCase().includes("soin")) return this.modSprite(97, 966);
		if (mod == "Dommages") return this.modSprite(97, 1156);
		if (mod == "Dommages Poussée") return this.modSprite(97, 872);
		if (mod == "Dommages Critiques") return this.modSprite(97, 1248);
		if (mod == "Puissance aux pièges") return this.modSprite(97, 672);
		if (mod == "Dommages aux pièges") return this.modSprite(97, 712);

		return "";
	}

	private modSprite(x: number, y: number) {
		y -= 6;
		// x -= 1;
		// return "display: inline-block; zoom: 1.0; vertical-align: middle; width: 22px; height: 22px; background-image: url('/src/DofusDB/scraped/icons.png'); background-position: -" + x + "px; background-position-y: -" + y + "px;"
		return "vertical-align: middle; width: 22px; height: 32px; background-image: url('" + this.commonUrlPath + "icons.png');"
			+ "background-position: -" + x + "px; background-position-y: -" + y + "px;"
	}

	public isSummonEffect(e: any) {
		return (e.effectId == 181 || e.effectId == 405 || e.effectId == 1008 || e.effectId == 1011 || e.effectId == 2796);
	}
	public isCellEffect(e: any) {
		return (e.effectId == 400 || e.effectId == 401 || e.effectId == 402 || e.effectId == 1091 || e.effectId == 1165);
	}
}

const container = DI.createContainer();
container.register(
	Registration.singleton(db, db)
);
