// lighthouse-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LighthouseService } from '../../services/lighthouse.service';
import { Lighthouse } from '../../models/lighthouse.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lighthouse-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lighthouse-list.component.html',
  styleUrls: ['./lighthouse-list.component.scss']
})
export class LighthouseListComponent implements OnInit {
  lighthouses: Lighthouse[] = [];
  filteredLighthouses: Lighthouse[] = [];
  searchTerm: string = '';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private lighthouseService: LighthouseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLighthouses();
  }

  loadLighthouses(): void {
    this.lighthouseService.getLighthouses().subscribe(lighthouses => {
      this.lighthouses = lighthouses;
      this.filteredLighthouses = [...lighthouses];
      this.sort(this.sortColumn);
    });
  }

  applyFilters(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    
    this.filteredLighthouses = this.lighthouses.filter(lighthouse => 
      lighthouse.name.toLowerCase().includes(searchTermLower) || 
      lighthouse.country.toLowerCase().includes(searchTermLower) ||
      (lighthouse.year_built !== null && lighthouse.year_built.toString().includes(searchTermLower))
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
    
    this.filteredLighthouses.sort((a: any, b: any) => {
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

  viewOnMap(lighthouse: Lighthouse): void {
    // Navigate to map view and focus on this lighthouse
    this.router.navigate(['/map'], { 
      queryParams: { 
        lighthouseId: lighthouse.id,
        lat: lighthouse.latitude,
        lng: lighthouse.longitude
      } 
    });
  }
}