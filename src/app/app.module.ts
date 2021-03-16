import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouter } from './app.router';

// Components
import { AppComponent } from './app.component';
import { HexagonComponent } from './hexagon';
import { GameGridComponent } from './components/game-grid';
import { GameAreaComponent } from './components/game-area';
import { GameItemsComponent } from './components/game-items';

// Services
import { GameParamsArbiter } from './services/game-params.arbiter';
import { GameAreaArbiter } from './services/game-area.arbiter';
import { GameItemsArbiter } from './services/game-items.arbiter';
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
    GameGridComponent,
    GameAreaComponent,
    GameItemsComponent,
  ],
  providers: [
    GameParamsArbiter,
    GameAreaArbiter,
    GameItemsArbiter,
    HexagonCoordsConverterService,
    EngineFactory,
    GameService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
