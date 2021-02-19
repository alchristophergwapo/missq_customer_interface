import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { switchMap, take, tap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Storage } from "@ionic/storage";

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';

@Injectable()
export class AuthService {

  public user: Observable<any>;
  // AUTH_SERVER_ADDRESS: string = 'http://msqcustomerinterfacebackend-env-1.eba-negj35aw.us-east-2.elasticbeanstalk.com/';
  // AUTH_SERVER_ADDRESS: string = 'http://localhost:8080/';
  AUTH_SERVER_ADDRESS: string = 'http://3.137.219.17:8080/';
  
  authSubject = new BehaviorSubject(false);


  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    private platform: Platform,
    private router: Router,
  ) {
    this.platform.ready().then(() => {
      this.loadStoredToken();
    });
  };

  /**
   * 
   */

  loadStoredToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authSubject.next(true);
        this.user = res.user;
      }
    })
  }

  register(data, id_image, selfie): Observable<any> {
    let url = this.AUTH_SERVER_ADDRESS + 'authenticate/register';

    var formData: any = new FormData();

    // console.log('Register::', data);


    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('code', data.code);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('birth_date', data.birth_date);
    formData.append('password', data.password);
    formData.append('picture', data.picture);
    formData.append('id_image', data.id_image);
    formData.append('id_number', data.id_number);
    formData.append('img[]', id_image, data.id_image);
    formData.append('img[]', selfie, data.picture)
    // debugger

    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    return this.httpClient.post<any>(url, formData, {
      reportProgress: true,
      observe: 'events'
    })
  };

  login(user: User){
    console.log("nisud sa log in function")
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}authenticate/login`, user)
    .pipe(
      tap(res=>{
        if (res) {
          console.log('nisud sa tap');
          this.authSubject.next(true);
          this.user = res.user;
          this.storage.set(TOKEN_KEY,res);
        }
      })

    );
  };

  updateContactInfo(user: User) {
    console.log('nisud sa auth service.', user)
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}authenticate/profile`, user).pipe(
      take(1),

      switchMap(token => {
        console.log("Auth Service token in login: ", token);
        this.authSubject.next(true);
        this.user = token.user;
        console.log("token :: ", TOKEN_KEY)

        let storageObservable = from(this.storage.set(TOKEN_KEY, token));
        return storageObservable;
      })

    );
  }

  getAllMessages(): Observable<any> {
    return this.httpClient.get<any>(`${this.AUTH_SERVER_ADDRESS}chat/allMessages`);
  }

  //FILTERED STATUS
  filteredOngoing(datas): Observable<any> {
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}msq_service/filteredOngoing`, datas)
  }

  getUser() {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        return res.user;
      } else {
        return null;
      }
    })
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('home');
      this.authSubject.next(false);
    });
  };

  isLoggedIn() {
    return this.authSubject.value;
  };
}
