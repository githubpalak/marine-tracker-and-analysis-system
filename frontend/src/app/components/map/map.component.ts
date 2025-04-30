// map.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { VesselService } from '../../services/vessel.service';
import { PortService } from '../../services/port.service';
import { LighthouseService } from '../../services/lighthouse.service';
import { Vessel } from '../../models/vessel.model';
import { Port } from '../../models/port.model';
import { Lighthouse } from '../../models/lighthouse.model';
import { forkJoin } from 'rxjs';

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
  ports: Port[] = [];
  lighthouses: Lighthouse[] = [];
  
  vesselMarkers: L.LayerGroup = L.layerGroup();
  portMarkers: L.LayerGroup = L.layerGroup();
  lighthouseMarkers: L.LayerGroup = L.layerGroup();
  
  selectedVessel: Vessel | null = null;
  selectedPort: Port | null = null;
  selectedLighthouse: Lighthouse | null = null;
  
  showVessels = true;
  showPorts = true;
  showLighthouses = true;
  
  vesselIcon = L.icon({
    iconUrl: 'assets/vessel-icon.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  
  portIcon = L.icon({
    iconUrl: 'assets/port-icon.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  
  lighthouseIcon = L.icon({
    iconUrl: 'assets/lighthouse-icon.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  constructor(
    private vesselService: VesselService,
    private portService: PortService,
    private lighthouseService: LighthouseService
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
    this.portMarkers.addTo(this.map);
    this.lighthouseMarkers.addTo(this.map);
  }

  loadData(): void {
    forkJoin({
      vessels: this.vesselService.getVessels(),
      ports: this.portService.getPorts(),
      lighthouses: this.lighthouseService.getLighthouses()
    }).subscribe(data => {
      this.vessels = data.vessels;
      this.ports = data.ports;
      this.lighthouses = data.lighthouses;
      
      this.addVesselsToMap();
      this.addPortsToMap();
      this.addLighthousesToMap();
      
      // Center map on the data points
      this.centerMapOnData();
    });
  }

  addVesselsToMap(): void {
    this.vesselMarkers.clearLayers();
    
    this.vessels.forEach(vessel => {
      const marker = L.marker(
        [vessel.last_position.latitude, vessel.last_position.longitude], 
        { icon: this.vesselIcon }
      ).addTo(this.vesselMarkers);
      
      marker.bindTooltip(vessel.name);
      marker.on('click', () => {
        this.selectVessel(vessel);
      });
    });
  }

  addPortsToMap(): void {
    this.portMarkers.clearLayers();
    
    this.ports.forEach(port => {
      const marker = L.marker(
        [port.latitude, port.longitude], 
        { icon: this.portIcon }
      ).addTo(this.portMarkers);
      
      marker.bindTooltip(port.name);
      marker.on('click', () => {
        this.selectPort(port);
      });
    });
  }

  addLighthousesToMap(): void {
    this.lighthouseMarkers.clearLayers();
    
    this.lighthouses.forEach(lighthouse => {
      const marker = L.marker(
        [lighthouse.latitude, lighthouse.longitude], 
        { icon: this.lighthouseIcon }
      ).addTo(this.lighthouseMarkers);
      
      marker.bindTooltip(lighthouse.name);
      marker.on('click', () => {
        this.selectLighthouse(lighthouse);
      });
    });
  }

  centerMapOnData(): void {
    const allPoints: L.LatLngExpression[] = [];
    
    this.vessels.forEach(vessel => {
      allPoints.push([vessel.last_position.latitude, vessel.last_position.longitude]);
    });
    
    this.ports.forEach(port => {
      allPoints.push([port.latitude, port.longitude]);
    });
    
    this.lighthouses.forEach(lighthouse => {
      allPoints.push([lighthouse.latitude, lighthouse.longitude]);
    });
    
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      this.map.fitBounds(bounds);
    }
  }

  selectVessel(vessel: Vessel): void {
    this.clearSelection();
    this.selectedVessel = vessel;
  }

  selectPort(port: Port): void {
    this.clearSelection();
    this.selectedPort = port;
  }

  selectLighthouse(lighthouse: Lighthouse): void {
    this.clearSelection();
    this.selectedLighthouse = lighthouse;
  }

  clearSelection(): void {
    this.selectedVessel = null;
    this.selectedPort = null;
    this.selectedLighthouse = null;
  }

  toggleLayer(layer: string): void {
    switch (layer) {
      case 'vessels':
        this.showVessels = !this.showVessels;
        if (this.showVessels) {
          this.vesselMarkers.addTo(this.map);
        } else {
          this.vesselMarkers.removeFrom(this.map);
        }
        break;
      case 'ports':
        this.showPorts = !this.showPorts;
        if (this.showPorts) {
          this.portMarkers.addTo(this.map);
        } else {
          this.portMarkers.removeFrom(this.map);
        }
        break;
      case 'lighthouses':
        this.showLighthouses = !this.showLighthouses;
        if (this.showLighthouses) {
          this.lighthouseMarkers.addTo(this.map);
        } else {
          this.lighthouseMarkers.removeFrom(this.map);
        }
        break;
    }
  }

  getVesselStatus(status: string): string {
    const statusMap: {[key: string]: string} = {
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
      '11': 'Power-driven vessel towing astern',
      '12': 'Power-driven vessel pushing ahead or towing alongside',
      '13': 'Reserved for future use',
      '14': 'AIS-SART (active)',
      '15': 'Not defined'
    };
    
    return statusMap[status] || 'Unknown';
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}