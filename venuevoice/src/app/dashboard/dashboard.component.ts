import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tracks: any;

  constructor(private authService: AuthServiceService) {
    // Fetch or assign data to tracks here
  }

  ngOnInit() {
    // this.authService.initiateAuthFlow();
    //   this.authService.getUserTopTracks().subscribe({
    //     next: data => {
    //       console.log('Top tracks data!!: ', data);
    //       // Handle the data
    //     },
    //     error => {
    //       console.error('Error fetching top tracks:', error);
    //       // Handle the error
    //     })
    // }
    this.authService.getUserTopTracks().subscribe({
      next: response => {
        this.tracks = response.items
        console.log(response.items)
      },
      error: error => console.log('Error fetching top tracks:', error)
    })
  }
}
