import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from "./user/login/login.component";
import {HomepageComponent} from "./homepage/homepage.component";

// const appRoutes: Routes = [
//   { path: '', redirectTo: '/map', pathMatch: 'full'},
//   { path: 'map', component: MapComponent, children: [
//       { path: 'add', component: AddRouteComponent},
//       { path: 'user/:id', redirectTo: '/map/user/:id/routes'},
//       { path: 'user', redirectTo: '/map'},
//       { path: 'user/:id/routes', component: UserRoutesComponent },
//       { path: 'search', redirectTo: '/not-found', pathMatch: 'full'},
//       { path: 'search/:type/', redirectTo: '/not-found', pathMatch: 'full'},
//       { path: 'search/:type/:value', component: SearchComponent },
//       { path: ':id', redirectTo: '/map/:id/detail', pathMatch: 'full'},
//       { path: ':id/detail', component: RouteDetailComponent },
//       { path: ':id/edit', component: RouteEditComponent }
//     ]},
//   { path: 'user', children: [
//       { path: '', redirectTo: '/map', pathMatch: 'full'},
//       { path: 'edit', component: UserEditComponent, children: [
//           { path: 'password', component: PasswordComponent },
//           { path: 'avatar', component: AvatarComponent },
//           { path: 'data', component: UserDataComponent }
//         ]},
//       { path: ':id', component: UserComponent}
//     ] },
//   { path: 'register', component: RegisterComponent },
//   { path: 'stats/:id', component: StatsComponent },
//   { path: '**', component: NotFoundComponent }
// ];

const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
