import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  items = []; // Replace with your data source

  constructor() {
    // Fetch or assign data to items here
  }
}
