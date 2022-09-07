export class db {

	public static rootUrlPath: string = "";

	public static getEntityIconStyle(mod: string) {
		if(mod.includes("{enemy}")) return db.fighterSprite('src/DofusDB/scraped/enemy.png', 0, 9);
		if(mod.includes("{ally}")) return db.fighterSprite('src/DofusDB/scraped/ally.png', 0, 9);
		if(mod.includes("{fighter}")) return db.fighterSprite('src/DofusDB/scraped/fighter.png', 0, 9);
		if(mod.includes("{caster}")) return db.fighterSprite('src/DofusDB/scraped/caster.png', 0, 9);
		return "";
	}
	
	private static fighterSprite(path: string, x: number, y: number) {
		return "vertical-align: middle; width: 22px; height: 22px; background-image: url('"+path+"'); background-repeat: no-repeat;"
				+ "background-position: " + x + "px; background-position-y: " + y + "px;";
	}
	
	public static getModIconStyle(mod: string) {
		if (mod.toLowerCase().includes(" pa ")) return db.sprite(97, 243);
		if (mod.toLowerCase().includes(" pm ")) return db.sprite(97, 52);
		if (mod.toLowerCase().includes("portée")) return db.sprite(97, 128);

		if (mod.toLowerCase().includes("initiative")) return db.sprite(97, 205);
		if (mod.toLowerCase().includes("invocation")) return db.sprite(97, 507);
		if (mod.toLowerCase().includes("% critique")) return db.sprite(97, 589);
		if (mod.toLowerCase().includes("prospection")) return db.sprite(97, 279);

		if (mod.toLowerCase().includes("vie")) return db.sprite(97, 919);
		if (mod.toLowerCase().includes("vitalité")) return db.sprite(97, 319);
		if (mod.toLowerCase().includes("sagesse")) return db.sprite(97, 358);

		if (mod.toLowerCase().includes("neutre")) return db.sprite(95, 15);
		if (mod.toLowerCase().includes("force") || mod.toLowerCase().includes(" terre")) return db.sprite(97, 432);
		if (mod.toLowerCase().includes("intelligence") || mod.toLowerCase().includes(" feu")) return db.sprite(97, 394);
		if (mod.toLowerCase().includes("chance") || mod.toLowerCase().includes(" eau")) return db.sprite(97, 89);
		if (mod.toLowerCase().includes("agilité") || mod.toLowerCase().includes(" air")) return db.sprite(97, 167);
		if (mod == "Puissance") return db.sprite(97, 1108);

		if (mod.toLowerCase().includes("tacle")) return db.sprite(97, 545);
		if (mod.toLowerCase().includes("fuite")) return db.sprite(97, 469);

		if (mod.toLowerCase().includes("résistance poussée")) return db.sprite(97, 832);
		if (mod.toLowerCase().includes("résistance critique")) return db.sprite(97, 1200);
		if (mod.toLowerCase().includes("esquive pm")) return db.sprite(97, 1016);
		if (mod.toLowerCase().includes("esquive pa")) return db.sprite(97, 1064);
		if (mod.toLowerCase().includes("retrait pa")) return db.sprite(97, 1340);
		if (mod.toLowerCase().includes("retrait pm")) return db.sprite(97, 1340);

		if (mod.toLowerCase().includes("soin")) return db.sprite(97, 966);
		if (mod == "Dommages") return db.sprite(97, 1156);
		if (mod == "Dommages Poussée") return db.sprite(97, 872);
		if (mod == "Dommages Critiques") return db.sprite(97, 1248);
		if (mod == "Puissance aux pièges") return db.sprite(97, 672);
		if (mod == "Dommages aux pièges") return db.sprite(97, 712);

		return "";
	}



	private static sprite(x: number, y: number) {
		y -= 6;
		// return "display: inline-block; zoom: 1.0; vertical-align: middle; width: 22px; height: 22px; background-image: url('/src/DofusDB/scraped/icons.png'); background-position: -" + x + "px; background-position-y: -" + y + "px;"
		return "vertical-align: middle; width: 22px; height: 22px; background-image: url('src/DofusDB/scraped/icons.png');" 
				+ "background-position: -" + x + "px; background-position-y: -" + y + "px;"
	}


}
