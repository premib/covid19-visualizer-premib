import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpService } from '../http.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(fb: FormBuilder, private http: HttpService) { 
    this.registerForm = fb.group({
      'firstName' : ['', [Validators.required]],
      'lastName' : ['', [Validators.required]],
      'userName' : ['', [Validators.required]],
      'password' : ['', [Validators.required]]
    });
    
  }

  registerUser(form: FormGroup): void{
     this.http.register(form.value.firstName, form.value.lastName, form.value.userName, form.value.password).subscribe(
       (response)=> {
         console.log(response)
       },
       (error)=> {
         console.log(error)
       },
       ()=> {
         console.log('finally')
       }
     )
  }

  ngOnInit(): void {
  }

}
