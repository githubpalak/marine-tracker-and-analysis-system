// vessel-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VesselService } from '../../services/vessel.service';
import { Vessel } from '../../models/vessel.model';
import { Router } from '@angular/router';
import { FleetService } from '../../services/fleet.service';

@Component({
  selector: 'app-vessel-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vessel-list.component.html',
  styleUrls: ['./vessel-list.component.scss']
})
export class VesselListComponent implements OnInit {
  vessels: Vessel[] = [];
  filteredVessels: Vessel[] = [];
  searchTerm: string = '';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private vesselService: VesselService,
    private fleetService: FleetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVessels();
  }

  loadVessels(): void {
    this.vesselService.getVessels().subscribe(vessels => {
      this.vessels = vessels;
      this.filteredVessels = [...vessels];
      this.sort(this.sortColumn);
    });
  }

  applyFilters(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    
    this.filteredVessels = this.vessels.filter(vessel => 
      vessel.name.toLowerCase().includes(searchTermLower) || 
      vessel.mmsi.toLowerCase().includes(searchTermLower) ||
      vessel.vessel_type.toLowerCase().includes(searchTermLower) ||
      (vessel.flag && vessel.flag.toLowerCase().includes(searchTermLower))
    );
    
    this.sort(this.sortColumn);
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.filteredVessels.sort((a: any, b: any) => {
      let valueA: any;
      let valueB: any;
      
      // Handle nested properties (like last_position.status)
      if (column.includes('.')) {
        const parts = column.split('.');
        valueA = parts.reduce((obj, key) => obj?.[key], a);
        valueB = parts.reduce((obj, key) => obj?.[key], b);
      } else {
        valueA = a[column];
        valueB = b[column];
      }
      
      // Handle string comparison
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
      }
      
      if (typeof valueB === 'string') {
        valueB = valueB.toLowerCase();
      }
      
      // Handle null/undefined values
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;
      
      // Actual comparison
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // viewOnMap(vessel: Vessel): void {
  //   // Navigate to map view and focus on this vessel
  //   this.router.navigate(['/map'], { 
  //     queryParams: { 
  //       vesselId: vessel.id,
  //       lat: vessel.last_position.latitude,
  //       lng: vessel.last_position.longitude
  //     } 
  //   });
  // }
  viewOnMap(vessel: Vessel): void {
    // Navigate to map view and focus on this vessel
    // We'll use MMSI as it's a unique identifier for vessels
    this.router.navigate(['/map'], { 
      queryParams: { 
        mmsi: vessel.mmsi,
        focus: 'true'
      } 
    });
  }

  addToFleet(vessel: Vessel): void {
    // Implement fleet adding logic or navigate to fleet management
    this.router.navigate(['/fleets'], {
      queryParams: { selectVessel: vessel.id }
    });
  }

  getVesselStatus(status: string): string {
    const statusMap: {[key: string]: string} = {
      '0': 'Under way using engine',
      '1': 'At anchor',
      '2': 'Not under command',
      '3': 'Restricted maneuverability',
      '4': 'Constrained by draught',
      '5': 'Moored',
      '6': 'Aground',
      '7': 'Engaged in fishing',
      '8': 'Under way sailing',
      '9': 'Reserved for future use',
      '10': 'Reserved for future use',
      '11': 'Power-driven vessel towing astern',
      '12': 'Power-driven vessel pushing ahead/towing alongside',
      '13': 'Reserved for future use',
      '14': 'AIS-SART (active)',
      '15': 'Not defined'
    };
    
    return statusMap[status] || 'Unknown';
  }
}