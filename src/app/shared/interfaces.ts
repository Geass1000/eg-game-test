import { Enums } from '.';

export interface ClickDelegateEvent {
  /**
   * data-id attribute
   */
  id: string;
  /**
   * data-type attribute
   */
  type: string;
  /**
   * CSS class.
   */
  tagSelector: string;
  /**
   * Native mouse event.
   */
  dataset: DOMStringMap;
  /**
   * Native mouse event.
   */
  event: MouseEvent;
}

export interface SelectOption {
  id: string;
  value: string;
  hint: string;
}

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

export interface GameStore {
  /**
   * Number of elements in one grid direction with the central hexagon.
   *
   * Radius (GR) of grid.
   * 1 - 1 el
   * 2 - 7 els
   * 3 - 19 els
   * ...
   */
  gridRadius: number;
  /**
   * Number of elements in one grid direction without the central hexagon.
   */
  gridSize: number;
  /**
   * Number of elements in all gird.
   */
  numOfHexaognsInGrid: number;
  gameStatus: Enums.GameStatus;
  dataServerURL: string;
}
