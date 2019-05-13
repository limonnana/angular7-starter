import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticateService } from '@app/core/authentication/authenticate.service';
import { environment } from '@env/environment';
import { Logger, I18nService, Credentials } from '@app/core';
import { CredentialsService } from '@app/core/authentication/credentials.service';

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
    private credentialsService: CredentialsService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  login() {
    this.isLoading = true;
    const credentials: Credentials = this.authenticateService.login(this.loginForm.value);
    /*.subscribe(
        credentials => {
          log.debug(` credential.token: ${credentials.token} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      ); */
    log.debug(` credential.token: ${credentials.token} `);
    // this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
  }

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
