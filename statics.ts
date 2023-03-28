import { ActionIds } from "./code/ActionIds";

export class Statics {

	public static isEffectState(e) {
		// état
		// return e.effectId == 950 || e.effectId == 951;
		return [
			ActionIds.ACTION_FIGHT_SET_STATE,
			ActionIds.ACTION_FIGHT_UNSET_STATE,
			ActionIds.ACTION_FIGHT_DISABLE_STATE
		].includes(e.effectId);
	}
	public static isEffectChargeCooldown(e) {
		// augmente ou réduit le cooldown du sort 
		// return e.effectId == 1035 || e.effectId == 1036;
		return e.effectId == ActionIds.ACTION_CHARACTER_ADD_SPELL_COOLDOWN // 1035
			|| e.effectId == ActionIds.ACTION_CHARACTER_REMOVE_SPELL_COOLDOWN // 1036
			|| e.effectId == ActionIds.ACTION_CHARACTER_SET_SPELL_COOLDOWN // 1045
	}
	public static isEffectCharge(e) {
		let chargeEffects = Array(20).fill(280).map((x, y) => x + y); // 280 -> 299
		let chargeEffects2 = Array(22).fill(2913).map((x, y) => x + y); // 2913 -> 2934
		chargeEffects.push(...chargeEffects2);
		chargeEffects.push(1035, 1036, 1045); // ACTION_CHARACTER_ADD_SPELL_COOLDOWN, ACTION_CHARACTER_REMOVE_SPELL_COOLDOWN, ACTION_CHARACTER_SET_SPELL_COOLDOWN
		chargeEffects.push(2905, 2906);
		chargeEffects.push(798, 799);
		return chargeEffects.includes(e.effectId);
	}
	public static isSubSpell(e) {
		// state condition, fouet osa dragocharge, +1 combo, morsure albinos
		return [
			ActionIds.ACTION_CASTER_EXECUTE_SPELL, // 1160
			ActionIds.ACTION_CASTER_EXECUTE_SPELL_GLOBAL_LIMITATION, // 2160
			ActionIds.ACTION_TARGET_EXECUTE_SPELL_GLOBAL_LIMITATION, // 2792
			ActionIds.ACTION_TARGET_EXECUTE_SPELL_WITH_ANIMATION_GLOBAL_LIMITATION, // 2793
			ActionIds.ACTION_TARGET_EXECUTE_SPELL_ON_CELL, // 2794
			ActionIds.ACTION_TARGET_EXECUTE_SPELL_ON_CELL_GLOBAL_LIMITATION, // 2795
			ActionIds.ACTION_TARGET_EXECUTE_SPELL, // 792
			ActionIds.ACTION_TARGET_EXECUTE_SPELL_WITH_ANIMATION, // 793
			ActionIds.ACTION_TARGET_EXECUTE_SPELL_ON_SOURCE, // 1017
			ActionIds.ACTION_SOURCE_EXECUTE_SPELL_ON_TARGET, // 1018
			ActionIds.ACTION_SOURCE_EXECUTE_SPELL_ON_SOURCE, // 1019
			ActionIds.ACTION_CHARACTER_PROTECTION_FROM_SPELL, // 1044
			ActionIds.ACTION_CAST_STARTING_SPELL, // 1175
			ActionIds.ACTION_CASTER_EXECUTE_SPELL_ON_CELL, // 2960
		].includes(e.effectId);
	}
	public static isSummonEffect(e: any) {
		// ei.effectId == 181 || ei.effectId == 405 || ei.effectId == 1008 || ei.effectId == 1011 || ei.effectId == 2796
		return [
			ActionIds.ACTION_SUMMON_CREATURE, // 181
			ActionIds.ACTION_FIGHT_KILL_AND_SUMMON, // 405
			ActionIds.ACTION_SUMMON_BOMB, // 1008
			ActionIds.ACTION_SUMMON_SLAVE, // 1011
			ActionIds.ACTION_FIGHT_KILL_AND_SUMMON_SLAVE // 2796
		].includes(e.effectId);

	}
	public static isCellEffect(e: any) {
		return [
			ActionIds.ACTION_FIGHT_ADD_TRAP_CASTING_SPELL,  // 400
			ActionIds.ACTION_FIGHT_ADD_GLYPH_CASTING_SPELL, // 401
			ActionIds.ACTION_FIGHT_ADD_GLYPH_CASTING_SPELL_ENDTURN, // 402
			ActionIds.ACTION_FIGHT_ADD_GLYPH_AURA, // 1091
			ActionIds.ACTION_FIGHT_ADD_GLYPH_CASTING_SPELL_IMMEDIATE  // 1165
			// || e.effectId == ActionIds.ACTION_FIGHT_ADD_RUNE_CASTING_SPELL // 2022
		].includes(e.effectId);
	}
}
