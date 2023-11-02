import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  baseUrl = 'https://api.spotify.com/v1/artists';
  // headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  // body = 'grant_type=client_credentials&client_id=a3f4bb406d9b4981a349e0687728ae0c&client_secret=440dd141316c48e19f2331c817b11da4';


  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.getAccessToken();
  }

  getAccessToken() {
    //   return this.http.post<any>('https://accounts.spotify.com/api/token', this.body, { headers: this.headers })
    this.dashboardService.getAccessToken().subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  getArtists() {
    // return this.http.get<any>(this.baseUrl);
  }

  search() {
    // search for artists and add a location
    // dropdown location
    // this hopfully fixes it
  }
}
// https://api.spotify.com/v1/artists