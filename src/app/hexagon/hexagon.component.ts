import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { BaseComponent } from '../shared';

import { GameParamsArbiter } from '../services/game-params.arbiter';

@Component({
  selector: 'eg-hexagon',
  templateUrl: './hexagon.component.svg',
  styleUrls: [ './hexagon.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexagonComponent extends BaseComponent implements OnInit {
  /**
   * Path points of `path` tag with a hexagon.
   */
  public path: string;
  /**
   * SVG view box.
   */
  public viewBox: string;
  /**
   * Width of SVG tag.
   */
  public width: number;
  /**
   * Height of SVG tag.
   */
  public height: number;

  /**
   * Width of hexagon stroke.
   */
  public strokeWidth: number;

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameParamsArbiter: GameParamsArbiter,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    this.updateView();
  }

  /**
   * Recalculates:
   *  - width and height of SVG tag
   *  - view box of SVG tag
   *  - hexagon path
   *
   * @return {void}
   */
  updateView (
  ): void {
    const cRadius = this.gameParamsArbiter.cHexagonRadius;
    const iRadius = this.gameParamsArbiter.iHexagonRadius;

    this.strokeWidth = this.gameParamsArbiter.hexagonStrokeWidth;

    this.width = this.gameParamsArbiter.hexagonWidth + this.strokeWidth;
    this.height = this.gameParamsArbiter.hexagonHeight + this.strokeWidth;

    this.viewBox = `0 0 ${this.width} ${this.height}`;

    const pathParts = [
      `M${cRadius / 2 + this.strokeWidth / 2} ${0 + this.strokeWidth / 2}`, // Top-Left point
      `l${cRadius} ${0}`, // Top-Right point
      `l${cRadius / 2} ${iRadius}`, // Right point
      `l${-cRadius / 2} ${iRadius}`, // Bottom-Right point
      `l${-cRadius} ${0}`, // Bottom-Left point
      `l${-cRadius / 2} ${- iRadius}`, // Left point
      `Z`, // Top-Left point
    ];
    this.path = pathParts.join(` `);

    this.render();
  }
}
