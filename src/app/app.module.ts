import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRouter } from './app.router';

// Components
import { AppComponent } from './components/app';
import { HexagonComponent } from './components/hexagon';
import { GameGridComponent } from './components/game-grid';
import { GameAreaComponent } from './components/game-area';
import { GameItemsComponent } from './components/game-items';

// Directives
import { KeyEventDirective } from './directives/key-event.directive';

// Services
import { GameParamsArbiter } from './services/game-params.arbiter';
import { GameAreaArbiter } from './services/game-area.arbiter';
import { GameItemsArbiter } from './services/game-items.arbiter';
import { HexagonCoordsConverterService } from './services/hexagon-coords-converter.service';
import { EngineFactory } from './services/engine.factory';
import { GameService } from './services/game.service';
import { HexagonGridService } from './services/hexagon-grid.service';
import { HexagonOperationService } from './services/hexagon-operation.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouter,
  ],
  declarations: [
    // Components
    AppComponent,
    HexagonComponent,
    GameGridComponent,
    GameAreaComponent,
    GameItemsComponent,
    // Directives
    KeyEventDirective,
  ],
  providers: [
    GameParamsArbiter,
    GameAreaArbiter,
    GameItemsArbiter,
    HexagonCoordsConverterService,
    EngineFactory,
    GameService,
    HexagonGridService,
    HexagonOperationService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
