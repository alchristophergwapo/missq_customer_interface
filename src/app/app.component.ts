import { Component, OnInit } from '@angular/core';

import { Platform, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActionSheetController } from '@ionic/angular';
import {Router } from '@angular/router';
import { AuthService } from './api/services/auth/auth.service';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  
  dashboard : boolean = true;
  currentRoute: string;
  user: any;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private authService: AuthService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  logout() {
    this.authService.logout();
    console.log(this.authenticationService.user);
  }

  onClickNav(event) {

    event.preventDefault();

    event.target.parentElement.classList.add("active");

    var activeElement = document.getElementsByClassName("active");

    for (var index = 0; index < activeElement.length; index++) {

      if (activeElement[index].id !== event.target.parentElement.id) {
        activeElement[index].classList.remove("active");
      }
    }

  };

  async clickChatSupport() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Chat Support',
      buttons: [{
        text: 'Live Chat',
        role: 'destructive',
        icon: 'chatbubbles-outline',
        cssClass: 'chat',
        handler: () => {
          this.router.navigateByUrl('live-chat');
          this.dashboard = false;
        }
      },
      {
        text: 'Email Us',
        icon: 'mail-outline',
        cssClass: 'mail',
        handler: () => {
          console.log('Email Chat');
        }
      },
      {
        text: 'FAQ',
        icon: 'help-circle-outline',
        cssClass: 'help',
        handler: () => {
          console.log('Frequently Ask Questions');
        }
      }]
    });
    await actionSheet.present();
  };

  setDashboard(bool) {
    if (bool) {
      this.dashboard = true;
    } else {
      this.dashboard = false;
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authService.authSubject.subscribe(state => {
        if (state) {
          this.router.navigate(['place-order']);
        } else {
          this.router.navigate(['home']);
        }
      });

      this.currentRoute = window.location.pathname;

      this.storage.get('jwt-token').then(res=> {
        if (res) {
          this.user = res.user
        }
      })
    });
  }

  ngOnInit() {
    this.storage.get('jwt-token').then(res=> {
      if (res) {
        this.user = res.user
      }
    });

    this.setDashboard(true);
  }
}
