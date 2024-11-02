import { db } from './db';
import { DI, IEventAggregator, Registration } from 'aurelia';
import { addAbortSignal } from 'stream';
import { I18N } from '@aurelia/i18n';
import { MapTools } from './static/formulas/maptools';

export class Formulas {

}


const container = DI.createContainer();
container.register(
    Registration.singleton(Formulas, Formulas)
);

export class Vector2 {
    public x: number
    public y: number
    // public constructor() {}
    public static zero(): Vector2 {
        return { x: 0, y: 0 };
    }
    public constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Cell {
    public floor: number
    public mov: boolean
    public nonWalkableDuringFight: boolean
    public nonWalkableDuringRP: boolean
    public los: boolean
    public blue: boolean
    public red: boolean
    public visible: boolean
    public farmCell: boolean
    // public havenbagCell: boolean
    public speed: number
    public mapChangeData: number
    public moveZone: number
    public _linkedZone?: number
}


export const posVIP0 = 72; // 2,5 // 5,0 // l'origine
export const posVIP1 = 102; // 4,7 // 8,1 // la diago
export const posVIP2 = 117; // 5,8 // 9,1 // la diago +1 trop loin
export const posVIP3 = 115; // 3,8 // 7,-1 // celle à côté à gauche
export class Board {

    public readonly cellHalf = 0.5;
    public cells: Cell[] = []
    public objects: boolean[] = []
    public target: number = -1


    public getCaseCoordonnee(id) {
        let width = 14;
        let height = 20;

        var _loc5 = Math.floor(id / (width * 2 - 1));
        var _loc6 = id - _loc5 * (width * 2 - 1);
        var _loc7 = _loc6 % width;
        var pos = Vector2.zero();
        pos.y = _loc5 - _loc7;
        pos.x = (id - (width - 1) * pos.y) / width;
        return (pos);
    }
    public dofus1CheckView(id0, id1) {
        let pos0 = this.getCaseCoordonnee(id0);
        let pos1 = this.getCaseCoordonnee(id1);
        let data0 = this.cells[id0];
        let data1 = this.cells[id1];
    }
    public getCaseNum(x, y) {
        var width = 14; //mapHandler.getWidth();
        return (x * width + y * (width - 1));
    };
    // public checkViewById(id0: number, id1: number) {
    // 	let pos0 = this.getPos(id0)
    // 	let pos1 = this.getPos(id1)
    // 	return this.checkView(pos0, pos1);
    // }

    public getPos(id) {
        return {
            x: this.getX(id),
            y: this.getY(id)
        }
    }

    // 72 : 2,5 -> 0,5
    public getPosOrtho(id) {
        let pos = this.getPos(id);
        // let h = id % 29;
    }
    public getIdOrtho(x, y) {

    }
    public getPolarity(id) {
        return this.getY(id) % 2;
    }

    public getCellCoordById(id: number): Vector2 {
        var y: number = Math.floor(id / 14) //MapTools.MAP_GRID_WIDTH);
        var halfY: number = Math.floor((y + 1) / 2);
        var halfY2 = y - halfY; // : * = 
        var x = id - y * 14; //MapTools.MAP_GRID_WIDTH; // : * = 
        return new Vector2(halfY + x, x - halfY2);
    }
    public getCellIdByCoord(x: number, y: number): number {
        return Math.floor(Number((x - y) * 14 + y + (x - y) / 2));
    }

    // Check Dofus 2  LosDetector+MapTools+DOfus2Line+MapToolsConfig
    public losDetectorDofus2(cell1: number, cell2: number) {
        let line = MapTools.getCellsCoordBetween(cell1, cell2);
        if (line.length == 0) return true;
        for (let cell of line) {
            this.checkCellView(cell.x, cell.y);
        }
    }

    public getDist(cell1: number, cell2: number) {
        let pos0 = this.getCellCoordById(cell1)
        let pos1 = this.getCellCoordById(cell2)
        let dist = Math.abs(pos0.x - pos1.x) + Math.abs(pos0.y - pos1.y);
        return dist;
    }

    public getMapPoint(cellid) {
        let coord = this.getCellCoordById(cellid);
        return {
            cellId: cellid,
            x: coord.x,
            y: coord.y
        }
    }

