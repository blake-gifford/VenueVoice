import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = 'https://api.spotify.com/v1/artists';
  headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  body = 'grant_type=client_credentials&client_id=a3f4bb406d9b4981a349e0687728ae0c&client_secret=440dd141316c48e19f2331c817b11da4';


  constructor(private http: HttpClient) { }

  // getAccessToken() {
  //   return this.http.post<any>('https://accounts.spotify.com/api/token', this.body, { headers: this.headers })
  // }

  // constructor(private router: Router) { }

  // initiateSpotifyOAuth() {
  //   const authUrl = 'https://accounts.spotify.com/authorize' +
  //     `?client_id=a3f4bb406d9b4981a349e0687728ae0c` +
  //     `&redirect_uri=http://localhost:4200/callback` +
  //     `&scope=user-read-private user-read-email` +
  //     `&response_type=code`; // Use "code" for Authorization Code flow

  //   window.location.href = authUrl; // Redirect the user to Spotify for authentication
  // }

  // getArtists(bearer: string) {
  //   return this.http.get<any>(this.baseUrl);
  // }
}
