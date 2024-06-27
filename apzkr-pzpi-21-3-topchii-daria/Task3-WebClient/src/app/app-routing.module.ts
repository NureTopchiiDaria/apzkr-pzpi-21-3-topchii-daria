import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { RoomDetailComponent } from './components/room-detail/room-detail.component';
import { AddRoomComponent } from './components/add-room/add-room.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { MyJourneysComponent } from './components/my-journeys/my-journeys.component';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'en/login', pathMatch: 'full' },
  { path: ':lang/login', component: LoginComponent },
  { path: ':lang/register', component: RegisterComponent },
  { path: ':lang/rooms', component: RoomListComponent, canActivate: [AuthGuard] },
  { path: ':lang/rooms/:id', component: RoomDetailComponent, canActivate: [AuthGuard] },
  { path: ':lang/create', component: AddRoomComponent, canActivate: [AuthGuard] },
  { path: ':lang/user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: ':lang/my-journeys', component: MyJourneysComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