    // LosDetector.getCell // range: number[], 
    public getViews(target: number): number[] {
        let check1 = 305;
        let check2 = 275;
        let log = false;

        let range = [...Array(this.cells.length).keys()];

        let refPosition = this.getMapPoint(target);
        var orderedCell = range.map(c => {
            return {
                p: this.getMapPoint(c),
                dist: this.getDist(target, c)
            }
        }).sort((c1, c2) => {
            return c2.dist - c1.dist;
        })
        if(log) console.log(orderedCell)
        // orderedCell.sortOn("dist", Array.DESCENDING | Array.NUMERIC);

        var tested: boolean[] = [];
        var result: number[] = [];
        for (let i = 0; i < orderedCell.length; i++) {
            // p = MapPoint(orderedCell[i].p);
            let p = orderedCell[i].p;

            if (!(tested[p.x + "_" + p.y] != null && refPosition.x + refPosition.y != p.x + p.y && refPosition.x - refPosition.y != p.x - p.y)) {
                // line = Dofus2Line.getLine(refPosition.cellId, p.cellId);
                let line = MapTools.getCellsCoordBetween(refPosition.cellId, p.cellId);
                if (line.length == 0) {
                    result.push(p.cellId);
                }
                else {
                    let los = true;
                    let currentPoint: string = null;

                    for (let j = 0; j < line.length; j++) {
                        let cell = line[j];
                        let mapcell = this.cells[cell.id];
                        currentPoint = Math.floor(cell.x) + "_" + Math.floor(cell.y);
                        let isinmap = this.cells[cell.id] && this.isInMap(cell.x, cell.y);
                        if(log && cell.id == check1) {
                            console.log("isinmap: " + isinmap)
                        }

                        if (isinmap) { //MapPoint.isInMap(cell.x, cell.y)) {
                            let hasObject = this.objects[cell.id]; //mapData.hasEntity(Math.floor(line[j - 1].x), Math.floor(line[j - 1].y), true);
                            let hasLos = mapcell.los; //mapData.pointLos(Math.floor(cell.x), Math.floor(cell.y), true);
                            if (j >= 0 && hasObject) {
                                los = false;
                            }
                            else if (cell.x + cell.y == refPosition.x + refPosition.y || cell.x - cell.y == refPosition.x - refPosition.y) {
                                los = los && hasLos;
                            }
                            else if (tested[currentPoint] == null) {
                                los = los && hasLos;
                            }
                            else {
                                los = los && tested[currentPoint];
                            }
                        }
                    }
                    tested[currentPoint] = los;
                }
            }
        }
        for (let i = 0; i < range.length; i++) {
            let mp = this.getMapPoint(range[i]);
            if (tested[mp.x + "_" + mp.y]) {
                result.push(mp.cellId);
            }
        }
        return result;
    }
    public isInMap(x: number, y: number): boolean {
        return x + y >= 0 && x - y >= 0 && x - y < MapTools.MAP_GRID_HEIGHT * 2 && x + y < MapTools.MAP_GRID_WIDTH * 2;
    }


    // Check FlashDevelop Dofus1.pathfinding
    public checkView(id0: number, id1: number) { // pos0: Vector2, pos1: Vector2) {
        // let pos0 = this.getPos(id0)
        // let pos1 = this.getPos(id1)
        let pos0 = this.getCellCoordById(id0) //this.getCaseCoordonnee(id0);
        let pos1 = this.getCellCoordById(id1) //this.getCaseCoordonnee(id1);
        // let id0 = this.getId(pos0.x, pos0.y);
        // let id1 = this.getId(pos1.x, pos1.y);
        let log = (id0 == 226 && id1 == 256) || (id0 == 256 && id1 == 226) || (id0 == 305 && id1 == 275); // id1 == posVIP2;
        if (log) console.log("--------------")

        let dirY = pos1.y - pos0.y >= 0 ? 1 : -1;
        let dirX = pos1.x - pos0.x >= 0 ? 1 : -1;

        if (pos0.x == pos1.x) {
            for (let i = pos0.y; i * dirY <= pos1.y * dirY; i += dirY) {
                let tx = pos0.x;
                let ty = i;
                if (!this.checkCellView(tx, ty))
                    return false;
            }
            return true;
        }
        let dy = (pos0.y - pos1.y)
        let dx = (pos0.x - pos1.x)
        let slope = dy / dx;
        if (log) console.log("dy: " + dy + ", dx: " + dx + ", slope: " + slope)

        let c = pos0.y - slope * pos0.x;
        let f = (x) => slope * x + c;

        let x1Abs = pos1.x * dirX;

        let x = pos0.x + this.cellHalf * dirX;
        let y = pos0.y;

        let v0 = pos0.y;

        if (log) console.log("pos0 " + JSON.stringify(pos0) + ", pos1 " + JSON.stringify(pos1));
        if (log) console.log("dir(" + dirX + "," + dirY + ") slope: " + slope + ", c: " + c + ", x1Abs: " + x1Abs);
        if (log) console.log("x: " + x + ",  x * dirX: " + (x * dirX) + ", x1Abs + dirX: " + (x1Abs + dirX));

        while (x * dirX <= x1Abs) {
            let y2 = f(x);
            if (log) console.log("xy2: " + x + ", " + y2)

            if (dirY > 0) y2 = Math.min(pos1.y, y2);
            else y2 = Math.max(pos1.y, y2);

            let y3 = 0;
            let y4 = 0;
            if (dirY > 0) {
                y3 = Math.round(y2)
                y4 = Math.ceil(y2 - this.cellHalf)
            } else {
                y3 = Math.ceil(y2 - this.cellHalf)
                y4 = Math.round(y2)
            }
            y = v0;

            if (log) console.log("a " + x + ", " + y + " // y2: " + y2 + " l21: " + y3 + ", l22: " + y4);

            while (y * dirY <= y4 * dirY) {
                let tx = (x - this.cellHalf * dirX);
                let ty = y;
                if (log) console.log("txy1: " + tx + ", " + ty)
                if (!this.checkCellView(tx, ty)) {
                    if (log) console.log("check return false 1")
                    return false;
                }
                y += dirY;
            }
            v0 = y3;
            x += dirX;
        }
        y = v0;

        while (y * dirY <= pos1.y * dirY) {
            let tx = (x - this.cellHalf * dirX);
            let ty = y;
            if (log) console.log("txy2: " + tx + ", " + ty)
            if (!this.checkCellView(tx, ty)) {
                if (log) console.log("check return false 2")
                return false;
            }
            y += dirY;
        }

        {
            let tx = (x - this.cellHalf * dirX);
            let ty = (y - dirY);
            if (log) console.log("txy3: " + tx + ", " + ty)
            if (!this.checkCellView(tx, ty)) {
                if (log) console.log("check return false 3")
                return false;
            }
        }

        return true;
    }

