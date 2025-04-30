import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  getById<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}/`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}/`, data);
  }

  put<T>(endpoint: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}/`, data);
  }

  delete(endpoint: string, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}/`);
  }

  getAllPaginated<T>(endpoint: string): Observable<T[]> {
    const allData: T[] = [];
  
    const fetchPage = (url: string): Observable<T[]> => {
      return new Observable<T[]>(observer => {
        this.http.get<any>(url).subscribe({
          next: response => {
            allData.push(...response.results);
            if (response.next) {
              // Recursively fetch the next page
              fetchPage(response.next).subscribe({
                next: () => {
                  observer.next(allData);
                  observer.complete();
                }
              });
            } else {
              observer.next(allData);
              observer.complete();
            }
          },
          error: err => observer.error(err)
        });
      });
    };
  
    return fetchPage(`${this.baseUrl}/${endpoint}/`);
  }
  
}