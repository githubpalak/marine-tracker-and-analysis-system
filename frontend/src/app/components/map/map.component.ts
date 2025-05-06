// import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import * as L from 'leaflet';
// import { VesselService } from '../../services/vessel.service';
// import { PortService } from '../../services/port.service';
// import { LighthouseService } from '../../services/lighthouse.service';
// import { Vessel } from '../../models/vessel.model';
// import { Port } from '../../models/port.model';
// import { Lighthouse } from '../../models/lighthouse.model';
// import { forkJoin } from 'rxjs';

// @Component({
//   selector: 'app-map',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.scss']
// })
// export class MapComponent implements OnInit, AfterViewInit {
//   map!: L.Map;
//   vessels: Vessel[] = [];
//   ports: Port[] = [];
//   lighthouses: Lighthouse[] = [];

//   vesselMarkers = L.layerGroup();
//   portMarkers = L.layerGroup();
//   lighthouseMarkers = L.layerGroup();

//   selectedVessel: Vessel | null = null;
//   selectedPort: Port | null = null;
//   selectedLighthouse: Lighthouse | null = null;

//   showVessels = true;
//   showPorts = true;
//   showLighthouses = true;

//   // Just the URLs — we’ll use them in divIcon directly
//   vesselIconUrls = [
//     'assets/vessel-icon-red.png',
//     'assets/vessel-icon-blue.png',
//     'assets/vessel-icon-green.png'
//   ];

//   portIcon = L.icon({
//     iconUrl: 'assets/port-icon.png',
//     iconSize: [24, 24],
//     iconAnchor: [12, 12]
//   });

//   lighthouseIcon = L.icon({
//     iconUrl: 'assets/lighthouse-icon.png',
//     iconSize: [24, 24],
//     iconAnchor: [12, 12]
//   });

//   constructor(
//     private vesselService: VesselService,
//     private portService: PortService,
//     private lighthouseService: LighthouseService
//   ) {}

//   ngOnInit(): void {
//     this.loadData();
//   }

//   ngAfterViewInit(): void {
//     this.initMap();
//   }

//   initMap(): void {
//     this.map = L.map('map').setView([0, 0], 3);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 19,
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(this.map);

//     this.vesselMarkers.addTo(this.map);
//     this.portMarkers.addTo(this.map);
//     this.lighthouseMarkers.addTo(this.map);
//   }

//   loadData(): void {
//     forkJoin({
//       vessels: this.vesselService.getVessels(),
//       ports: this.portService.getPorts(),
//       lighthouses: this.lighthouseService.getLighthouses()
//     }).subscribe(data => {
//       this.vessels = data.vessels;
//       this.ports = data.ports;
//       this.lighthouses = data.lighthouses;

//       this.addVesselsToMap();
//       // this.addPortsToMap();
//       this.addLighthousesToMap();

//       this.centerMapOnData();
//     });
//   }

//   addVesselsToMap(): void {
//     this.vesselMarkers.clearLayers();

//     this.vessels.forEach(vessel => {
//       const iconUrl = this.getRandomVesselIconUrl();
//       const heading = vessel.last_position?.heading || 0;

//       const icon = L.divIcon({
//         className: 'vessel-icon',
//         html: `<img src="${iconUrl}" style="transform: rotate(${heading}deg); width: 7px; height: 17px;" />`,
//         iconSize: [6, 10],
//         iconAnchor: [3, 5]
//       });

//       const marker = L.marker(
//         [vessel.last_position.latitude, vessel.last_position.longitude],
//         { icon: icon }
//       ).addTo(this.vesselMarkers);

//       marker.bindTooltip(vessel.name);
//       marker.on('click', () => this.selectVessel(vessel));
//     });
//   }

//   // addPortsToMap(): void {
//   //   this.portMarkers.clearLayers();

//   //   this.ports.forEach(port => {
//   //     const marker = L.marker(
//   //       [port.latitude, port.longitude],
//   //       { icon: this.portIcon }
//   //     ).addTo(this.portMarkers);

//   //     marker.bindTooltip(port.name);
//   //     marker.on('click', () => this.selectPort(port));
//   //   });
//   // }

//   addLighthousesToMap(): void {
//     this.lighthouseMarkers.clearLayers();

//     this.lighthouses.forEach(lighthouse => {
//       const marker = L.marker(
//         [lighthouse.latitude, lighthouse.longitude],
//         { icon: this.lighthouseIcon }
//       ).addTo(this.lighthouseMarkers);

//       marker.bindTooltip(lighthouse.name);
//       marker.on('click', () => this.selectLighthouse(lighthouse));
//     });
//   }

//   centerMapOnData(): void {
//     const allPoints: L.LatLngExpression[] = [];

//     this.vessels.forEach(v => allPoints.push([v.last_position.latitude, v.last_position.longitude]));
//     // this.ports.forEach(p => allPoints.push([p.latitude, p.longitude]));
//     this.lighthouses.forEach(l => allPoints.push([l.latitude, l.longitude]));

