import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { FormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CountryCodes } from '../countryCodeModel';
// import { ConfirmedValidatorDirective } from '../confirmed-validators.directive';

import { AuthService } from '../api/services/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../api/models/user';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  public user: User;
  isSubmitted = false;
  dataList: Array<CountryCodes> = [];

  constructor(private dataService: ServicesService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = {  
      name: '',
      address: '',
      code: '',
      phone: null,
      email: '',
      birth_date: null,
      password: '',
      confirm: '',
      picture: '',
      id_image: '',
      id_number: null
  };
    return this.dataService.getData().subscribe(data => {
      console.log(data)
      this.dataList = data
      data.forEach(per => {
        // this.percentList.push(per.percentage)
        // this.total();
        // console.log(per.dial_code);
      });
      // // console.log(this.percentList)
    }) 
  }
  // form: FormGroup = new FormGroup({});


  register(form) {
    this.isSubmitted = true;
    // console.log(form)
    this.authService.register(form.value).subscribe((response) => {
      if (response) {
        this.router.navigateByUrl('login');
      }
    });
  }
  
  noSubmit(e) {
    e.preventDefault();
  }
  loadImageFromDevice(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      // get the blob of the image:
      let blob: Blob = new Blob([new Uint8Array((reader.result as ArrayBuffer))]);
      // create blobURL, such that we could use it in an image element:
      let blobURL: string = URL.createObjectURL(blob);
    };
    reader.onerror = (error) => {
      //handle errors
    };
  };
}
