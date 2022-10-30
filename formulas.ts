import { DI, IEventAggregator, Registration } from 'aurelia';

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


export const posVIP0 =  72; // 2,5 // 5,0 // l'origine
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
    public getCaseNum(x, y)
    {
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


	public checkView(id0: number, id1: number) { // pos0: Vector2, pos1: Vector2) {
		// let pos0 = this.getPos(id0)
		// let pos1 = this.getPos(id1)
        let pos0 = this.getCellCoordById(id0) //this.getCaseCoordonnee(id0);
        let pos1 = this.getCellCoordById(id1) //this.getCaseCoordonnee(id1);
        // let id0 = this.getId(pos0.x, pos0.y);
        // let id1 = this.getId(pos1.x, pos1.y);
		let log = false; // id1 == posVIP2;

        let dirY = pos1.y - pos0.y >= 0 ? 1 : -1;
		let dirX = pos1.x - pos0.x >= 0 ? 1 : -1;

		
		if(pos0.x == pos1.x) {
			for(let i = pos0.y; i * dirY <= pos1.y * dirY; i += dirY) {
				let tx = pos0.x;
				let ty = i;
                if(!this.checkCellView(tx, ty)) 
                    return false;
			}
			return true;
		}
		let dy = (pos0.y - pos1.y)
        let dx = (pos0.x - pos1.x)
		let slope = dy / dx;
        if(log) console.log("dy: " + dy + ", dx: " + dx + ", slope: " + slope)
		
		let c = pos0.y - slope * pos0.x;
		let f = (x) => slope * x + c;

		let x1Abs = pos1.x * dirX;
		
		let x = pos0.x + this.cellHalf * dirX;
		let y = pos0.y;

		let v0 = pos0.y;

		if(log) console.log("pos0 " + JSON.stringify(pos0) + ", pos1 " + JSON.stringify(pos1));
		if(log) console.log("dir(" + dirX + "," + dirY+ ") slope: " + slope + ", c: " + c + ", x1Abs: " + x1Abs );
		if(log) console.log("x: " + x + ",  x * dirX: " + (x * dirX) + ", x1Abs + dirX: " + (x1Abs + dirX));
		
		while (x * dirX <= x1Abs) {
			let y2 = f(x);
            // if(log) console.log("xy2: " + x + ", " + y2)
            
			if(dirY > 0) y2 = Math.min(pos1.y, y2);
			else y2 = Math.max(pos1.y, y2);
			
			let y3 = 0;
			let y4 = 0;
			if(dirY > 0) {
				y3 = Math.round(y2)
				y4 = Math.ceil(y2 - this.cellHalf)
			} else {
				y3 = Math.ceil(y2 - this.cellHalf)
				y4 = Math.round(y2)
			}
			y = v0;
			
			// if(log) console.log("a " + x + ", " + y + " // y2: " + y2 + " l21: " + l21 + ", l22: " + l22);
			
			while (y * dirY <= y4 * dirY) {
				let tx = (x - this.cellHalf * dirX);
				let ty = y;
                if(log) console.log("txy1: " + tx + ", " + ty)
                if(!this.checkCellView(tx, ty)) {
                    if(log) console.log("check return false 1")
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
            if(log) console.log("txy2: " + tx + ", " + ty)
			if(!this.checkCellView(tx, ty)) {
                if(log) console.log("check return false 2")
				return false;
			}
			y += dirY;
		}
		
		{
			let tx = (x - this.cellHalf * dirX);
			let ty = (y - dirY);
            if(log) console.log("txy3: " + tx + ", " + ty)
			if(!this.checkCellView(tx, ty)) {
                if(log) console.log("check return false 3")
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
        if(!c) return false;
        if(!c.los) return false;
        if(this.objects[id]) return false;
        // if(x == 7 && y == 0) console.log("checkCellView 7,0: " + JSON.stringify(c));
        return true;
	}
    
    public checkCellView1(x, y, bool, pos0, pos1, zDiff, d)
    {
        var id = this.getCaseNum(x, y);
        var data = this.cells[id];
        
        if(!data.los) return false;
        if(this.objects[id]) return false;


        // var data = mapHandler.getCellData(id);
        var maxDelta = Math.max(Math.abs(pos0.y - y), Math.abs(pos0.x - x));
        var _loc13 = maxDelta / d * zDiff + pos0.z;
        var height = 0; // mapHandler.getCellHeight(id);
        let asd = (maxDelta == 0 || (bool || pos1.x == x && pos1.y == y))
        var _loc15 = !this.objects[id] || !asd //data.spriteOnID == undefined || !asd;

        if (data.los && (height <= _loc13 && !_loc15))
        {
            return (true);
        }
        else
        {
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