//     if (allPoints.length > 0) {
//       const bounds = L.latLngBounds(allPoints);
//       this.map.fitBounds(bounds);
//     }
//   }

//   getRandomVesselIconUrl(): string {
//     const index = Math.floor(Math.random() * this.vesselIconUrls.length);
//     return this.vesselIconUrls[index];
//   }

//   selectVessel(vessel: Vessel): void {
//     this.clearSelection();
//     this.selectedVessel = vessel;
//   }

//   selectPort(port: Port): void {
//     this.clearSelection();
//     this.selectedPort = port;
//   }

//   selectLighthouse(lighthouse: Lighthouse): void {
//     this.clearSelection();
//     this.selectedLighthouse = lighthouse;
//   }

//   clearSelection(): void {
//     this.selectedVessel = null;
//     this.selectedPort = null;
//     this.selectedLighthouse = null;
//   }

//   toggleLayer(layer: string): void {
//     switch (layer) {
//       case 'vessels':
//         this.showVessels = !this.showVessels;
//         this.showVessels ? this.vesselMarkers.addTo(this.map) : this.vesselMarkers.removeFrom(this.map);
//         break;
//       case 'ports':
//         this.showPorts = !this.showPorts;
//         this.showPorts ? this.portMarkers.addTo(this.map) : this.portMarkers.removeFrom(this.map);
//         break;
//       case 'lighthouses':
//         this.showLighthouses = !this.showLighthouses;
//         this.showLighthouses ? this.lighthouseMarkers.addTo(this.map) : this.lighthouseMarkers.removeFrom(this.map);
//         break;
//     }
//   }

//   getVesselStatus(status: string): string {
//     const statusMap: { [key: string]: string } = {
//       '0': 'Under way using engine',
//       '1': 'At anchor',
//       '2': 'Not under command',
//       '3': 'Restricted maneuverability',
//       '4': 'Constrained by her draught',
//       '5': 'Moored',
//       '6': 'Aground',
//       '7': 'Engaged in fishing',
//       '8': 'Under way sailing',
//       '9': 'Reserved for future use',
//       '10': 'Reserved for future use',
//       '11': 'Towing astern',
//       '12': 'Pushing ahead/towing alongside',
//       '13': 'Reserved',
//       '14': 'AIS-SART',
//       '15': 'Not defined'
//     };

//     return statusMap[status] || 'Unknown';
//   }

