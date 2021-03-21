import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRouter } from './app.router';

// Components
import { AppComponent } from './components/app';
import { HexagonComponent } from './components/hexagon';
import { GameGridComponent } from './components/game-grid';
import { GameAreaComponent } from './components/game-area';
import { GameItemsComponent } from './components/game-items';
import { GameMetaconfigComponent } from './components/game-metaconfig';

// Pages
import { GameSettingsPageComponent } from './pages/game-settings-page';
import { GamePageComponent } from './pages/game-page';

// Directives
import { KeyEventDirective } from './directives/key-event.directive';
import { ClickDelegateDirective } from './directives/click-delegate.directive';

// Services
import { GameParamsArbiter } from './services/game-params.arbiter';
import { GameAreaArbiter } from './services/game-area.arbiter';
import { GameItemsArbiter } from './services/game-items.arbiter';
import { HexagonCoordsConverterService } from './services/hexagon-coords-converter.service';
import { GameService } from './services/game.service';
import { HexagonGridService } from './services/hexagon-grid.service';
import { HexagonOperationService } from './services/hexagon-operation.service';
import { GameArbiter } from './services/game.arbiter';

// State Store
import { StateStore } from './state-store/state-store.service';
import { GameStore } from './state-store/game.store';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRouter,
  ],
  declarations: [
    // Components
    AppComponent,
    HexagonComponent,
    GameMetaconfigComponent,
    GameGridComponent,
    GameAreaComponent,
    GameItemsComponent,
    // Pages
    GameSettingsPageComponent,
    GamePageComponent,
    // Directives
    KeyEventDirective,
    ClickDelegateDirective,
  ],
  providers: [
    // Services
    GameArbiter,
    GameParamsArbiter,
    GameAreaArbiter,
    GameItemsArbiter,
    HexagonCoordsConverterService,
    GameService,
    HexagonGridService,
    HexagonOperationService,
    // State Store
    StateStore,
    GameStore,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
