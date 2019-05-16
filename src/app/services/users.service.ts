import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/entities/user';
import { environment } from '@env/environment';
import { Logger } from '@app/core/logger.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

const log = new Logger('UserService');

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  error: string | undefined;

  constructor(private http: HttpClient) {}

  users: User[];

  public getUsers(): Observable<User> {
    this.http
      .get<User>(`${environment.secureUserApi}/findAll`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
      .subscribe(
        theCredentials => {
          log.debug(` `);
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
    return this.http.get<User>(`${environment.secureUserApi}/findAll`);
  }

  handleError(error: { error: { message: string }; status: any; message: any }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
