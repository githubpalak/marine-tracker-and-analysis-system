// import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import * as L from 'leaflet';
// import { VesselService } from '../../services/vessel.service';
// import { Vessel } from '../../models/vessel.model';
// import { forkJoin, Subscription, timer } from 'rxjs';
// import { AreaCoordinatesService } from '../../shared/area-coordinates.service';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-map',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.scss']
// })
// export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
//   map!: L.Map;
//   vessels: Vessel[] = [];
//   vesselMarkers = L.layerGroup();

//   selectedVessel: Vessel | null = null;
//   showVessels = true;
//   isLoading = true;

//   // Original map bounds to return to when clearing selection
//   private originalMapBounds: L.LatLngBounds | null = null;

//   // Custom vessel icons with improved styling
//   // vesselIconUrls = [
//   //   'assets/vessel-icon-red.png',
//   //   'assets/vessel-icon-blue.png',
//   //   'assets/vessel-icon-green.png'
//   // ];

//   // private subscriptions: Subscription = new Subscription();
//   // private refreshInterval = 60000; // 60 seconds

//   // Custom vessel icons with improved styling
//   vesselIconUrls = [
//     'assets/vessel-icon-red.png',
//     'assets/vessel-icon-blue.png',
//     'assets/vessel-icon-green.png'
//   ];

//   private subscriptions: Subscription = new Subscription();
//   private refreshInterval = 60000; // 60 seconds
//   private pendingVesselFocus: string | null = null; // Store pending vessel MMSI to focus on

//   // constructor(
//   //   private vesselService: VesselService,
//   //   private areaCoordService: AreaCoordinatesService
//   // ) {}
//   constructor(
//     private vesselService: VesselService,
//     private areaCoordService: AreaCoordinatesService,
//     private route: ActivatedRoute
//   ) {}

//   // ngOnInit(): void {
//   //   this.loadData();

//   //   // Set up periodic data refresh
//   //   const timerSub = timer(this.refreshInterval, this.refreshInterval).subscribe(() => {
//   //     this.refreshData();
//   //   });

//   //   this.subscriptions.add(timerSub);
//   // }
//   ngOnInit(): void {
//     // Check for route parameters first
//     this.route.queryParams.subscribe(params => {
//       if (params['mmsi'] && params['focus'] === 'true') {
//         console.log('Received request to focus on vessel with MMSI:', params['mmsi']);
//         // Store the MMSI to focus on after data is loaded
//         this.pendingVesselFocus = params['mmsi'];
//       }
//     });

//     // Load vessel data
//     this.loadData();

//     // Set up periodic data refresh
//     const timerSub = timer(this.refreshInterval, this.refreshInterval).subscribe(() => {
//       this.refreshData();
//     });

//     this.subscriptions.add(timerSub);
//   }

//   ngAfterViewInit(): void {
//     this.initMap();
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.unsubscribe();
//     if (this.map) {
//       this.map.remove();
//     }
//   }

//   initMap(): void {
//     // Custom map initialization with premium styling
//     this.map = L.map('map', {
//       zoomControl: true,
//       zoomAnimation: true,
//       markerZoomAnimation: true,
//       fadeAnimation: true,
//       maxBounds: [[-90, -180], [90, 180]], // Set map bounds to world limits
//       maxBoundsViscosity: 1.0 // Keep map within bounds
//     }).setView([0, 0], 3);

//     // Premium map tiles with retina support
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 19,
//       minZoom: 3,
//       attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       className: 'premium-map-tiles'
//     }).addTo(this.map);

//     this.vesselMarkers.addTo(this.map);

//     // Add scale control with metric and imperial units
//     L.control.scale({
//       position: 'bottomright',
//       imperial: true,
//       metric: true
//     }).addTo(this.map);

//     // Ensure map resizes properly when window size changes
//     window.addEventListener('resize', () => {
//       this.map.invalidateSize();
//     });
//   }

//   // loadData(): void {
//   //   this.isLoading = true;

