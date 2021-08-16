import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './services/data.service';
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../assets/vendor/fontawesome-free/css/all.min.css', '../assets/css/sb-admin-2.min.css']
})
export class AppComponent implements OnInit {
  title = 'genlicense';

  constructor(private route: ActivatedRoute, private dataservice: DataService,
              private router: Router) {}

  ngOnInit() {
    this.route.queryParams
    .pipe(filter((p: any) => p.email))
    .subscribe(params => {
        sessionStorage.clear()
        sessionStorage.setItem('email', params.email)
        this.router.navigate(['/dashboard'])
    });
  }
}
