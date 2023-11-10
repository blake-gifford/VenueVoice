import { Component, OnInit } from '@angular/core';
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
    console.log('this is calling get user top tracks')
    // this.authService.getUserTopTracks()
    //   .then(tracks => {
    //     this.topTracks = tracks;
    //     console.log('this is the tracks ', this.topTracks);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching top tracks:', error);
    //   });
  }

  login() {
    this.authService.initiateAuthFlow();
    console.log("Login");
  }

  // getTopTracks() {
  //   this.authService.getUserTopTracks()
  //     .then(tracks => {
  //       this.topTracks = tracks;
  //       console.log('this is the tracks ', this.topTracks);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching top tracks:', error);
  //     });
  // }

}