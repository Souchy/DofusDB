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

export class Board {

    public readonly cellHalf = 0.5;
    public cells: Cell[] = []
    public objects: boolean[] = []
    public target: number = -1
    
	public checkView(pos0: Vector2, pos1: Vector2) {
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
		
		let slope = (pos0.y - pos1.y) / (pos0.x - pos1.x);
		
		let c = pos0.y - slope * pos0.x;
		let f = (x) => slope * x + c;

		let x1Abs = pos1.x * dirX;
		
		let x = pos0.x + this.cellHalf * dirX;
		let y = pos0.y;

		let v0 = pos0.y;

		// if(log) System.out.println("pos0 " + pos0 + ", pos1 " + pos1);
		// if(log) System.out.println("dir(" + dirX + "," + dirY + ") x1a: " + x1Abs + " slope: " + slope);
		// if(log) System.out.println("x: " + x + ",  x * dirX: " + (x * dirX) + ", x1Abs + dirX: " + (x1Abs + dirX));
		
		while (x * dirX <= x1Abs) {
			let y2 = f.apply(x);
			if(dirY > 0) y2 = Math.min(pos1.y, y2);
			else y2 = Math.max(pos1.y, y2);
			
			let l21 = 0;
			let l22 = 0;
			if(dirY > 0) {
				l21 = Math.round(y2);
				l22 = Math.ceil(y2 - this.cellHalf);
			} else {
				l21 = Math.ceil(y2 - this.cellHalf);
				l22 = Math.round(y2);
			}
			y = v0;
			
			// if(log) System.out.println("a " + x + ", " + y + " // y2: " + y2 + " l21: " + l21 + ", l22: " + l22);
			
			while (y * dirY <= l22 * dirY) {
				let tx = (x - this.cellHalf * dirX);
				let ty = y;
                if(!this.checkCellView(tx, ty)) {
					return false;
				}
				y += dirY;
			}
			v0 = l21;
			x += dirX;
		}
		y = v0;
		
		while (y * dirY <= pos1.y * dirY) {
			let tx = (x - this.cellHalf * dirX);
			let ty = y;
			if(!this.checkCellView(tx, ty)) {
				return false;
			}
			y += dirY;
		}
		
		{
			let tx = (x - this.cellHalf * dirX);
			let ty = (y - dirY);
			if(!this.checkCellView(tx, ty)) {
				return false;
			}
		}

		return true;
	}
	
	/**
	 * Check if the caster can cast through the cell and through any creature on the cell
	 */
	public checkCellView(x, y) {
        let id = this.getId(x, y)
        let c = this.cells[id]
        if(!c) return false;
        if(!c.los) return false;
        if(this.objects[id]) return false;
        return true;
		// if(caster == null || c == null) return false;
		// if(caster.pos.same(c.pos)) return true;
		// var view = caster.targetting.canCastThrough(c);
		// if(c.hasCreature()) {
		// 	for(var crea : c.getCreatures())
		// 		view &= caster.targetting.canCastThrough(crea);
		// }
		// return view;
	}
	

    public getX(id) {
        return id % 14;
    }
    public getY(id) {
        return (id - this.getX(id)) / 14;
    }
    public getId(x, y) {
        return y * 14 + x;
    }
    // assuming y goes from 0 to 39 instead of 19
	public getByXY(x, y): Cell {
        let id = this.getId(x, y);
		return this.cells[id];
	}
	public getByXYZ(x, y, z): Cell {
        let id = y * 14 + x + x * z;
		return this.cells[id]; //this.cells.get(x, y);
	}
	public getByPos(pos): Cell {
		return this.getByXYZ(pos.x, pos.y, pos.z);
	}
	public get(entity): Cell {
		var pos = entity["position"]; // entity.get(Position.class);
		if(pos == null) return null;
		return this.getByPos(pos);
	}

}
