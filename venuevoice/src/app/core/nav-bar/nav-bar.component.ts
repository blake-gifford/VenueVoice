import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { sha256 } from 'js-sha256'; // You may need to install this library or another to perform SHA-256 hashing
import { base64url } from 'rfc4648';
import { AuthServiceService } from 'src/app/auth-service.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  topTracks: any;

  constructor(private authService: AuthServiceService) { }

  ngOnInit(): void {
    this.authService.getUserTopTracks()
      .then(tracks => {
        this.topTracks = tracks;
        console.log(this.topTracks);
      })
      .catch(error => {
        console.error('Error fetching top tracks:', error);
      });
  }

  login() {
    this.authService.initiateAuthFlow();
    console.log("Login");
  }

}