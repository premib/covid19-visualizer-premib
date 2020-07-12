import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, ObservableLike } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  
  authenticate(userName: string, password: string): Observable<any>{
    return this.http.get(`https://zen-user-api.herokuapp.com/users/authenticate/${userName}/${password}`)
  }

  register(firstName: string, lastName: string, userName: string, password: string): Observable<any>{
    let data = {
      firstName: firstName,
       lastName: lastName,
       email: userName,
       password: password
     }
    
    let options: object = {
      responseType: 'text' as const,
      
    }
    return this.http.post(`https://zen-user-api.herokuapp.com/users/authenticate`, data, options)
  }

  dailyCount(): Observable<any>{
    return this.http.get('https://api.covid19india.org/v3/data.json')
  }

  timeseries(): Observable<any>{
    return this.http.get('https://api.covid19india.org/data.json')
  }

  districtData(): Observable<any>{
    return this.http.get('https://api.covid19india.org/state_district_wise.json')
  }

  stateDailyData(): Observable<any>{
    return this.http.get('https://api.covid19india.org/v3/timeseries.json')
  }
}
