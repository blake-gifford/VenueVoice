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
      console.log('Query Params:', params);
      const code = params['code'];
      if (code) {
        this.authService.handleAuthRedirect(code); // Make sure this matches the method in your AuthService
      }
      // Handle other cases, such as error or state
    });
  }
}


