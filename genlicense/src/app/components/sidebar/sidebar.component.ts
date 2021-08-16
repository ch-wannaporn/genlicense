import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { Menu } from './sidebar'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class SidebarComponent implements OnInit {

  @Input() flag:number = 0
  menu:Menu = new Menu()

  constructor(private dataservice:DataService) { }

  ngOnInit(): void {
    this.getData()    
  }

  getData() {
    this.dataservice.findData('permission', {'emp_id': sessionStorage.getItem('emp_id')})
    .subscribe((res)=>{
      let data:any = res
      this.menu = new Menu()
      data.user.forEach((item:any)=>{
      let key: keyof Menu = item.page
      this.menu[key] = true
    })
    })
  }

  ngOnChanges() {
    if(this.flag!=0){
      this.getData()
    }
  }
}