import { Routes, RouterModule } from '@angular/router';
import { HubComponent } from './components/hub/hub.component';
import { GameComponent } from './components/game/game.component';

export const routes: Routes = [
  { path: '', component: HubComponent },
  { path: ':player/:seed', component: GameComponent },
  { path: 'local', component: GameComponent },
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(routes);
