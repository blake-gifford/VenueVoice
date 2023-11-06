import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  baseUrl = 'https://api.spotify.com/v1/artists';
  headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  body = 'grant_type=client_credentials&client_id=a3f4bb406d9b4981a349e0687728ae0c&client_secret=440dd141316c48e19f2331c817b11da4';
  token: any = "";

  constructor(
    private http: HttpClient,
    private router: Router) {
  }

  ngOnInit() {

  }


}
// https://api.spotify.com/v1/artists