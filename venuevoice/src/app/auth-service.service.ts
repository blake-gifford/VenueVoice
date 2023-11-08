import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sha256 } from 'js-sha256';
import { base64url } from 'rfc4648';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private clientId: string = 'a3f4bb406d9b4981a349e0687728ae0c';
  private redirectUri: string = 'http://localhost:4200/callback';
  private spotifyAuthUrl: string = 'https://accounts.spotify.com/authorize';
  private tokenEndpoint: string = 'https://accounts.spotify.com/api/token';
  private codeVerifier!: string;
  private codeChallenge!: string;

  constructor(private http: HttpClient) { }

  private async initializePKCE() {
    this.codeVerifier = this.generateRandomString(128);
    console.log('this is the OG CodeVerifier ', this.codeVerifier);
    localStorage.setItem('code_verifier', this.codeVerifier);
    this.codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
  }

  getUserTopTracks(): Promise<any> {
    console.log('Attempting to fetch user top tracks'); // Log before attempting to get the token

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      console.error('Access Token not found!');
      return Promise.reject('Access Token not found');
    }

    console.log('Access Token found, making HTTP request'); // Log after token is confirmed

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    const tracksObservable = this.http.get('https://api.spotify.com/v1/me/top/tracks', { headers });

    return firstValueFrom(tracksObservable)
      .then(response => {
        console.log('Received response from Spotify', response); // Log the response from the HTTP request
        return response;
      })
      .catch(error => {
        console.error('Error during HTTP request', error); // Log any errors during the HTTP request
        return Promise.reject(error);
      });
  }


  async initiateAuthFlow() {
    if (!this.codeChallenge) {
      await this.initializePKCE();
    }

    const authUrl = `${this.spotifyAuthUrl}?` +
      `client_id=${encodeURIComponent(this.clientId)}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${encodeURIComponent(this.codeChallenge)}` + // Ensure this is URL-encoded
      `&scope=${encodeURIComponent('user-read-private user-read-email user-top-read')}`;

    window.location.href = authUrl;
  }

  // Helper method to generate a random string for the code verifier
  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    return new Array(length).fill(null).map(() => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    // Generate SHA256 hash of the code verifier
    const hash = sha256.create();
    hash.update(codeVerifier);
    // Use the digest method to get the hash as a hex string
    const digest = hash.hex();
    // Convert the hex string to a Uint8Array
    const buffer = this.hexToUint8Array(digest);
    // Base64url encode the Uint8Array and remove padding
    const base64Digest = base64url.stringify(buffer).replace(/=*$/, '');
    return base64Digest;
  }



  private hexToUint8Array(hexString: string): Uint8Array {
    return new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  }

  // Method to handle the redirect URI, should be called from the component that handles the redirect
  async handleAuthRedirect(queryParams: any) {
    console.log('handleAuthRedirect called with:', queryParams);
    const authorizationCode = queryParams['code'];
    console.log('Authorization Code:', authorizationCode);
    if (!authorizationCode) {
      console.error('No authorization code present');
      return; // No authorization code present, handle accordingly
    }

    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      console.error('Code verifier not found in localStorage');
      return; // Handle the missing code_verifier appropriately
    }

    // Use the retrieved codeVerifier for the token exchange request
    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('grant_type', 'authorization_code');
    body.set('code', authorizationCode);
    body.set('redirect_uri', this.redirectUri);
    body.set('code_verifier', codeVerifier);

    console.log('this is a TESTTTTTTTTTTT')
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
    console.log('this is the access token  ', localStorage.getItem('spotify_access_token'))
    return localStorage.getItem('spotify_access_token');
  }
}