    /**
     * Check if the caster can cast through the cell and through any creature on the cell
     */
    public checkCellView(x, y) {
        let id = this.getCellIdByCoord(x, y)
        let c = this.cells[id]
        if (!c) return false;
        if (!c.los) return false;
        if (this.objects[id]) return false;
        // if(x == 7 && y == 0) console.log("checkCellView 7,0: " + JSON.stringify(c));
        return true;
    }

    public checkCellView1(x, y, bool, pos0, pos1, zDiff, d) {
        var id = this.getCaseNum(x, y);
        var data = this.cells[id];

        if (!data.los) return false;
        if (this.objects[id]) return false;


        // var data = mapHandler.getCellData(id);
        var maxDelta = Math.max(Math.abs(pos0.y - y), Math.abs(pos0.x - x));
        var _loc13 = maxDelta / d * zDiff + pos0.z;
        var height = 0; // mapHandler.getCellHeight(id);
        let asd = (maxDelta == 0 || (bool || pos1.x == x && pos1.y == y))
        var _loc15 = !this.objects[id] || !asd //data.spriteOnID == undefined || !asd;

        if (data.los && (height <= _loc13 && !_loc15)) {
            return (true);
        }
        else {
            return bool;
        } // end else if
    };


    // assuming y goes from 0 to 39 instead of 19
    public getX(id) {
        return id % 14;
    }
    // assuming y goes from 0 to 39 instead of 19
    public getY(id) {
        return (id - this.getX(id)) / 14;
    }
    // assuming y goes from 0 to 39 instead of 19
    public getId(x, y) {
        return y * 14 + x;
    }
    // assuming y goes from 0 to 39 instead of 19
    public getByXY(x, y): Cell {
        let id = this.getId(x, y);
        return this.cells[id];
    }

    // public getByXYZ(x, y, z): Cell {
    //     let id = y * 14 + x + x * z;
    // 	return this.cells[id]; //this.cells.get(x, y);
    // }
    // public getByPos(pos): Cell {
    // 	return this.getByXYZ(pos.x, pos.y, pos.z);
    // }
    // public get(entity): Cell {
    // 	var pos = entity["position"]; // entity.get(Position.class);
    // 	if(pos == null) return null;
    // 	return this.getByPos(pos);
    // }


}

export enum SpellZoneShape {
	None = 0,
	Empty = 32,
	DiagonalCrossWithoutCenter = 35,
	Star = 42,
	DiagonalCross = 43,
	DiagonalPerpendicularLine = 45,
	DiagonalLine = 47,
	Custom = 59,
	WholeMapWithTheDead = 65,
	Boomerang = 66,
	Circle = 67,
	Checkerboard = 68,
	Fork = 70,
	Square = 71,
	OutsideCircle = 73,
	Line = 76,
	Ring = 79,
	Point = 80,
	CrossWithoutCenter = 81,
	Rectangle = 82,
	PerpendicularLine = 84,
	HalfCircle = 85,
	Cone = 86,
	SquareWithoutDiagonals = 87,
	Cross = 88,
	OutsideComplexCircle = 90,
	WholeMap = 97,
	LineFromCaster = 108,
}
export enum OldZoneShape {
    empty = 32,
    sharp = 35,
    star = 42,
    plus = 43,
    minus = 45,
    slash = 47,
    semicolon = 59,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    G = 71,
    I = 73,
    L = 76,
    O = 79,
    P = 80,
    Q = 81,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Z = 90,
    a = 97,
    l = 108,
    R = 82,
    F = 70,
    UNKNOWN = 0,
}
export class SpellZone {

