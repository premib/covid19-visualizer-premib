import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpService } from '../http.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  
  constructor(fb: FormBuilder, private http: HttpService, private route: Router) {
    this.loginForm = fb.group({
      'userName': ['', [Validators.required]],
      'password': ['', [Validators.required]]
    })
  }
  
  ngOnInit(): void {

  }

  login(form: FormGroup): void{
    this.http.authenticate(form.value.userName, form.value.password).subscribe(
      (response)=> {
        localStorage.setItem('covid19new', response.token);
        this.route.navigateByUrl('/dashboard');
      },
      (error)=> {
        console.log(error);
      },
      ()=>{
        console.log("login finally");
      }
    )
  }
}
