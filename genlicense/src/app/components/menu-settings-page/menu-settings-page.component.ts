import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Permission, Hidden, employee } from './settings'

const SETTINGS = ['site', 'module', 'site_module', 'generate_file', 'download_file', 'menu_settings']

const SETTING_NAMES = [
  'Site', 'Module', 'Site-Module', 'Generate File', 'Download File', 'Menu Settings'
]

@Component({
  selector: 'app-menu-settings-page',
  templateUrl: './menu-settings-page.component.html',
  styleUrls: ['./menu-settings-page.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class MenuSettingsPageComponent implements OnInit {

  menus = SETTINGS
  menu_names = SETTING_NAMES
  users_data:employee[] = []
  filtered_data:employee[] = []
  depts_data:string[] = []
  temp_data:Permission = new Permission()
  db_data:Permission = new Permission()
  save_hidden:Hidden = new Hidden
  delete_data:Permission = new Permission()

  search_input:string =''
  sidebar_flag = 0
  topbar_flag = 0

  constructor(private dataservice:DataService, private snack_bar:MatSnackBar,
              private router:Router) {
    this.getData()
  }

  ngOnInit(): void {

  }

  async getData() {
    this.dataservice.readData('user').subscribe((res)=>{
      this.mapData(res)
    })
    this.dataservice.readData('permission').subscribe((res)=>{
      let data:any = res
      data.user.forEach((page:any) => {
        let key: keyof Permission = page._id as keyof Permission
        page.permission.forEach((emp_id:any) => {
          this.users_data.forEach((item:employee)=>{
            if (item.emp_id == emp_id)
              this.db_data[key].push(item)
          })
        })
      })
    })
  }

  async mapData(data:any) {
    this.users_data = await this.mapUser(data)
    this.filtered_data = this.users_data
    this.mapDepartment()
  }

  mapUser(data:any) {
    return data.user.map((item:any)=>{
      return {
        "emp_id": item[0],
        "first_name": item[1],
        "last_name": item[2],
        "department_id": item[3],
        "department_name": item[4]
      }
    })
  }

  mapDepartment() {
    this.depts_data = []
    this.filtered_data.forEach((e:any) => {
      if(!this.depts_data.includes(e.department_name))
        this.depts_data.push(e.department_name)
    })
  }

  addItem(emp:employee, menu:string){
    let key: keyof Permission = menu as keyof Permission
    if(!this.temp_data[key].includes(emp) && !this.db_data[key].includes(emp))
      this.temp_data[key].push(emp)
    
    this.snack_bar.open("You have added the user! Click 'Save' button to save the change!", "Close")
    this.save_hidden[key] = false
  }

  deleteItem(emp:employee, menu:string){
    let key: keyof Permission = menu as keyof Permission
    
    if(this.temp_data[key].includes(emp))
      this.temp_data[key].splice(this.temp_data[key].indexOf(emp), 1)
    if(this.db_data[key].includes(emp)){
      this.db_data[key].splice(this.db_data[key].indexOf(emp), 1)
      this.delete_data[key].push(emp)
    }

    this.snack_bar.open("You have deleted the user! Click 'Save' button to save the change!", "Close")
    this.save_hidden[key] = false
  }

  getSaveHidden(menu:string):boolean{
    let key: keyof Permission = menu as keyof Permission
    return this.save_hidden[key]
  }

  onSubmit(menu:string){
    let key: keyof Permission = menu as keyof Permission
    this.save_hidden[key] = true

    this.dataservice.writeData('permission', {"insert":this.temp_data[key], "delete":this.delete_data[key], "key":menu}).subscribe((res)=>{
      
      this.temp_data = new Permission()
      this.delete_data = new Permission()
      this.db_data = new Permission()

      let data:any = res
      data.user.forEach((page:any) => {
        let key: keyof Permission = page._id as keyof Permission
        page.permission.forEach((emp_id:any) => {
          this.users_data.forEach((item:employee)=>{
            if (item.emp_id == emp_id)
              this.db_data[key].push(item)
          })
        })
      })
    })
    this.sidebar_flag++
    this.topbar_flag++
  }

  async onSearch() {
    this.filtered_data = await this.users_data.filter((item:any) => {
      return item.first_name.includes(this.search_input) || item.last_name.includes(this.search_input)
    })
    this.mapDepartment()
  }

  goBack(){
    this.router.navigate(['/dashboard'])
  }
}