    public static readonly empty: number = 32;
    public static readonly sharp: number = 35;
    public static readonly star: number = 42;
    public static readonly plus: number = 43;
    public static readonly minus: number = 45;
    public static readonly slash: number = 47;
    public static readonly semicolon: number = 59;
    public static readonly A: number = 65;
    public static readonly B: number = 66;
    public static readonly C: number = 67;
    public static readonly D: number = 68;
    public static readonly G: number = 71;
    public static readonly I: number = 73;
    public static readonly L: number = 76;
    public static readonly O: number = 79;
    public static readonly P: number = 80;
    public static readonly Q: number = 81;
    public static readonly T: number = 84;
    public static readonly U: number = 85;
    public static readonly V: number = 86;
    public static readonly W: number = 87;
    public static readonly X: number = 88;
    public static readonly Z: number = 90;
    public static readonly a: number = 97;
    public static readonly l: number = 108;
    public static readonly R: number = 82;
    public static readonly F: number = 70;
    public static readonly UNKNOWN: number = 0;

    public zoneShape: number
    public zoneName: string
    public zoneEfficiencyPercent: number
    public zoneMinSize: number
    public zoneSize: number
    public zoneStopAtTarget: number
    public zoneMaxEfficiency: number

    public static parseZoneUnity(zoneDescr): SpellZone {
        var zone = new SpellZone();
        if(!zoneDescr)
            return zone;
        zone.zoneSize = zoneDescr.param1;
        zone.zoneMinSize = zoneDescr.param2;
        // let shape = SpellZoneShape[zoneDescr.shape];
        // zone.zoneName = shape.toString().toLowerCase();

        // let oldshape = OldZoneShape[zoneDescr.shape];
        zone.zoneShape = zoneDescr.shape;

        zone.zoneName = this.getZoneName(zone);
        return zone;
    }

    public static parseZone(rawZone: string): SpellZone {
        let zone: SpellZone = new SpellZone();

        var params: string[] = [];
        if (rawZone && rawZone.length) {
            zone.zoneShape = rawZone.charCodeAt(0);
            params = rawZone.substr(1).split(",");
            switch (zone.zoneShape) {
                case SpellZone.l:
                    zone.zoneMinSize = parseInt(params[0]);
                    zone.zoneSize = parseInt(params[1]);
                    if (params.length > 2) {
                        zone.zoneEfficiencyPercent = parseInt(params[2]);
                        zone.zoneMaxEfficiency = parseInt(params[3]);
                    }
                    if (params.length == 5) {
                        zone.zoneStopAtTarget = parseInt(params[4]);
                    }
                default:
                    if (params.length > 0) {
                        if (params[0] == "") {
                            zone.zoneSize = 1;
                        }
                        else {
                            zone.zoneSize = parseInt(params[0]);
                        }
                    }
                    switch (params.length) {
                        case 2:
                            if (SpellZone.hasMinSize(rawZone.substr(0, 1))) {
                                zone.zoneMinSize = parseInt(params[1]);
                            }
                            else {
                                zone.zoneEfficiencyPercent = parseInt(params[1]);
                            }
                            break;
                        case 3:
                            if (SpellZone.hasMinSize(rawZone.substr(0, 1))) {
                                zone.zoneMinSize = parseInt(params[1]);
                                zone.zoneEfficiencyPercent = parseInt(params[2]);
                            }
                            else {
                                zone.zoneEfficiencyPercent = parseInt(params[1]);
                                zone.zoneMaxEfficiency = parseInt(params[2]);
                            }
                            break;
                        case 4:
                            zone.zoneMinSize = parseInt(params[1]);
                            zone.zoneEfficiencyPercent = parseInt(params[2]);
                            zone.zoneMaxEfficiency = parseInt(params[3]);
                            break;
                        default:
                            zone.zoneMinSize = 0;
                            zone.zoneEfficiencyPercent = null;
                            zone.zoneMaxEfficiency = null;
                    }
            }
            zone.zoneName = SpellZone.getZoneName(zone);
            // console.log("zone: " + JSON.stringify(zone))
            return zone;
        }
        else {
            //   _log.error("Zone incorrect (" + rawZone + ")");
        }
    }


