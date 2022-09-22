import { loadavg } from "os";
import version from './scraped/version.json'

export class db {

	// lang should be stored on the client (local storage / session storage / cache / cookie)
	public static lang_default = "fr";
	public static lang: string = db.lang_default;
	public static version: string = version.latest;

	// actual json fetched 
	public static jsonSpells: any;
	public static jsonSpellsDetails: any;
	public static jsonSpellsName = "spells.json";
	public static jsonSpellsDetailsName = "spellsDetails.json";

	public static setLanguage(lang: string) {
		if(lang == db.lang) {
			// do nothing
		} else {
			db.lang = lang;
			db.loadJson();
		}
	}

	public static setVersionLatest() {
		db.setVersion(version.latest);
	}
	public static setVersion(version: string) {
		if(version == db.version) {
			// do nothing
		} else {
			db.version = version;
			db.loadJson();
		}
	}
	
	// need to implement this in every aurelia app using this module
	public static loadJson = () => {
		console.log("Json fetching unimplemented");
	};

	public static getJsonFolderPath() {
		return "src/DofusDB/scraped/" + db.version + "/" + db.lang + "/";
		//       src/DofusDB/scraped/      2.64/             fr/    spells.json
	}
	public static getJsonFolderPathFallback() {
		return "src/DofusDB/scraped/" + db.version + "/" + db.lang_default + "/";
	}



	
	private static scrapedUrlPath: string = "src/DofusDB/scraped/";
	private static commonUrlPath: string = "src/DofusDB/scraped/common/";

	public static getSpellIconPath(spellId: string) {
		return "src/DofusDB/scraped/spellIcons/" + spellId + ".png";
	}

	// public static getBreedIconStyle(breedIndex: number) {
	// 	return "background: transparent url(db.rootUrlPath + 'big.png') 0 0 no-repeat; background-position: -56px ${-57 * " + breedIndex + "}px;";
	// }

	public static getBreedIconStyle(breedIndex: number) {
		// console.log("db getBreedIconStyle")
		return "height: 54px; width: 54px;" +
		"margin-bottom: 5px; margin-left: 2px; margin-right: 3px;" +
		"box-sizing: border-box;" +
		"background: transparent url("+ db.commonUrlPath + "big.png" +") 0 0 no-repeat; background-position: -56px " + Math.ceil(-56.8 * breedIndex) + "px;";
	}

	public static getFighterIconStyle(mod: string) {
		if(mod.includes("{enemy}")) return db.fighterSprite(db.commonUrlPath + 'enemy.png', 0, 9);
		if(mod.includes("{ally}")) return db.fighterSprite(db.commonUrlPath + 'ally.png', 0, 9);
		if(mod.includes("{fighter}")) return db.fighterSprite(db.commonUrlPath + 'fighter.png', 0, 9);
		if(mod.includes("{caster}")) return db.fighterSprite(db.commonUrlPath + 'caster.png', 0, 9);
		return "";
	}
	
	private static fighterSprite(path: string, x: number, y: number) {
		return "vertical-align: middle; width: 22px; height: 22px; background-image: url('" + db.commonUrlPath + path + "'); background-repeat: no-repeat;"
				+ "background-position: " + x + "px; background-position-y: " + y + "px;";
	}
	
	public static getModIconStyle(mod: string) {
		if (mod.toLowerCase().includes(" pa ")) return db.modSprite(97, 243);
		if (mod.toLowerCase().includes(" pm ")) return db.modSprite(97, 52);
		if (mod.toLowerCase().includes("portée")) return db.modSprite(97, 128);

		if (mod.toLowerCase().includes("initiative")) return db.modSprite(97, 205);
		if (mod.toLowerCase().includes("invocation")) return db.modSprite(97, 507);
		if (mod.toLowerCase().includes("% critique")) return db.modSprite(97, 589);
		if (mod.toLowerCase().includes("prospection")) return db.modSprite(97, 279);

		if (mod.toLowerCase().includes("vie")) return db.modSprite(97, 919);
		if (mod.toLowerCase().includes("vitalité")) return db.modSprite(97, 319);
		if (mod.toLowerCase().includes("sagesse")) return db.modSprite(97, 358);

		if (mod.toLowerCase().includes("neutre")) return db.modSprite(95, 15);
		if (mod.toLowerCase().includes("force") || mod.toLowerCase().includes(" terre")) return db.modSprite(97, 432);
		if (mod.toLowerCase().includes("intelligence") || mod.toLowerCase().includes(" feu")) return db.modSprite(97, 394);
		if (mod.toLowerCase().includes("chance") || mod.toLowerCase().includes(" eau")) return db.modSprite(97, 89);
		if (mod.toLowerCase().includes("agilité") || mod.toLowerCase().includes(" air")) return db.modSprite(97, 167);
		if (mod == "Puissance") return db.modSprite(97, 1108);

		if (mod.toLowerCase().includes("tacle")) return db.modSprite(97, 545);
		if (mod.toLowerCase().includes("fuite")) return db.modSprite(97, 469);

		if (mod.toLowerCase().includes("résistance poussée")) return db.modSprite(97, 832);
		if (mod.toLowerCase().includes("résistance critique")) return db.modSprite(97, 1200);
		if (mod.toLowerCase().includes("esquive pm")) return db.modSprite(97, 1016);
		if (mod.toLowerCase().includes("esquive pa")) return db.modSprite(97, 1064);
		if (mod.toLowerCase().includes("retrait pa")) return db.modSprite(97, 1340);
		if (mod.toLowerCase().includes("retrait pm")) return db.modSprite(97, 1340);

		if (mod.toLowerCase().includes("soin")) return db.modSprite(97, 966);
		if (mod == "Dommages") return db.modSprite(97, 1156);
		if (mod == "Dommages Poussée") return db.modSprite(97, 872);
		if (mod == "Dommages Critiques") return db.modSprite(97, 1248);
		if (mod == "Puissance aux pièges") return db.modSprite(97, 672);
		if (mod == "Dommages aux pièges") return db.modSprite(97, 712);

		return "";
	}

	private static modSprite(x: number, y: number) {
		y -= 6;
		// return "display: inline-block; zoom: 1.0; vertical-align: middle; width: 22px; height: 22px; background-image: url('/src/DofusDB/scraped/icons.png'); background-position: -" + x + "px; background-position-y: -" + y + "px;"
		return "vertical-align: middle; width: 22px; height: 22px; background-image: url(" + db.commonUrlPath + "icons.png');" 
				+ "background-position: -" + x + "px; background-position-y: -" + y + "px;"
	}


}
