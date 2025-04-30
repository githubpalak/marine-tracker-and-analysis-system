import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Port } from '../models/port.model'; // Adjust path if necessary

@Injectable({
  providedIn: 'root'
})
export class PortService {
  private endpoint = 'ports';

  constructor(private apiService: ApiService) { }

  getPorts(): Observable<Port[]> {
    return this.apiService.get<{ results: Port[] }>(this.endpoint)
      .pipe(map(response => response.results)); // extract only the array
  }

  getPort(id: number): Observable<Port> {
    return this.apiService.getById<Port>(this.endpoint, id);
  }
}
