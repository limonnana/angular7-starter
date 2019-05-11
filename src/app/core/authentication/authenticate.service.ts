import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginContext } from './authentication.service';
import { Credentials, CredentialsService } from './credentials.service';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { Logger } from '../logger.service';

const log = new Logger('AuthenticateService');

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  // private _credentials: Credentials | null = null;

  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

  login(context: LoginContext): Observable<Credentials> {
    let token: 'not defined yet';
    const data = {
      username: context.username,
      password: context.password
    };

    //  log.debug(`data:` + data.password + ' , ' + data.password + ' ' + environment.secureUserApi);

    this.httpClient.post<any>(`${environment.secureUserApi}/authenticate`, data).pipe(
      map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          this.credentialsService.setCredentials(user.username, user.token);
          token = user.token;
          log.debug(`User from server: ********** ` + user);
        } else {
          log.debug(`Error on login in `);
        }
      })
    );

    const credentials = {
      username: context.username,
      token: token
    };
    // this._credentials = JSON.parse('{username:' + context.username + ', token:' +  token + '}');

    return of(credentials);
  }
}
