export class MapTools {

    // 14,20, 0,33, -19,13
    public static readonly MAP_GRID_WIDTH = 14
    public static readonly MAP_GRID_HEIGHT = 20
    public static readonly MIN_X_COORD = 0
    public static readonly MAX_X_COORD = 33
    public static readonly MIN_Y_COORD = -19;
    public static readonly MAX_Y_COORD = 13;
    public static readonly cellHalf = 0.5;
    public static readonly mapCountCell = MapTools.MAP_GRID_WIDTH * MapTools.MAP_GRID_HEIGHT * 2;

    public static getCellsCoordBetween(cell1: number, cell2: number) {
        let ids = this.getCellsIdBetween(cell1, cell2);
        return ids.map(i => this.getCellCoordById(i));
    }

    public static getCellsIdBetween(cell1: number, cell2: number): number[] {
        if (cell1 == cell2) {
            return [];
        }
        if (!MapTools.isValidCellId(cell1) || !MapTools.isValidCellId(cell2)) {
            return [];
        }
        var _loc3_: number = Math.floor(cell1 / MapTools.MAP_GRID_WIDTH);
        var _loc4_: number = Math.floor((_loc3_ + 1) / 2);
        var _loc5_: any = cell1 - _loc3_ * MapTools.MAP_GRID_WIDTH;
        var _loc6_: any = _loc4_ + _loc5_;
        var _loc7_: number = Math.floor(cell1 / MapTools.MAP_GRID_WIDTH);
        var _loc8_: number = Math.floor((_loc7_ + 1) / 2);
        var _loc9_: any = _loc7_ - _loc8_;
        var _loc10_: any = cell1 - _loc7_ * MapTools.MAP_GRID_WIDTH;
        var _loc11_: any = _loc10_ - _loc9_;
        var _loc12_: number = Math.floor(cell2 / MapTools.MAP_GRID_WIDTH);
        var _loc13_: number = Math.floor((_loc12_ + 1) / 2);
        var _loc14_: any = cell2 - _loc12_ * MapTools.MAP_GRID_WIDTH;
        var _loc15_: any = _loc13_ + _loc14_;
        var _loc16_: number = Math.floor(cell2 / MapTools.MAP_GRID_WIDTH);
        var _loc17_: number = Math.floor((_loc16_ + 1) / 2);
        var _loc18_: any = _loc16_ - _loc17_;
        var _loc19_: any = cell2 - _loc16_ * MapTools.MAP_GRID_WIDTH;
        var _loc20_: any = _loc19_ - _loc18_;
        var _loc21_: any = _loc15_ - _loc6_;
        var _loc22_: any = _loc20_ - _loc11_;
        var _loc23_: number = Math.sqrt(_loc21_ * _loc21_ + _loc22_ * _loc22_);
        var _loc24_: number = _loc21_ / _loc23_;
        var _loc25_: number = _loc22_ / _loc23_;
        var _loc26_: number = Math.abs(1 / _loc24_);
        var _loc27_: number = Math.abs(1 / _loc25_);
        var _loc28_: number = _loc24_ < 0 ? -1 : 1;
        var _loc29_: number = _loc25_ < 0 ? -1 : 1;
        var _loc30_: number = MapTools.cellHalf * _loc26_;
        var _loc31_: number = MapTools.cellHalf * _loc27_;
        var cellsInBetween: number[] = [];
        while (_loc6_ != _loc15_ || _loc11_ != _loc20_) {
            if (MapTools.floatAlmostEquals(_loc30_, _loc31_)) {
                _loc30_ += _loc26_;
                _loc31_ += _loc27_;
                _loc6_ += _loc28_;
                _loc11_ += _loc29_;
            }
            else if (_loc30_ < _loc31_) {
                _loc30_ += _loc26_;
                _loc6_ += _loc28_;
            }
            else {
                _loc31_ += _loc27_;
                _loc11_ += _loc29_;
            }
            cellsInBetween.push(MapTools.getCellIdByCoord(_loc6_, _loc11_));
        }
        return cellsInBetween;
    }

    public static getCellIdByCoord(x: number, y: number): number {
        if (!MapTools.isValidCoord(x, y)) {
            return -1;
        }
        return Math.floor(Number((x - y) * MapTools.MAP_GRID_WIDTH + y + (x - y) / 2));
    }
    public static getCellCoordById(cellId: number): { id, x, y } {
        if (!MapTools.isValidCellId(cellId)) {
            return null;
        }
        var _loc2_: number = Math.floor(cellId / MapTools.MAP_GRID_WIDTH);
        var _loc3_: number = Math.floor((_loc2_ + 1) / 2);
        var _loc4_: number = _loc2_ - _loc3_;
        var _loc5_: number = cellId - _loc2_ * MapTools.MAP_GRID_WIDTH;
        //    return new mapTools.Point(_loc3_ + _loc5_,_loc5_ - _loc4_);
        return {
            id: cellId,
            x: _loc3_ + _loc5_,
            y: _loc5_ - _loc4_
        }
    }

    public static isValidCoord(cell1: number, cell2: number): Boolean {
        if (cell2 >= -cell1 && cell2 <= cell1 && cell2 <= MapTools.MAP_GRID_WIDTH + MapTools.MAX_Y_COORD - cell1) {
            return cell2 >= cell1 - (MapTools.MAP_GRID_HEIGHT - MapTools.MIN_Y_COORD);
        }
        return false;
    }

    public static isValidCellId(cellId: number): Boolean {
        if (cellId >= 0) {
            return cellId < MapTools.mapCountCell;
        }
        return false;
    }

    public static floatAlmostEquals(cellId: number, cellId2: number): Boolean {
        if (cellId != cellId2) {
            return Math.abs(cellId - cellId2) < 0.0001;
        }
        return true;
    }

}
