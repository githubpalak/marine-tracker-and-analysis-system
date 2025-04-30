import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'map', 
    pathMatch: 'full' 
  },
  { 
    path: 'map', 
    loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent),
    title: 'Vessel Map'
  },
  { 
    path: 'vessels', 
    loadComponent: () => import('./components/vessel-list/vessel-list.component').then(m => m.VesselListComponent),
    title: 'Vessel List'
  },
  { 
    path: 'ports', 
    loadComponent: () => import('./components/port-list/port-list.component').then(m => m.PortListComponent),
    title: 'Port List'
  },
  { 
    path: 'lighthouses', 
    loadComponent: () => import('./components/lighthouse-list/lighthouse-list.component').then(m => m.LighthouseListComponent),
    title: 'Lighthouse List'
  },
  { 
    path: 'fleets', 
    loadComponent: () => import('./components/fleet-management/fleet-management.component').then(m => m.FleetManagementComponent),
    title: 'Fleet Management'
  },
  { 
    path: '**', 
    redirectTo: 'map' 
  }
];