//   //   forkJoin({
//   //     vessels: this.vesselService.getVessels()
//   //   }).subscribe({
//   //     next: data => {
//   //       this.vessels = data.vessels;
//   //       this.addVesselsToMap();
//   //       this.centerMapOnData();
//   //       this.isLoading = false;
//   //     },
//   //     error: err => {
//   //       console.error('Error loading data:', err);
//   //       this.isLoading = false;
//   //     }
//   //   });
//   // }
//   loadData(): void {
//     this.isLoading = true;

//     forkJoin({
//       vessels: this.vesselService.getVessels()
//     }).subscribe({
//       next: data => {
//         this.vessels = data.vessels;
//         this.addVesselsToMap();
//         this.centerMapOnData();
//         this.isLoading = false;

//         // Check if we need to focus on a specific vessel
//         if (this.pendingVesselFocus) {
//           console.log('Looking for vessel with MMSI:', this.pendingVesselFocus);
//           const vesselToFocus = this.vessels.find(v => v.mmsi === this.pendingVesselFocus);
//           if (vesselToFocus) {
//             console.log('Found vessel to focus:', vesselToFocus.name);
//             // Small delay to ensure map is fully loaded
//             setTimeout(() => {
//               this.selectVessel(vesselToFocus);
//             }, 500);
//           } else {
//             console.log('Vessel with MMSI', this.pendingVesselFocus, 'not found');
//           }
//           // Clear the pending focus request
//           this.pendingVesselFocus = null;
//         }
//       },
//       error: err => {
//         console.error('Error loading data:', err);
//         this.isLoading = false;
//         this.pendingVesselFocus = null; // Clear on error too
//       }
//     });
//   }

//   // refreshData(): void {
//   //   // Silent refresh without showing loading indicator
//   //   this.vesselService.getVessels().subscribe({
//   //     next: vessels => {
//   //       this.vessels = vessels;
//   //       this.addVesselsToMap();
//   //     },
//   //     error: err => {
//   //       console.error('Error refreshing vessel data:', err);
//   //     }
//   //   });
//   // }
//   refreshData(): void {
//     // Silent refresh without showing loading indicator
//     this.vesselService.getVessels().subscribe({
//       next: vessels => {
//         this.vessels = vessels;
//         this.addVesselsToMap();

//         // Check if we need to focus on a specific vessel (in case it wasn't available initially)
//         if (this.pendingVesselFocus) {
//           const vesselToFocus = this.vessels.find(v => v.mmsi === this.pendingVesselFocus);
//           if (vesselToFocus) {
//             setTimeout(() => {
//               this.selectVessel(vesselToFocus);
//             }, 500);
//             this.pendingVesselFocus = null;
//           }
//         }
//       },
//       error: err => {
//         console.error('Error refreshing vessel data:', err);
//         this.pendingVesselFocus = null; // Clear on error
//       }
//     });
//   }

//   addVesselsToMap(): void {
//     this.vesselMarkers.clearLayers();

//     this.vessels.forEach(vessel => {
//       const iconUrl = this.getVesselIconByType(vessel);
//       const heading = vessel.last_position?.heading || 0;

//       // Enhanced vessel icon with shadow and better visibility
//       const icon = L.divIcon({
//         className: 'vessel-icon',
//         html: `<img src="${iconUrl}" style="transform: rotate(${heading}deg); width: 8px; height: 18px;" alt="Vessel" />`,
//         iconSize: [8, 18],
//         iconAnchor: [4, 9]
//       });

//       const marker = L.marker(
//         [vessel.last_position.latitude, vessel.last_position.longitude],
//         {
//           icon: icon,
//           title: vessel.name,
//           alt: `Vessel: ${vessel.name}`,
//           riseOnHover: true,
//           riseOffset: 250
//         }
//       ).addTo(this.vesselMarkers);

//       // Enhanced tooltip with more information
//       marker.bindTooltip(`
//         <div class="vessel-tooltip">
//           <strong>${vessel.name}</strong><br>
//           ${vessel.vessel_type || 'Unknown type'}<br>
//           ${vessel.last_position.speed} knots
//         </div>
//       `, {
//         direction: 'top',
//         offset: [0, -10],
//         opacity: 0.9
//       });

