import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AreaCoordinatesService {
  private areaMap: { [key: string]: { lat: number; lng: number } } = {
    'East China Sea': { lat: 29.0, lng: 125.0 },
    'Singapore Area': { lat: 1.3, lng: 103.8 },
    'Bohai Sea': { lat: 39.0, lng: 121.5 },
    'South China': { lat: 22.5, lng: 114.1 },
    'Yellow Sea': { lat: 35.0, lng: 123.0 },
    'Rotterdam Area': { lat: 51.9, lng: 4.5 },
    'North Sea': { lat: 56.0, lng: 3.0 },
    'Marmara Sea': { lat: 40.9, lng: 27.6 },
    'Gulf of Mexico': { lat: 25.0, lng: -90.0 },
    'Java Sea': { lat: -5.5, lng: 112.5 },
    'Antwerp Area': { lat: 51.3, lng: 4.4 },
    'English Channel': { lat: 50.5, lng: -1.5 },
    'South-East Asia': { lat: 1.0, lng: 104.0 },
    'West Coast Canada': { lat: 50.0, lng: -127.0 },
    'Elbe River': { lat: 53.5, lng: 10.0 },
    'Hudson River': { lat: 40.7, lng: -74.0 },
    'Inland, China': { lat: 32.0, lng: 112.0 },
    'US East Coast': { lat: 35.0, lng: -77.0 },
    'US West Coast': { lat: 37.0, lng: -122.0 },
    'Dubai Area': { lat: 25.2, lng: 55.3 },
    'Piraeus Area': { lat: 37.9, lng: 23.6 },
    'West Coast India': { lat: 15.3, lng: 73.8 },
    'East Coast South America': { lat: -23.0, lng: -43.2 },
    'CIS Pacific': { lat: 43.0, lng: 131.9 },
    'Japan Coast': { lat: 35.0, lng: 136.0 },
    // Add more as needed
  };

  getCoordinates(areaLocal: string): { lat: number; lng: number } | null {
    return this.areaMap[areaLocal] || null;
  }
}
