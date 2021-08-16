import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { DataService } from '../../services/data.service'

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class TopbarComponent implements OnInit {

  @Input() flag:number = 0
  @Output() navback = new EventEmitter<boolean>()

  email = sessionStorage.getItem('email')
  menu_settings_hidden = true

  constructor(private dataservice:DataService) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.dataservice.findData('permission', 
      {'emp_id':sessionStorage.getItem('emp_id'), 'page':'menu_settings'})
      .subscribe((res)=>{
        let data:any = res
        this.menu_settings_hidden = (data.user?.length == 1)? false: true
        if(this.menu_settings_hidden)
          this.navback.emit(true)
      })
  }

  ngOnChanges() {
    if(this.flag!=0){
      this.getData()
    }
  }
}