//       marker.on('click', () => this.selectVessel(vessel));
//     });
//   }

//   centerMapOnData(): void {
//     const allPoints: L.LatLngExpression[] = [];

//     this.vessels.forEach(v => {
//       if (v.last_position.latitude && v.last_position.longitude) {
//         allPoints.push([v.last_position.latitude, v.last_position.longitude]);
//       }
//     });

//     if (allPoints.length > 0) {
//       const bounds = L.latLngBounds(allPoints);
//       this.map.fitBounds(bounds, {
//         padding: [50, 50],
//         maxZoom: 10,
//         animate: true,
//         duration: 1
//       });

//       // Store the original bounds to return to later
//       this.originalMapBounds = bounds;
//     }
//   }

//   getVesselIconByType(vessel: Vessel): string {
//     // Assign icon based on vessel type if available
//     if (!vessel.vessel_type) {
//       return this.getRandomVesselIconUrl();
//     }

//     const type = vessel.vessel_type.toLowerCase();

//     if (type.includes('cargo') || type.includes('container')) {
//       return this.vesselIconUrls[0]; // Red
//     } else if (type.includes('passenger') || type.includes('cruise')) {
//       return this.vesselIconUrls[1]; // Blue
//     } else if (type.includes('tanker') || type.includes('oil')) {
//       return this.vesselIconUrls[2]; // Green
//     }

//     return this.getRandomVesselIconUrl();
//   }

//   getRandomVesselIconUrl(): string {
//     const index = Math.floor(Math.random() * this.vesselIconUrls.length);
//     return this.vesselIconUrls[index];
//   }

//   selectVessel(vessel: Vessel): void {
//     this.clearSelection(false); // Clear selection without resetting map view
//     this.selectedVessel = vessel;

//     // Center map on selected vessel with animation
//     if (vessel.last_position) {
//       this.map.flyTo(
//         [vessel.last_position.latitude, vessel.last_position.longitude],
//         Math.max(this.map.getZoom(), 9),
//         {
//           duration: 0.8,
//           easeLinearity: 0.5
//         }
//       );
//     }
//   }

//   clearSelection(resetMapView: boolean = true): void {
//     this.selectedVessel = null;

//     // Zoom back to original map view if requested and original bounds exist
//     if (resetMapView && this.originalMapBounds) {
//       this.map.flyToBounds(this.originalMapBounds, {
//         padding: [50, 50],
//         maxZoom: 10,
//         animate: true,
//         duration: 0.8
//       });
//     }
//   }

