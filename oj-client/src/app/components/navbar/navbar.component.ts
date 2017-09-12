import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'Collabrative Online Judge System';

  username = '';
  profile: any;

  constructor(@Inject('auth') private auth) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      if (this.auth.userProfile) {
        this.profile = this.auth.userProfile;
      } else {
        this.auth.getProfile((err, profile) => {
          this.profile = profile;
        });
      }
    }
  }

  login(): void {
    this.auth.login().then((profile) => this.profile = profile);
  }

  logout(): void {
    this.auth.logout();
  }



}
