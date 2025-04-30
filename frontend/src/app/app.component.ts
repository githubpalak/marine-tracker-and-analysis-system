import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar class="app-navbar"></app-navbar>
      <div class="app-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    
    .app-navbar {
      width: 250px;
      background-color: #263238;
      color: white;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }
    
    .app-content {
      flex: 1;
      overflow: auto;
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'maritime-management-system';
}
