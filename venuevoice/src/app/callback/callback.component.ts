import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})

export class CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AuthServiceService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('CallbackComponent queryParams:', params);
      if (params['code']) {
        this.authService.handleAuthRedirect(params);
      } else {
        console.error('No authorization code present in the query parameters.');
      }
    });
  }
}


