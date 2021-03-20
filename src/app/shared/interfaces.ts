export interface HexagonCubeCoords {
  x: number;
  y: number;
  z: number;
}

export interface HexagonOffsetCoords {
  col: number;
  row: number;
}
export interface HexagonAxialCoords {
  col: number;
  row: number;
}

export type HexagonCoords = HexagonOffsetCoords | HexagonAxialCoords | HexagonCubeCoords;

export interface Hexagon <THexagonValue = any> extends HexagonCubeCoords {
  value?: THexagonValue;
}

export interface HexagonAction <THexagonValue = any> {
  from: Hexagon<THexagonValue>;
  to: Hexagon<THexagonValue>;
}

export interface MergeHexagonsDescriptor {
  changed: boolean;
  actions: HexagonAction<number>[];
  hexagons: Hexagon<number>[];
}