//   formatDate(timestamp: string): string {
//     return new Date(timestamp).toLocaleString();
//   }
// }

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { VesselService } from '../../services/vessel.service';
import { PortService } from '../../services/port.service';
// import { LighthouseService } from '../../services/lighthouse.service';
import { Vessel } from '../../models/vessel.model';
import { Port } from '../../models/port.model';
// import { Lighthouse } from '../../models/lighthouse.model';
import { forkJoin } from 'rxjs';
import { AreaCoordinatesService } from '../../shared/area-coordinates.service'; // Import the service for fallback coordinates

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  map!: L.Map;
  vessels: Vessel[] = [];
  // ports: Port[] = [];
  // lighthouses: Lighthouse[] = [];

  vesselMarkers = L.layerGroup();
  // portMarkers = L.layerGroup();
  // lighthouseMarkers = L.layerGroup();

  selectedVessel: Vessel | null = null;
  // selectedPort: Port | null = null;
  // selectedLighthouse: Lighthouse | null = null;

  showVessels = true;
  // showPorts = true;
  // showLighthouses = true;

  // Just the URLs — we’ll use them in divIcon directly
  vesselIconUrls = [
    'assets/vessel-icon-red.png',
    'assets/vessel-icon-blue.png',
    'assets/vessel-icon-green.png'
  ];

  // portIcon = L.icon({
  //   iconUrl: 'assets/port-icon.png',
  //   iconSize: [24, 24],
  //   iconAnchor: [12, 12]
  // });

  // lighthouseIcon = L.icon({
  //   iconUrl: 'assets/lighthouse-icon.png',
  //   iconSize: [24, 24],
  //   iconAnchor: [12, 12]
  // });

  constructor(
    private vesselService: VesselService,
    // private portService: PortService,
    // private lighthouseService: LighthouseService,
    private areaCoordService: AreaCoordinatesService // Inject the service to handle fallback coordinates
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([0, 0], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.vesselMarkers.addTo(this.map);
    // this.portMarkers.addTo(this.map);
    // this.lighthouseMarkers.addTo(this.map);
  }

  loadData(): void {
    forkJoin({
      vessels: this.vesselService.getVessels(),
      // ports: this.portService.getPorts(),
      // lighthouses: this.lighthouseService.getLighthouses()
    }).subscribe(data => {
      this.vessels = data.vessels;
      // this.ports = data.ports;
      // this.lighthouses = data.lighthouses;

      this.addVesselsToMap();
      // this.addPortsToMap(); // Ensure this function is called
      // this.addLighthousesToMap();

      this.centerMapOnData();
    });
  }

  addVesselsToMap(): void {
    this.vesselMarkers.clearLayers();

    this.vessels.forEach(vessel => {
      const iconUrl = this.getRandomVesselIconUrl();
      const heading = vessel.last_position?.heading || 0;

      const icon = L.divIcon({
        className: 'vessel-icon',
        html: `<img src="${iconUrl}" style="transform: rotate(${heading}deg); width: 7px; height: 17px;" />`,
        iconSize: [6, 10],
        iconAnchor: [3, 5]
      });

      const marker = L.marker(
        [vessel.last_position.latitude, vessel.last_position.longitude],
        { icon: icon }
      ).addTo(this.vesselMarkers);

      marker.bindTooltip(vessel.name);
      marker.on('click', () => this.selectVessel(vessel));
    });
  }

  // addPortsToMap(): void {
  //   this.portMarkers.clearLayers();

  //   this.ports.forEach(port => {
  //     let lat = port.latitude;
  //     let lng = port.longitude;

  //     // Fallback to area coordinates if latitude/longitude are missing
  //     if (lat === undefined || lng === undefined) {
  //       const fallback = this.areaCoordService.getCoordinates(port.Area_Local);
  //       if (fallback) {
  //         lat = fallback.lat;
  //         lng = fallback.lng;
  //       }
  //     }

  //     // Ensure lat and lng are valid numbers before using them in Leaflet
  //     if (lat !== undefined && lng !== undefined) {
  //       const marker = L.marker([lat, lng], { icon: this.portIcon })
  //         .addTo(this.portMarkers);

  //       marker.bindTooltip(port.Port_Name);
  //       marker.on('click', () => this.selectPort(port));
  //     }
  //   });
  // }

  // addLighthousesToMap(): void {
  //   this.lighthouseMarkers.clearLayers();

  //   this.lighthouses.forEach(lighthouse => {
  //     const marker = L.marker(
  //       [lighthouse.latitude, lighthouse.longitude],
  //       { icon: this.lighthouseIcon }
  //     ).addTo(this.lighthouseMarkers);

  //     marker.bindTooltip(lighthouse.name);
  //     marker.on('click', () => this.selectLighthouse(lighthouse));
  //   });
  // }

 centerMapOnData(): void {
  const allPoints: L.LatLngExpression[] = [];

  this.vessels.forEach(v => {
    if (v.last_position.latitude && v.last_position.longitude) {
      allPoints.push([v.last_position.latitude, v.last_position.longitude]);
    }
  });

  // this.ports.forEach(p => {
  //   // Only add the port to the points if both latitude and longitude are valid numbers
  //   if (p.latitude !== undefined && p.longitude !== undefined) {
  //     allPoints.push([p.latitude, p.longitude]);
  //   }
  // });

  // this.lighthouses.forEach(l => {
  //   if (l.latitude && l.longitude) {
  //     allPoints.push([l.latitude, l.longitude]);
  //   }
  // });

  if (allPoints.length > 0) {
    const bounds = L.latLngBounds(allPoints);
    this.map.fitBounds(bounds);
  }
}


  getRandomVesselIconUrl(): string {
    const index = Math.floor(Math.random() * this.vesselIconUrls.length);
    return this.vesselIconUrls[index];
  }

  selectVessel(vessel: Vessel): void {
    this.clearSelection();
    this.selectedVessel = vessel;
  }

  // selectPort(port: Port): void {
  //   this.clearSelection();
  //   this.selectedPort = port;
  // }

  // selectLighthouse(lighthouse: Lighthouse): void {
  //   this.clearSelection();
  //   this.selectedLighthouse = lighthouse;
  // }

  clearSelection(): void {
    this.selectedVessel = null;
    // this.selectedPort = null;
    // this.selectedLighthouse = null;
  }

  toggleLayer(layer: string): void {
    switch (layer) {
      case 'vessels':
        this.showVessels = !this.showVessels;
        this.showVessels ? this.vesselMarkers.addTo(this.map) : this.vesselMarkers.removeFrom(this.map);
        break;
      // case 'ports':
      //   this.showPorts = !this.showPorts;
      //   this.showPorts ? this.portMarkers.addTo(this.map) : this.portMarkers.removeFrom(this.map);
      //   break;
      // case 'lighthouses':
      //   this.showLighthouses = !this.showLighthouses;
      //   this.showLighthouses ? this.lighthouseMarkers.addTo(this.map) : this.lighthouseMarkers.removeFrom(this.map);
      //   break;
    }
  }

  getVesselStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      '0': 'Under way using engine',
      '1': 'At anchor',
      '2': 'Not under command',
      '3': 'Restricted maneuverability',
      '4': 'Constrained by her draught',
      '5': 'Moored',
      '6': 'Aground',
      '7': 'Engaged in fishing',
      '8': 'Under way sailing',
      '9': 'Reserved for future use',
      '10': 'Reserved for future use',
      '11': 'Towing astern',
      '12': 'Pushing ahead/towing alongside',
      '13': 'Reserved',
      '14': 'AIS-SART',
      '15': 'Not defined'
    };

    return statusMap[status] || 'Unknown';
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
}
