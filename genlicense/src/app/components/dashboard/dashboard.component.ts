import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { Menu } from '../sidebar/sidebar'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class DashboardComponent implements OnInit {

  menu:Menu = new Menu()

  constructor(private dataservice:DataService) { }

  ngOnInit(): void {
    this.getData()    
  }

  getData() {
    this.dataservice.findData('permission', {'emp_id': sessionStorage.getItem('emp_id')})
    .subscribe((res)=>{
      let data:any = res
      data.user.forEach((item:any)=>{
        let key: keyof Menu = item.page
        this.menu[key] = true
      })
    })
  }
}
