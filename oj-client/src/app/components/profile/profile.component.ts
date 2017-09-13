import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: string = ' ';
  email: string = ' ';
  profile: any;

  constructor(@Inject('auth') private auth) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      if (this.auth.userProfile) {
        this.profile = this.auth.userProfile;
        this.username = this.profile.nickname;
        this.email = this.profile.email;
      } else {
        this.auth.getProfile((err, profile) => {
          this.profile = profile;
          this.username = this.profile.nickname;
          this.email = this.profile.email;
        });
      }
    }
  }

  resetPassword() {
    this.auth.resetPassword();
  }

}
