// import { Injectable } from '@angular/core';
// import { Observable, map } from 'rxjs';
// import { ApiService } from './api.service';
// import { Port } from '../models/port.model'; // Adjust path if necessary

// @Injectable({
//   providedIn: 'root'
// })
// export class PortService {
//   private endpoint = 'ports';

//   constructor(private apiService: ApiService) { }

//   getPorts(): Observable<Port[]> {
//     return this.apiService.get<{ results: Port[] }>(this.endpoint)
//       .pipe(map(response => response.results)); // extract only the array
//   }

//   getPort(id: number): Observable<Port> {
//     return this.apiService.getById<Port>(this.endpoint, id);
//   }
// }

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Port } from '../models/port.model';

@Injectable({
  providedIn: 'root'
})
export class PortService {
  private endpoint = 'ports';

  constructor(private apiService: ApiService) { }

  getPorts(): Observable<Port[]> {
    return this.apiService.get<Port[]>(this.endpoint)
      .pipe(
        map(ports => {
          // Transform the data to ensure compatibility with map component
          return ports.map((port, index) => ({
            ...port,
            // Generate necessary fields for map display
            id: index + 1,  // Create a synthetic id
            name: port.Port_Name,
            country: port.Country,
            un_locode: port.UN_Code,
            // Adding approximate coordinates based on port area
            // In a real application, these would come from the backend
            latitude: this.getRandomLatitude(port.Area_Global),
            longitude: this.getRandomLongitude(port.Area_Global),
            size: port.Type,
            image_url: '' // No images provided from backend
          }));
        })
      );
  }

  getPort(id: number): Observable<Port> {
    return this.apiService.getById<Port>(this.endpoint, id);
  }

  // Helper methods to generate coordinates based on global areas
  // These are approximations for demonstration purposes
  private getRandomLatitude(areaGlobal: string): number {
    const areaMap: { [key: string]: [number, number] } = {
      'North America': [25, 60],
      'South America': [-50, 10],
      'Europe': [35, 65],
      'Asia': [0, 60],
      'Africa': [-35, 35],
      'Australia': [-45, -10],
      'Middle East': [15, 35]
    };

    const range = areaMap[areaGlobal] || [-60, 70];
    return range[0] + Math.random() * (range[1] - range[0]);
  }

  private getRandomLongitude(areaGlobal: string): number {
    const areaMap: { [key: string]: [number, number] } = {
      'North America': [-170, -60],
      'South America': [-80, -30],
      'Europe': [-10, 40],
      'Asia': [60, 140],
      'Africa': [-20, 50],
      'Australia': [110, 155],
      'Middle East': [30, 60]
    };

    const range = areaMap[areaGlobal] || [-180, 180];
    return range[0] + Math.random() * (range[1] - range[0]);
  }
}