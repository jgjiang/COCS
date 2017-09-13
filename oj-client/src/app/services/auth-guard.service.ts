import {Inject, Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';


@Injectable()
export class AuthGuardService implements CanActivate {

  myProfile: any;
  constructor(@Inject('auth') private auth, private router: Router) { }

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/problems']);
      return false;
    }
  }

  isAdmin(): boolean {

      if (this.auth.userProfile) {
        this.myProfile = this.auth.userProfile;
      } else {
        this.auth.getProfile((err, profile) => {
          this.myProfile = profile;
        });
      }

    console.log(this.auth.myProfile);

      if (this.auth.isAuthenticated() && this.myProfile['http://myapp.com/roles'].includes('admin')) {
        return true;
      } else {
        return false;
      }

  }
}
