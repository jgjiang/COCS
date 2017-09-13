import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toPromise';
import * as auth0 from 'auth0-js';
import { Http, Response, Headers} from '@angular/http';

@Injectable()
export class AuthService {
  requestedScopes: string = 'openid profile email';

  auth0 = new auth0.WebAuth({
    clientID: 'MMgLSg_A8pS369maq7TCnH0xmd3JHkn0',
    domain: 'firjjg.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://firjjg.eu.auth0.com/userinfo',
    redirectUri: 'http://localhost:3000',
    scope: this.requestedScopes

  });

  userProfile: any;

  constructor(public router: Router, private http: Http) {}


  public login(): Promise <Object> {
    return new Promise((resolve, reject) => {
      // if (this.isAuthenticated()) {
      //   this.getProfile((err, profile) => {
      //     this.userProfile = profile;
      //     resolve(profile);
      //   });
      // } else {
      //   this.auth0.authorize({});
      // }

      this.auth0.authorize({});
      this.getProfile((err, profile) => {
        this.userProfile = profile;
        resolve(profile);
      });
    });

  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/problems']);
      } else if (err) {
        this.router.navigate(['/problems']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {

    const scopes = authResult.scope || this.requestedScopes || '';
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('scopes', JSON.stringify(scopes));
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }
    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  public resetPassword(): void {
    this.getProfile((err, profile) => {
      this.userProfile = profile;
    });
    const url = `https://firjjg.eu.auth0.com/dbconnections/change_password`;
    const headers =  new Headers({ 'content-type': 'application/json' });
    let body = { client_id: 'MMgLSg_A8pS369maq7TCnH0xmd3JHkn0',
        email: this.userProfile.name,
        connection: 'Username-Password-Authentication' };
    this.http.post(url, body, headers).toPromise()
      .then((res: Response) => {
          console.log(res.json());
      }).catch(this.handleError);

  }

  public handleError(error: any): Promise <any> {
    console.error('Error Occurred', error);
    return Promise.reject(error.meassage || error);
  }


}
