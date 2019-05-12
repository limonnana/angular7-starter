import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticateService } from '@app/core/authentication/authenticate.service';
import { environment } from '@env/environment';
import { Logger, I18nService, untilDestroyed } from '@app/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Credentials, CredentialsService } from '@app/core/';
import { User } from '@app/entities/user';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  token: 'not defined yet';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticateService: AuthenticateService,
    private httpClient: HttpClient,
    private credentialsService: CredentialsService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  login() {
    const context = this.loginForm.value;
    const credentials: Credentials = { username: ' ', token: ' ' };
    const data = {
      username: context.username,
      password: context.password
    };
    this.httpClient
      .post<User>(`${environment.secureUserApi}/authenticate`, data)
      .pipe(
        map(theUser => {
          // login successful if there's a jwt token in the response
          if (theUser && theUser.token) {
            credentials.username = theUser.name;
            credentials.token = theUser.token;
            this.credentialsService.setCredentials(credentials, true);
            log.debug(`User from server: ********** ` + credentials.token);
          } else {
            log.debug(`Error on login in `);
          }
        })
      )
      .subscribe(
        theCredentials => {
          log.debug(` credential.token: ${theCredentials} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  /* login() {
    this.isLoading = true;
   // const login$ = this.authenticateService.login(this.loginForm.value);
    log.debug('credentials: ' + login$);
    login$
      /*.pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        credentials => {
         //  log.debug(` credential.token: ${credentials.token} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }
*/
  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }
}
