import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './pages/game-page';

import { GameSettingsPageComponent } from './pages/game-settings-page';

const routes: Routes = [
  {
    path: 'settings',
    component: GameSettingsPageComponent,
  },
  {
    path: 'game',
    component: GamePageComponent,
  },
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRouter { }
