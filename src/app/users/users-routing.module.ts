import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { UsersComponent } from './users.component';
import { extract } from '@app/core';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    { path: 'users', component: UsersComponent, data: { title: extract('Users') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