    public static hasMinSize(param1: String): Boolean {
        var _loc2_: String = param1;
        if (_loc2_ != "#") {
            if (_loc2_ != "+") {
                if (_loc2_ != "C") {
                    if (_loc2_ != "Q") {
                        if (_loc2_ != "X") {
                            if (_loc2_ != "l") {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    public static getZoneName(zone: SpellZone) {
        let aoeName;
        switch (zone.zoneShape) {
            case SpellZone.minus:
                aoeName = "diagonal";
                break;
            case SpellZone.A:
            case SpellZone.a:
                aoeName = "everyone";
                break;
            case SpellZone.C:
                if (zone.zoneSize == 63)
                    aoeName = "everyone";
                else
                    aoeName = "circle";
                break;
            case SpellZone.D:
                aoeName = "checkerboad";
                break;
            case SpellZone.l:
                aoeName = "line3";
                break;
            case SpellZone.L:
                aoeName = "line";
                zone.zoneSize += 1;
                break;
            case SpellZone.O:
                aoeName = "ring";
                break;
            case SpellZone.Q:
                aoeName = "cross2";
                break;
            case SpellZone.T:
                // aoeName = "tarea";
                aoeName = "line2";
                break;
            case SpellZone.U:
                aoeName = "alfcircle";
                break;
            case SpellZone.V:
                aoeName = "cone";
                break;
            case SpellZone.X:
                aoeName = "cross";
                break;
            case SpellZone.W:
                aoeName = "squareChecker";
                break;
            case SpellZone.G:
                aoeName = "square";
                break;
            case SpellZone.plus:
                aoeName = "plus";
                break;
            case SpellZone.star:
                aoeName = "star";
                break;
            case SpellZone.P:
                aoeName = "point"
                break;
            case SpellZone.R:
                aoeName = "rectangle"
                break;
            case SpellZone.F:
                aoeName = "fork"
                break;
        }
        return aoeName;
    }
}

export class Targets {

    public static splitMasks(param1: string) {
        var end: number = 0;
        var masks: string[] = [];
        var start: number = 0;
        while (start < param1.length) {
            while (param1.charAt(start) == " " || param1.charAt(start) == ",") {
                start++;
            }
            end = start;
            while (end < param1.length && param1.charAt(end) != ",") {
                end++;
            }
            if (end != start) {
                masks.push(param1.substring(start, end));
            }
            start = end;
        }
        // return masks;


        masks.sort(function (s1: String, s2: String): number {
            return +(this.sortMasks(s1, s2));
        });
    }

    public static sortMasks(s1: String, s2: String): number {
        if (+("*bBeEfFzZKoOPpTWUvVrRQq".indexOf(s1.charAt(0))) != -1) {
            if (+("*bBeEfFzZKoOPpTWUvVrRQq".indexOf(s2.charAt(0))) != -1) {
                if (s1.charCodeAt(0) == "*".charCodeAt(0) && s2.charCodeAt(0) != "*".charCodeAt(0)) {
                    return -1;
                }
                if (s2.charCodeAt(0) == "*".charCodeAt(0) && s1.charCodeAt(0) != "*".charCodeAt(0)) {
                    return 1;
                }
            }
            return -1;
        }
        if (+("*bBeEfFzZKoOPpTWUvVrRQq".indexOf(s2.charAt(0))) != -1) {
            return 1;
        }
        return 0;
    }

    /*
        public static isSelectedByMask(param1: HaxeFighter, param2: Array, param3: HaxeFighter, param4: HaxeFighter, param5: FightContext): Boolean {
            if (param2 == null || +(param2.length) == 0) {
                return true;
            }
            if (param3 == null) {
                return false;
            }
            if (Targets.isIncludedByMask(param1, param2, param3)) {
                return Boolean(SpellManager.passMaskExclusion(param1, param2, param3, param4, param5));
            }
            return false;
        }
    */
    public static isIncludedByMask(p1, masks: string[], p2) { // p1: HaxeFighter, masks: string[], p2: HaxeFighter): Boolean {
        var isSameTeam: any = false;
        var isSummon: Boolean = false;
        var i: number = 0;
        var _loc8_: any = null as String;
        var mask: any = null as String;
        var _loc4_: any = p2.id == p1.id;
        if (_loc4_) {
            if (+(masks.indexOf("c")) != -1 || +(masks.indexOf("C")) != -1 || +(masks.indexOf("a")) != -1) {
                return true;
            }
        }
        else {
            isSameTeam = p1.teamId == p2.teamId;
            isSummon = p2.data.isSummon();
            i = 0;
            while (i < +(masks.length)) {
                _loc8_ = masks[i];
                i++;
                mask = _loc8_;

                if (mask == "A") {
                    return "!isSameTeam";
                    // return !isSameTeam;
                } else if (mask == "D") {
                    return "!isSameTeam,SIDEKICK";
                    // if (!isSameTeam) { // && p2.playerType == PlayerTypeEnum.SIDEKICK) {
                    //     return true;
                    // }
                } else if (mask == "H") {
                    return "!isSameTeam,HUMAN,!isSummon";
                    // if (!isSameTeam && !isSummon) { //  && p2.playerType == PlayerTypeEnum.HUMAN && !isSummon) {
                    //     return true;
                    // }
                } else if (mask == "I") {
                    return "!isSameTeam,!SIDEKICK,isSummon,!isStaticElement";
                    // if (!isSameTeam && isSummon && !p2.isStaticElement) { //  && p2.playerType != PlayerTypeEnum.SIDEKICK && isSummon && !p2.isStaticElement) {
                    //     return true;
                    // }
                } else if (mask == "J") {
                    return "!isSameTeam,!SIDEKICK,isSummon";
                    // if (!isSameTeam && isSummon) { //  && p2.playerType != PlayerTypeEnum.SIDEKICK && isSummon) {
                    //     return true;
                    // }
                } else if (mask == "L") {
                    return "!isSameTeam,!isSummon";
                    // if(!isSameTeam && (p2.playerType == PlayerTypeEnum.HUMAN && !isSummon || p2.playerType == PlayerTypeEnum.SIDEKICK))
                    // if (!isSameTeam && !isSummon) { //  && (p2.playerType == PlayerTypeEnum.HUMAN && !isSummon || p2.playerType == PlayerTypeEnum.SIDEKICK)) {
                    //     return true;
                    // }
                } else if (mask == "M") {
                    return "!isSameTeam,!HUMAN,!isSummon,!isStaticElement";
                    // if (!isSameTeam && !isSummon && !p2.isStaticElement) { //  && p2.playerType != PlayerTypeEnum.HUMAN && !isSummon && !p2.isStaticElement) {
                    //     return true;
                    // }
                } else if (mask == "S") {
                    return "!isSameTeam,!SIDEKICK,isSummon,isStaticElement";
                    // if (!isSameTeam && isSummon && p2.isStaticElement) { //  && p2.playerType != PlayerTypeEnum.SIDEKICK && isSummon && p2.isStaticElement) {
                    //     return true;
                    // }
                }
                else {
                    if (mask != "a") {
                        if (mask != "g") {
                            if (mask == "d") {
                                return "isSameTeam,SIDEKICK";
                            } else if (mask == "h") { //  && p2.playerType == PlayerTypeEnum.HUMAN && !isSummon) {
                                return "isSameTeam,HUMAN,!isSummon";
                            } else if (mask == "i") { //  && p2.playerType != PlayerTypeEnum.SIDEKICK && isSummon && !p2.isStaticElement) {
                                return "isSameTeam,!SIDEKICK,isSummon,!isStaticElement";
                            } else if (mask == "j") { //  && p2.playerType != PlayerTypeEnum.SIDEKICK && isSummon) {
                                return "isSameTeam,!SIDEKICK,isSummon";
                            } else if (mask == "l") { //  && (p2.playerType == PlayerTypeEnum.HUMAN && !isSummon || p2.playerType == PlayerTypeEnum.SIDEKICK)) {
                                return "isSameTeam,!isSummon";
                            } else if (mask == "m") { //  && p2.playerType != PlayerTypeEnum.HUMAN && !isSummon && !p2.isStaticElement) {
                                return "isSameTeam,!HUMAN,!isSummon,!isStaticElement";
                            } else if (mask == "s") { //  && p2.playerType != PlayerTypeEnum.SIDEKICK && isSummon && p2.isStaticElement) {
                                return "isSameTeam,!SIDEKICK,isSummon,isStaticElement";
                            }
                            continue;
                        }
                    }
                    return "isSameTeam";
                    // if (isSameTeam) {
                    //     return true;
                    // }
                }
            }
        }
        return false;
    }




    public static mask(masks: string[]) {
        // console.log("masks: " + masks)
        // A,a
        let arr = new Set<string>();
        let enemy = ["A", "D", "H", "I", "J", "L", "M", "S"]
        let ally = ["a", "g", "d", "h", "i", "j", "l", "m", "s"]

        let hasTeam = false;


        if (masks.includes("A") && masks.includes("a")) {
            arr.add("fighter")
            hasTeam = true
        } else if (masks.includes("A") && masks.includes("g")) {
            arr.add("allExceptCaster")
            hasTeam = true
        } else {
            if (masks.includes("A")) {
                arr.add("enemy")
                hasTeam = true
            }
            if (masks.includes("a")) {
                arr.add("ally")
                hasTeam = true
            } else if (masks.includes("g")) {
                arr.add("allyExceptCaster")
                hasTeam = true
            }
        }


        // if(masks.includes("i"))
        for (let m of masks) {
            let cond = m.includes("*");
            m = m.replace("*", "");

            if (m == "c" || m == "C") {
                arr.add("caster")
                continue;
            }
            if (enemy.includes(m) || ally.includes(m)) {
                if (!hasTeam) {
                    if (m == m.toLowerCase()) {
                        arr.add("ally")
                    } else {
                        arr.add("enemy")
                    }
                }
                let basic = Targets.teamMasks(m);
                let basics = basic.split(",");
                for (let b of basics)
                    if (b)
                        arr.add(cond ? "*" + b : b);
                continue;
            }

            let r = Targets.conditionMasks(m);
            if (r) {
                if (cond) r = "*" + r;
                // console.log("parse mask: " + m + " to " + r);
                arr.add(r);
                continue;
            }

            // if (cond) m = "*" + m;
            // arr.add(m);
        }
        if (arr.has("summonCaster")) {
            arr.delete("summon")
            arr.delete("ally")
            arr.delete("allyExceptCaster")
        }
        if (arr.has("enemy") && arr.has("ally")) {
            arr.add("fighter");
        }
        if (arr.has("fighter")) {
            arr.delete("ally")
            arr.delete("enemy")
        }
        arr.delete("creature50000");
        return Array.from(arr);
    }

    public static teamMasks(mask: string): string {
        if (mask == "A")
            return ""
        if (mask == "a")
            return ""
        if (mask == "g")
            return ""
        // let sameTeam = false;
        // if(mask == mask.toLowerCase()) {
        //     sameTeam = true;
        // }
        mask = mask.toLowerCase();
        if (mask == "d")
            return "" //"SIDEKICK";
        if (mask == "h")
            return "summoner" //"HUMAN,!isSummon";
        if (mask == "i")
            return "summon,!static" //"!SIDEKICK,isSummon,!isStaticElement";
        if (mask == "j")
            return "summon" //"!SIDEKICK,isSummon";
        if (mask == "l")
            return "summoner";
        if (mask == "m")
            return "summoner,!static" //"!HUMAN,!isSummon,!isStaticElement";
        if (mask == "s")
            return "summon,static" //"!SIDEKICK,isSummon,isStaticElement";

        return mask;
    }

    /**
     * Condition masks
     * @param mask 
     * @returns 
     */
    public static conditionMasks(mask: string) {
        let m = mask;
        if (m.startsWith("f"))
            return mask.replace("f", "!creature");
        if (m.startsWith("e"))
            return mask.replace("e", "!state");
        if (m.startsWith("F"))
            return mask.replace("F", "creature");
        if (m.startsWith("E"))
            return mask.replace("E", "state");

        if (mask == "p")
            return "!summonCaster"
        if (mask == "P")
            return "summonCaster"
        if (mask == "R")
            return "portal" // result = Boolean(usingPortal);
        if (mask == "r")
            return "!portal"
        if (mask == "T")
            return "telefrag" //result = Boolean(param2.wasTelefraggedThisTurn());
        if (mask == "K")
            return "carried"
        if (mask == "U")
            return "onSummon"
        if (mask == "u")
            return "!onSummon"
        if (mask == "O")
            return "attackerCaster"
        if (mask == "o")
            return "attacker"

        return mask;
    }

    public static hasCondition(targetMask: string) {
        let split = targetMask.split(",");
        for (let m of split) {
            if (!m.toLowerCase().endsWith("f50000") && (this.conditionMasks(m) || m.startsWith("*")))
                return true;
        }
        console.log("has no condition: " + targetMask)
        return false;
    }

    /*
    public static targetPassMaskExclusion(param1, param2, param3, param4, someMask: string, masks: string[], usingPortal: boolean, param8: boolean) { //param1: HaxeFighter, param2: HaxeFighter, param3: HaxeFighter, param4: FightContext, param5: String, param6: Array, param7: Boolean, param8: Boolean): Boolean {
        var targetPercentLifePoints: any = null as Object;
        var result: any = false;
        var percentLifePoints: Number = NaN;
        var startMask: any = 0;
        var currIndex: number = 0;
        var maxIndex: number = 0;
        var maskIndex: number = 0;
        var caster = param1; //: HaxeFighter = param1;
        var strStartI: number = !!param8 ? 1 : 0;
        switch (someMask.length) {
            case 0:
            case 1:
                targetPercentLifePoints = 0;
                break;
            default:
                targetPercentLifePoints = +someMask.substring(strStartI + 1)
        }
        var _loc11_: String = someMask.charAt(strStartI);
        var mask: String = _loc11_;
        if (mask == "B") {
            result = Boolean(param2.playerType == PlayerTypeEnum.HUMAN && param2.breed == targetPercentLifePoints);
        }
        else if (mask == "E") {
            result = Boolean(param2.hasState(targetPercentLifePoints));
        }
        else if (mask == "F") {
            result = Boolean(param2.playerType != PlayerTypeEnum.HUMAN && param2.breed == targetPercentLifePoints);
        }
        else if (mask == "K") {
            result = Boolean(!!param2.hasState(8) && caster.getCarried(param4) == param2 || param2.pendingEffects.filter(function (param1: EffectOutput): Boolean {
                return param1.throwedBy == caster.id;
            }).length > 0);
        }
        else if (mask == "P") {
            result = Boolean(param2.id == caster.id || !!param2.data.isSummon() && Number(param2.data.getSummonerId()) == caster.id || !!param2.data.isSummon() && Number(caster.data.getSummonerId()) == Number(param2.data.getSummonerId()) || !!caster.data.isSummon() && Number(caster.data.getSummonerId()) == param2.id);
        }
        else if (mask == "Q") {
            result = +(param4.getFighterCurrentSummonCount(param2)) >= +(param2.data.getCharacteristicValue(26));
        }
        else if (mask == "R") {
            result = Boolean(usingPortal);
        }
        else if (mask == "T") {
            result = Boolean(param2.wasTelefraggedThisTurn());
        }
        else if (mask == "U") {
            result = Boolean(param2.isAppearing());
        }
        else if (mask == "V") {
            percentLifePoints = param2.getPendingLifePoints().min / +(param2.data.getMaxHealthPoints()) * 100;
            result = percentLifePoints <= targetPercentLifePoints;
        }
        else if (mask == "W") {
            result = Boolean(param2.wasTeleportedInInvalidCellThisTurn(param4));
        }
        else if (mask == "Z") {
            result = Boolean(param2.playerType == PlayerTypeEnum.SIDEKICK && param2.breed == targetPercentLifePoints);
        }
        else if (mask == "b") {
            result = Boolean(param2.playerType != PlayerTypeEnum.HUMAN || param2.breed != targetPercentLifePoints);
        }
        else if (mask == "e") {
            result = !param2.hasState(targetPercentLifePoints);
        }
        else if (mask == "f") {
            result = Boolean(param2.playerType == PlayerTypeEnum.HUMAN || param2.breed != targetPercentLifePoints);
        }
        else {
            if (mask != "O") {
                if (mask != "o") {
                    if (mask == "p") {
                        result = !(param2.id == caster.id || !!param2.data.isSummon() && Number(param2.data.getSummonerId()) == caster.id || !!param2.data.isSummon() && Number(caster.data.getSummonerId()) == Number(param2.data.getSummonerId()) || !!caster.data.isSummon() && Number(caster.data.getSummonerId()) == param2.id);
                    }
                    else if (mask == "q") {
                        result = +(param4.getFighterCurrentSummonCount(param2)) < +(param2.data.getCharacteristicValue(26));
                    }
                    else if (mask == "r") {
                        result = !usingPortal;
                    }
                    else if (mask == "v") {
                        percentLifePoints = param2.getPendingLifePoints().min / +(param2.data.getMaxHealthPoints()) * 100;
                        result = percentLifePoints > targetPercentLifePoints;
                    }
                    else if (mask == "z") {
                        result = Boolean(param2.playerType != PlayerTypeEnum.SIDEKICK || param2.breed != targetPercentLifePoints);
                    }
                }
                //  §§goto(addr475);
            }
            result = Boolean(param3 != null && param2.id == param3.id);
        }
        // addr475:
        if (SpellManager.maskIsOneOfCondition(someMask)) {
            startMask = +(masks.indexOf(someMask)) + 1;
            if (result) {
                currIndex = startMask;
                maxIndex = masks.length;
                while (currIndex < maxIndex) {
                    maskIndex = currIndex++;
                    if (masks[maskIndex].charCodeAt(strStartI) == someMask.charCodeAt(strStartI)) {
                        masks[maskIndex] = " ";
                    }
                }
            }
            else {
                currIndex = startMask;
                maxIndex = masks.length;
                while (currIndex < maxIndex) {
                    maskIndex = currIndex++;
                    if (masks[maskIndex].charCodeAt(strStartI) == someMask.charCodeAt(strStartI)) {
                        result = true;
                        break;
                    }
                }
            }
        }
        return result;
    }
    */

}

