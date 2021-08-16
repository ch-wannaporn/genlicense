import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { DATA_SERVICE_URL } from '../../../config'
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  url = DATA_SERVICE_URL

  constructor(private http: HttpClient) { }

  readData(content:string) {
    return this.http.get(this.url+content+'/read').pipe(catchError(this.errorHandler))
  }

  writeData(content:string, body:any) {
    return this.http.post(this.url+content+'/write', body, {
      headers:new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'MyClientCert': '',
          'MyToken': ''
        }
      )
    }).pipe(catchError(this.errorHandler))
  }

  editData(content:string, body:any) {
    return this.http.post(this.url+content+'/edit', body, {
      headers:new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'MyClientCert': '',
          'MyToken': ''
        }
      )
    }).pipe(catchError(this.errorHandler))
  }

  deleteData(content:string, body:any) {
    return this.http.post(this.url+content+'/delete', body, {
      headers:new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'MyClientCert': '',
          'MyToken': ''
        }
      )
    }).pipe(catchError(this.errorHandler))
  }

  findData(content:string, body:any){
    return this.http.post(this.url+content+'/find', body, {
      headers:new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'MyClientCert': '',
          'MyToken': ''
        }
      )
    }).pipe(catchError(this.errorHandler))
  }

  auth(){
    return this.http.post(this.url+'auth', {"email": sessionStorage.getItem('email')}, {
      headers:new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'MyClientCert': '',
          'MyToken': ''
        }
      )
    }).pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    window.alert("Something went wrong. Please try again later.")
    return throwError(error);
  }
}
