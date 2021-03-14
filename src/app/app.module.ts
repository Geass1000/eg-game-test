import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouter } from './app.router';

// Components
import { AppComponent } from './app.component';
import { HexagonComponent } from './hexagon';
import { HexagonGridComponent } from './hexagon-grid';

// Services
import { GameParamsArbiter } from './services/game-params.arbiter';
import { GameAreaArbiter } from './services/game-area.arbiter';
import { HexagonCoordsConverterService } from './services/hexagon-coords-converter.service';
import { EngineFactory } from './services/engine.factory';
import { GameService } from './services/game.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRouter,
  ],
  declarations: [
    AppComponent,
    HexagonComponent,
    HexagonGridComponent,
  ],
  providers: [
    GameParamsArbiter,
    GameAreaArbiter,
    HexagonCoordsConverterService,
    EngineFactory,
    GameService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
