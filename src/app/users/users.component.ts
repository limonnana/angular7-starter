import { Component, OnInit } from '@angular/core';
import { UsersService } from '@app/services/users.service';
import { User } from '@app/entities/user';
import { first } from 'rxjs/operators';
import { Logger } from '@app/core/logger.service';
import { Router, ActivatedRoute } from '@angular/router';

const log = new Logger('UsersComponent');

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  constructor(private usersService: UsersService, private router: Router, private route: ActivatedRoute) {}

  userList: any = [];

  ngOnInit() {
    this.loadAllUsers();
  }

  private loadAllUsers() {
    this.usersService
      .getUsers()
      .pipe()
      .subscribe(users => {
        this.userList = users;
      });
  }

  addUser() {}
  deleteUser(user: User) {
    log.debug(user);
  }
  editUser(user: User) {
    log.debug(user);
    this.router.navigate([this.route.snapshot.queryParams.redirect || '/user-edit'], { replaceUrl: true });
  }
}
