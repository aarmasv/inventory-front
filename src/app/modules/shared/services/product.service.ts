import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(){
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }

  saveProduct(body:any){
    const endpoint = `${base_url}/products`;
    return this.http.post(endpoint, body);
  }

}