//   toggleLayer(layer: string): void {
//     if (layer === 'vessels') {
//       this.showVessels = !this.showVessels;
//       this.showVessels ? this.vesselMarkers.addTo(this.map) : this.vesselMarkers.removeFrom(this.map);
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
//     return new Date(timestamp).toLocaleString(undefined, {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   }
// }

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { VesselService } from '../../services/vessel.service';
import { LighthouseService } from '../../services/lighthouse.service';
import { Vessel } from '../../models/vessel.model';
import { Lighthouse } from '../../models/lighthouse.model';
import { forkJoin, Subscription, timer } from 'rxjs';
import { AreaCoordinatesService } from '../../shared/area-coordinates.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map!: L.Map;
  vessels: Vessel[] = [];
  lighthouses: Lighthouse[] = [];
  vesselMarkers = L.layerGroup();
  lighthouseMarkers = L.layerGroup();

  selectedVessel: Vessel | null = null;
  selectedLighthouse: Lighthouse | null = null;
  showVessels = true;
  showLighthouses = true;
  isLoading = true;

  // Original map bounds to return to when clearing selection
  private originalMapBounds: L.LatLngBounds | null = null;

  // Custom vessel icons with improved styling
  vesselIconUrls = [
    'assets/vessel-icon-red.png',
    'assets/vessel-icon-blue.png',
    'assets/vessel-icon-green.png',
  ];

  private subscriptions: Subscription = new Subscription();
  private refreshInterval = 60000; // 60 seconds
  private pendingVesselFocus: string | null = null; // Store pending vessel MMSI to focus on
  private pendingLighthouseFocus: number | null = null; // Store pending lighthouse ID to focus on

  constructor(
    private vesselService: VesselService,
    private lighthouseService: LighthouseService,
    private areaCoordService: AreaCoordinatesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for route parameters first
    this.route.queryParams.subscribe((params) => {
      if (params['mmsi'] && params['focus'] === 'true') {
        console.log(
          'Received request to focus on vessel with MMSI:',
          params['mmsi']
        );
        // Store the MMSI to focus on after data is loaded
        this.pendingVesselFocus = params['mmsi'];
      }

      // Check for lighthouse parameter
      if (params['lighthouseId']) {
        console.log(
          'Received request to focus on lighthouse with ID:',
          params['lighthouseId']
        );
        this.pendingLighthouseFocus = Number(params['lighthouseId']);
      }
    });

    // Load vessel and lighthouse data
    this.loadData();

    // Set up periodic data refresh
    const timerSub = timer(
      this.refreshInterval,
      this.refreshInterval
    ).subscribe(() => {
      this.refreshData();
    });

    this.subscriptions.add(timerSub);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.map) {
      this.map.remove();
    }
  }

  initMap(): void {
    // Custom map initialization with premium styling
    this.map = L.map('map', {
      zoomControl: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
      fadeAnimation: true,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ], // Set map bounds to world limits
      maxBoundsViscosity: 1.0, // Keep map within bounds
    }).setView([0, 0], 3);

    // Premium map tiles with retina support
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 2,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      className: 'premium-map-tiles',
    }).addTo(this.map);

    this.vesselMarkers.addTo(this.map);
    this.lighthouseMarkers.addTo(this.map);

    // Add scale control with metric and imperial units
    L.control
      .scale({
        position: 'bottomright',
        imperial: true,
        metric: true,
      })
      .addTo(this.map);

    // Ensure map resizes properly when window size changes
    window.addEventListener('resize', () => {
      this.map.invalidateSize();
    });
  }

  loadData(): void {
    this.isLoading = true;

    forkJoin({
      vessels: this.vesselService.getVessels(),
      lighthouses: this.lighthouseService.getLighthouses(1),
    }).subscribe({
      next: (data) => {
        this.vessels = data.vessels;
        this.lighthouses = data.lighthouses.results;
        this.addVesselsToMap();
        this.addLighthousesToMap();
        this.centerMapOnData();
        this.isLoading = false;

        // Check if we need to focus on a specific vessel
        if (this.pendingVesselFocus) {
          console.log('Looking for vessel with MMSI:', this.pendingVesselFocus);
          const vesselToFocus = this.vessels.find(
            (v) => v.mmsi === this.pendingVesselFocus
          );
          if (vesselToFocus) {
            console.log('Found vessel to focus:', vesselToFocus.name);
            // Small delay to ensure map is fully loaded
            setTimeout(() => {
              this.selectVessel(vesselToFocus);
            }, 500);
          } else {
            console.log(
              'Vessel with MMSI',
              this.pendingVesselFocus,
              'not found'
            );
          }
          // Clear the pending focus request
          this.pendingVesselFocus = null;
        }

        // Check if we need to focus on a specific lighthouse
        if (this.pendingLighthouseFocus) {
          console.log(
            'Looking for lighthouse with ID:',
            this.pendingLighthouseFocus
          );
          const lighthouseToFocus = this.lighthouses.find(
            (l) => l.id === this.pendingLighthouseFocus
          );
          if (lighthouseToFocus) {
            console.log('Found lighthouse to focus:', lighthouseToFocus.name);
            // Small delay to ensure map is fully loaded
            setTimeout(() => {
              this.selectLighthouse(lighthouseToFocus);
            }, 500);
          } else {
            console.log(
              'Lighthouse with ID',
              this.pendingLighthouseFocus,
              'not found'
            );
          }
          // Clear the pending focus request
          this.pendingLighthouseFocus = null;
        }
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
        this.pendingVesselFocus = null; // Clear on error too
        this.pendingLighthouseFocus = null; // Clear on error too
      },
    });
  }

  refreshData(): void {
    // Silent refresh without showing loading indicator
    forkJoin({
      vessels: this.vesselService.getVessels(),
      lighthouses: this.lighthouseService.getLighthouses(1),
    }).subscribe({
      next: (data) => {
        this.vessels = data.vessels;
        this.lighthouses = data.lighthouses.results;
        this.addVesselsToMap();
        this.addLighthousesToMap();

        // Check if we need to focus on a specific vessel (in case it wasn't available initially)
        if (this.pendingVesselFocus) {
          const vesselToFocus = this.vessels.find(
            (v) => v.mmsi === this.pendingVesselFocus
          );
          if (vesselToFocus) {
            setTimeout(() => {
              this.selectVessel(vesselToFocus);
            }, 500);
            this.pendingVesselFocus = null;
          }
        }

        // Check if we need to focus on a specific lighthouse
        if (this.pendingLighthouseFocus) {
          const lighthouseToFocus = this.lighthouses.find(
            (l) => l.id === this.pendingLighthouseFocus
          );
          if (lighthouseToFocus) {
            setTimeout(() => {
              this.selectLighthouse(lighthouseToFocus);
            }, 500);
            this.pendingLighthouseFocus = null;
          }
        }
      },
      error: (err) => {
        console.error('Error refreshing data:', err);
        this.pendingVesselFocus = null; // Clear on error
        this.pendingLighthouseFocus = null; // Clear on error
      },
    });
  }

  addVesselsToMap(): void {
    this.vesselMarkers.clearLayers();

    this.vessels.forEach((vessel) => {
      const iconUrl = this.getVesselIconByType(vessel);
      const heading = vessel.last_position?.heading || 0;

      // Enhanced vessel icon with shadow and better visibility
      const icon = L.divIcon({
        className: 'vessel-icon',
        html: `<img src="${iconUrl}" style="transform: rotate(${heading}deg); width: 8px; height: 18px;" alt="Vessel" />`,
        iconSize: [8, 18],
        iconAnchor: [4, 9],
      });

      const marker = L.marker(
        [vessel.last_position.latitude, vessel.last_position.longitude],
        {
          icon: icon,
          title: vessel.name,
          alt: `Vessel: ${vessel.name}`,
          riseOnHover: true,
          riseOffset: 250,
        }
      ).addTo(this.vesselMarkers);

      // Enhanced tooltip with more information
      marker.bindTooltip(
        `
        <div class="vessel-tooltip">
          <strong>${vessel.name}</strong><br>
          ${vessel.vessel_type || 'Unknown type'}<br>
          ${vessel.last_position.speed} knots
        </div>
      `,
        {
          direction: 'top',
          offset: [0, -10],
          opacity: 0.9,
        }
      );

      marker.on('click', () => this.selectVessel(vessel));
    });
  }

  addLighthousesToMap(): void {
    this.lighthouseMarkers.clearLayers();

    this.lighthouses.forEach((lighthouse) => {
      // Create a custom lighthouse icon
      // const icon = L.divIcon({
      //   className: 'lighthouse-icon',
      //   html: `<div style="background-color: #fb8c00; border: 2px solid #fff; border-radius: 50%; width: 10px; height: 10px; box-shadow: 0 0 8px #fb8c00;"></div>`,
      //   iconSize: [10, 10],
      //   iconAnchor: [5, 5]
      // });
      const icon = L.icon({
        iconUrl: 'assets/lighthouse-icon.png',
        iconSize: [30, 20], // adjust size as needed
        iconAnchor: [12.5, 12.5], // center the icon (half of width/height)
      });

      const marker = L.marker([lighthouse.latitude, lighthouse.longitude], {
        icon: icon,
        title: lighthouse.name,
        alt: `Lighthouse: ${lighthouse.name}`,
        riseOnHover: true,
        riseOffset: 250,
      }).addTo(this.lighthouseMarkers);

      // Bind tooltip with lighthouse name
      marker.bindTooltip(
        `
        <div class="lighthouse-tooltip">
          <strong>${lighthouse.name}</strong>
        </div>
      `,
        {
          direction: 'top',
          offset: [0, -5],
          opacity: 0.9,
        }
      );

      marker.on('click', () => this.selectLighthouse(lighthouse));
    });
  }

  centerMapOnData(): void {
    const allPoints: L.LatLngExpression[] = [];

    this.vessels.forEach((v) => {
      if (v.last_position.latitude && v.last_position.longitude) {
        allPoints.push([v.last_position.latitude, v.last_position.longitude]);
      }
    });

    this.lighthouses.forEach((l) => {
      if (l.latitude && l.longitude) {
        allPoints.push([l.latitude, l.longitude]);
      }
    });

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 10,
        animate: true,
        duration: 1,
      });

      // Store the original bounds to return to later
      this.originalMapBounds = bounds;
    }
  }

  getVesselIconByType(vessel: Vessel): string {
    // Assign icon based on vessel type if available
    if (!vessel.vessel_type) {
      return this.getRandomVesselIconUrl();
    }

    const type = vessel.vessel_type.toLowerCase();

    if (type.includes('cargo') || type.includes('container')) {
      return this.vesselIconUrls[0]; // Red
    } else if (type.includes('passenger') || type.includes('cruise')) {
      return this.vesselIconUrls[1]; // Blue
    } else if (type.includes('tanker') || type.includes('oil')) {
      return this.vesselIconUrls[2]; // Green
    }

    return this.getRandomVesselIconUrl();
  }

  getRandomVesselIconUrl(): string {
    const index = Math.floor(Math.random() * this.vesselIconUrls.length);
    return this.vesselIconUrls[index];
  }

  selectVessel(vessel: Vessel): void {
    this.clearSelection(false); // Clear selection without resetting map view
    this.selectedVessel = vessel;
    this.selectedLighthouse = null;

    // Center map on selected vessel with animation
    if (vessel.last_position) {
      this.map.flyTo(
        [vessel.last_position.latitude, vessel.last_position.longitude],
        Math.max(this.map.getZoom(), 9),
        {
          duration: 0.8,
          easeLinearity: 0.5,
        }
      );
    }
  }

  selectLighthouse(lighthouse: Lighthouse): void {
    this.clearSelection(false); // Clear selection without resetting map view
    this.selectedLighthouse = lighthouse;
    this.selectedVessel = null;

    // Center map on selected lighthouse with animation
    this.map.flyTo(
      [lighthouse.latitude, lighthouse.longitude],
      Math.max(this.map.getZoom(), 12),
      {
        duration: 0.8,
        easeLinearity: 0.5,
      }
    );
  }

  clearSelection(resetMapView: boolean = true): void {
    this.selectedVessel = null;
    this.selectedLighthouse = null;

    // Zoom back to original map view if requested and original bounds exist
    if (resetMapView && this.originalMapBounds) {
      this.map.flyToBounds(this.originalMapBounds, {
        padding: [50, 50],
        maxZoom: 10,
        animate: true,
        duration: 0.8,
      });
    }
  }

  toggleLayer(layer: string): void {
    if (layer === 'vessels') {
      this.showVessels = !this.showVessels;
      this.showVessels
        ? this.vesselMarkers.addTo(this.map)
        : this.vesselMarkers.removeFrom(this.map);
    } else if (layer === 'lighthouses') {
      this.showLighthouses = !this.showLighthouses;
      this.showLighthouses
        ? this.lighthouseMarkers.addTo(this.map)
        : this.lighthouseMarkers.removeFrom(this.map);
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
      '15': 'Not defined',
    };

    return statusMap[status] || 'Unknown';
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
