// import { Injectable } from '@angular/core';
// import { Observable, map } from 'rxjs';
// import { ApiService } from './api.service';
// import { Lighthouse } from '../models/lighthouse.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class LighthouseService {
//   private endpoint = 'lighthouses';

//   constructor(private apiService: ApiService) { }

//   // Fetch all lighthouses
//   getLighthouses(): Observable<Lighthouse[]> {
//     return this.apiService.get<{ results: Lighthouse[] }>(this.endpoint)
//       .pipe(map(response => response.results)); // Extract only the array of lighthouses
//   }

//   // Fetch a single lighthouse by ID
//   getLighthouse(id: number): Observable<Lighthouse> {
//     return this.apiService.getById<Lighthouse>(this.endpoint, id);
//   }

//   // Search lighthouses by name or country
//   searchLighthouses(query: string): Observable<Lighthouse[]> {
//     return this.apiService.get<{ results: Lighthouse[] }>(`${this.endpoint}/search/?q=${query}`)
//       .pipe(map(response => response.results)); // Extract only the array of lighthouses matching the search
//   }

//   // Import lighthouse data (optional, depends on how you want to use it)
//   importLighthouses(): Observable<any> {
//     return this.apiService.post<any>(`${this.endpoint}/import_lighthouses`, {});
//   }
// }


// src/app/services/lighthouse.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lighthouse } from '../models/lighthouse.model';
import { environment } from '../../environments/environment';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class LighthouseService {
  private apiUrl = `${environment.apiUrl}/lighthouses`;

  constructor(private http: HttpClient) { }

  getLighthouses(page: number = 1): Observable<PaginatedResponse<Lighthouse>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PaginatedResponse<Lighthouse>>(this.apiUrl, { params });
  }

  getLighthouse(id: number): Observable<Lighthouse> {
    return this.http.get<Lighthouse>(`${this.apiUrl}/${id}`);
  }

  searchLighthouses(query: string): Observable<Lighthouse[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Lighthouse[]>(`${this.apiUrl}/search/`, { params });
  }
}