// port-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortService } from '../../services/port.service';
import { Port } from '../../models/port.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-port-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './port-list.component.html',
  styleUrls: ['./port-list.component.scss']
})
export class PortListComponent implements OnInit {
  ports: Port[] = [];
  filteredPorts: Port[] = [];
  searchTerm: string = '';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private portService: PortService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPorts();
  }

  loadPorts(): void {
    this.portService.getPorts().subscribe(ports => {
      this.ports = ports;
      this.filteredPorts = [...ports];
      this.sort(this.sortColumn);
    });
  }

  applyFilters(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    
    this.filteredPorts = this.ports.filter(port => 
      port.name.toLowerCase().includes(searchTermLower) || 
      port.country.toLowerCase().includes(searchTermLower) ||
      port.size.toLowerCase().includes(searchTermLower) ||
      port.un_locode.toLowerCase().includes(searchTermLower)
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
    
    this.filteredPorts.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];
      
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

  viewOnMap(port: Port): void {
    // Navigate to map view and focus on this port
    this.router.navigate(['/map'], { 
      queryParams: { 
        portId: port.id,
        lat: port.latitude,
        lng: port.longitude
      } 
    });
  }
}