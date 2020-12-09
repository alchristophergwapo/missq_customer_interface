import { Component, OnInit } from '@angular/core';
import { User } from "../api/models/user";


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  passwordMatch: Boolean = null;

  public user: User;
  public emailCard = true;
  public codeCard = false;
  public newPass = false;

  confirm: string;
  password: string;
  public type = 'password';
  public type1 = 'password';
  public showPass = false;
  public showPass1 = false;

  constructor() { }

  ngOnInit() {
    this.user = {
      name: "",
      address: "",
      code: "",
      phone: null,
      email: "",
      birth_date: null,
      password: "",
      confirm: "",
      picture: "",
      id_image: "",
      id_number: null
    };

    fetch('assets/country-code.json').then(async res => {
      let result = await res.json();
      this.dataList = result.data;

    })
  }

  noSubmit(e) {
    e.preventDefault();
  }

  async register(form) {

    // form.value['picture'] = this.selfie;
    // form.value['id_image'] = this.idPic;

    // console.log("Updated form: ", form.value);

    // this.authService.register(form.value, { picture: this.selfie, id_image: this.idPic }, { picture: this.selfie, id_image: this.idPic }).subscribe(response => {
    //   if (response) {
    //     this.isSubmitted = true;
    //     this.router.navigateByUrl("login");
    //   }
    // });
  }
  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  showPasswordConfirm() {
    this.showPass1 = !this.showPass1;
    if (this.showPass1) {
      this.type1 = 'text';
    } else {
      this.type1 = 'password';
    }
  }

  sendEmail(form1) {
    this.emailCard = false;
    this.codeCard = true;
  }

  sendCode(form2) {
    this.codeCard = false;
    this.newPass = true;
  }
  confirmPassword(event) {
    const password = this.user.password;
    console.log(password);

    if (event.target.value == password) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }
  validatePassword(event) {
    const password = {
      length: 6,
      uppercase: /[A-Z]/g,
      lowercase: /[a-z]/g,
      number: /[0-9 ]/g
    }

    document.getElementById("message").style.display = "block";

    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");

    // Validate lowercase letters
    if (event.target.value.match(password.lowercase)) {

      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    if (event.target.value.match(password.uppercase)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    if (event.target.value.match(password.number)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate length
    if (event.target.value.length >= password.length) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  }

  onBlur(event) {
    document.getElementById("message").style.display = "none";
  }

}