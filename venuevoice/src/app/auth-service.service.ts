import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sha256 } from 'js-sha256';
import { base64url } from 'rfc4648';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private clientId: string = 'a3f4bb406d9b4981a349e0687728ae0c';
  private redirectUri: string = 'http://localhost:4200/callback';
  private spotifyAuthUrl: string = 'https://accounts.spotify.com/authorize';
  private tokenEndpoint: string = 'https://accounts.spotify.com/api/token';
  private codeVerifier: string = this.generateRandomString(128);
  private codeChallenge: string = this.generateCodeChallenge(this.codeVerifier);

  constructor(private http: HttpClient) { }

  getUserTopTracks(): Promise<any> {
    const accessToken = this.getAccessToken(); // Implement this method based on how you've stored the access token
    if (!accessToken) {
      console.error('Access Token not found!!!!!!');
      return Promise.reject('Access Token not found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get('https://api.spotify.com/v1/me/top/tracks', { headers }).toPromise();
  }

  async initiateAuthFlow() {
    // Step 1: Create and store the code verifier
    this.codeVerifier = this.generateRandomString(128);
    // Step 2: Create the code challenge
    this.codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

    // Step 3: Redirect to Spotify authorization page
    const authUrl = `${this.spotifyAuthUrl}?client_id=${encodeURIComponent(this.clientId)}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&code_challenge_method=S256&code_challenge=${encodeURIComponent(this.codeChallenge)}&scope=${encodeURIComponent('user-read-private user-read-email')}`;

    window.location.href = authUrl;
  }

  // Helper method to generate a random string for the code verifier
  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    return new Array(length)
      .fill(null)
      .map(() => possible.charAt(Math.floor(Math.random() * possible.length)))
      .join('');
  }

  // Helper method to generate the code challenge from the code verifier
  private generateCodeChallenge(codeVerifier: string): string {
    const hashed = sha256.arrayBuffer(codeVerifier); // sha256 function returns an ArrayBuffer
    const base64Digest = base64url.stringify(new Uint8Array(hashed)); // Use stringify for Uint8Array
    return base64Digest;
  }

  // Method to handle the redirect URI, should be called from the component that handles the redirect
  async handleAuthRedirect(queryParams: any) {
    const authorizationCode = queryParams['code'];
    console.log('Authorization Code:', authorizationCode);
    if (!authorizationCode) {
      console.error('No authorization code present');
      return; // No authorization code present, handle accordingly
    }

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('grant_type', 'authorization_code');
    body.set('code', authorizationCode);
    body.set('redirect_uri', this.redirectUri);
    body.set('code_verifier', this.codeVerifier);

    try {
      const response: any = await this.http.post(this.tokenEndpoint, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).toPromise();

      console.log('Token response received:', response);

      // Here we store the access token in localStorage
      if (response.access_token) {
        console.log('About to set access token:', response.access_token);
        localStorage.setItem('spotify_access_token', response.access_token);
      } else {
        console.error('Access token not found in the response');
      }


      // TODO: You may also want to store the refresh token if you receive one
      localStorage.setItem('spotify_refresh_token', response.refresh_token);

      // TODO: Handle the access token, refresh token, and any other data received
      console.log(response);
    } catch (error) {
      // TODO: Handle errors, such as invalid or expired authorization code
      console.error('Error during token retrieval:', error);
    }
  }

  private getAccessToken(): string | null {
    // Retrieve the access token from wherever you have stored it
    // This could be in local storage, session storage, a service, etc.
    return localStorage.getItem('spotify_access_token');
  }
}
