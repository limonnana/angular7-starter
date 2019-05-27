import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { UserEditComponent } from './user-edit/user-edit.component';

@NgModule({
  declarations: [UsersComponent, UserEditComponent],
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, UsersRoutingModule]
})
export class UsersModule {}
