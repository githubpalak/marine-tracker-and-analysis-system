import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Fleet } from '../models/fleet.model';
import { Vessel } from '../models/vessel.model';

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  private endpoint = 'fleets';
  private currentFleetSubject = new BehaviorSubject<Fleet | null>(null);
  currentFleet$ = this.currentFleetSubject.asObservable();

  constructor(private apiService: ApiService) { }

  getFleets(): Observable<Fleet[]> {
    return this.apiService.get<Fleet[]>(this.endpoint);
  }

  getFleet(id: number): Observable<Fleet> {
    return this.apiService.getById<Fleet>(this.endpoint, id);
  }

  createFleet(fleet: Partial<Fleet>): Observable<Fleet> {
    return this.apiService.post<Fleet>(this.endpoint, fleet);
  }

  updateFleet(id: number, fleet: Partial<Fleet>): Observable<Fleet> {
    return this.apiService.put<Fleet>(this.endpoint, id, fleet);
  }

  deleteFleet(id: number): Observable<any> {
    return this.apiService.delete(this.endpoint, id);
  }

  setCurrentFleet(fleet: Fleet | null): void {
    this.currentFleetSubject.next(fleet);
  }
}