import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { HexagonComponent } from './hexagon';
import { HexagonGridComponent } from './hexagon-grid';

// Services
import { GameParamsArbiter } from './services/game-params.arbiter';

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
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
