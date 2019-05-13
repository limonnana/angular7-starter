import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  name: string | undefined;

  constructor(private credentialsService: CredentialsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.quote = 'Nice to see you again';
    this.isLoading = false;
    this.name = this.credentialsService.credentials.username;
  }
}
