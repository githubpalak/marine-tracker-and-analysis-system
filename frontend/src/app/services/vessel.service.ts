import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Vessel } from '../models/vessel.model';

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private endpoint = 'vessels';

  constructor(private apiService: ApiService) { }

  getVessels(): Observable<Vessel[]> {
    return this.apiService.get<{ results: Vessel[] }>(this.endpoint)
      .pipe(map(response => response.results)); // extract only the array
  }

  getVessel(id: number): Observable<Vessel> {
    return this.apiService.getById<Vessel>(this.endpoint, id);
  }
}

