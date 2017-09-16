import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'Collabrative Online Judge System';

  username = '';
  profile: any;

  searchBox: FormControl = new FormControl();
  subscription: Subscription;

  constructor(@Inject('auth') private auth, @Inject('input') private input,
              private router: Router) { }

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

    this.subscription = this.searchBox.valueChanges
                                      .debounceTime(200)
                                      .subscribe(term => this.input.changeInput(term));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchProblems(): void {
    this.router.navigate(['/problems']);
  }

  login(): void {
    this.auth.login().then((profile) => this.profile = profile);
  }

  logout(): void {
    this.auth.logout();
  }



}
