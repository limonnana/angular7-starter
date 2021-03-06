import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginContext } from './authentication.service';
import { Credentials, CredentialsService } from './credentials.service';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { Logger } from '../logger.service';
import { User } from '@app/entities/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

const log = new Logger('AuthenticateService');

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  error: string | undefined;
  private credentials: Credentials = { username: '', token: '' };
  private logInErrorSubject = new Subject<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private httpClient: HttpClient
  ) {}

  public getLoginErrors(): Subject<string> {
    return this.logInErrorSubject;
  }

  login(context: LoginContext): Credentials {
    const data = {
      username: context.username,
      password: context.password,
      remember: context.remember
    };
    const auth = {
      username: context.username,
      password: context.password
    };

    this.httpClient
      .post<User>(`${environment.secureUserApi}/authenticate`, auth)
      .pipe(
        map(user => {
          log.debug(' User: ' + user.name);
          // login successful if there's a jwt token in the response
          log.debug('User.token: ' + user.token);
          if (user && user.token) {
            this.credentials.username = user.name;
            this.credentials.token = user.token;
            this.credentialsService.setCredentials(this.credentials, data.remember);
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
          } else {
            log.debug(`Error on login in `);
            this.error = 'error';
          }
        })
      )
      .subscribe(
        theCredentials => {
          log.debug(` credential.token: ${this.credentials.token} successfully logged in`);
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
          this.logInErrorSubject.next(error.message);
        }
      );
    return this.credentials;
  }
}
