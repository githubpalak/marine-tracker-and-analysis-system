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
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private lighthouseService: LighthouseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLighthouses();
  }

  loadLighthouses(): void {
    this.lighthouseService.getLighthouses(this.currentPage).subscribe({
      next: (response) => {
        this.lighthouses = response.results;
        this.filteredLighthouses = [...response.results];
        this.totalItems = response.count;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.sort(this.sortColumn);
      },
      error: (error) => {
        console.error('Error fetching lighthouses:', error);
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim() === '') {
      // If search term is empty, just load normal paginated data
      this.loadLighthouses();
      return;
    }

    this.lighthouseService.searchLighthouses(this.searchTerm).subscribe({
      next: (lighthouses) => {
        this.filteredLighthouses = lighthouses;
        this.sort(this.sortColumn);
      },
      error: (error) => {
        console.error('Error searching lighthouses:', error);
      }
    });
  }

  applyFilters(): void {
    // Improve search performance by increasing debounce time
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.search();
    }, 500); // Increased from 300ms to 500ms for better performance
  }

  private searchTimeout: any;

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
        lng: lighthouse.longitude,
        focus: 'true'
      } 
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.loadLighthouses();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // If total pages are less than or equal to maxVisiblePages, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page, last page, current page, and pages around current
      const firstPage = 1;
      const lastPage = this.totalPages;
      
      // Add current page and pages around it
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Adjust start and end to always show maxVisiblePages - 2 pages
      const totalMiddlePages = maxVisiblePages - 2; // Minus first and last page
      
      if (endPage - startPage + 1 < totalMiddlePages) {
        if (startPage === 2) {
          endPage = Math.min(lastPage - 1, startPage + totalMiddlePages - 1);
        } else if (endPage === lastPage - 1) {
          startPage = Math.max(2, endPage - totalMiddlePages + 1);
        }
      }
      
      // Add first page
      pages.push(firstPage);
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < lastPage - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Add last page
      pages.push(lastPage);
    }
    
    return pages;
  }
}