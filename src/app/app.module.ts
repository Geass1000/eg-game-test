import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { HexagonComponent } from './hexagon';
import { HexagonGridComponent } from './hexagon-grid';

// Services
import { GameParamsArbiter } from './services/game-params.arbiter';
import { GameAreaArbiter } from './services/game-area.arbiter';
import { HexagonCoordsConverterService } from './services/hexagon-coords-converter.service';
import { EngineFactory } from './services/engine.factory';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
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
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
