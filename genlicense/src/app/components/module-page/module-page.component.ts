import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar'

import { DataService } from '../../services/data.service'

import { Module } from './module'

@Component({
  selector: 'app-module-page',
  templateUrl: './module-page.component.html',
  styleUrls: ['./module-page.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class ModulePageComponent implements OnInit {

  // view data tab variables

  module_data:any = []
  filtered_data:any = []
  edit_mode:boolean[] = []

  page = 1

  sort_id = true
  sort_name = true

  edit_id_exist = false
  edit_name_exist = false

  // add data tab variables

  module_model = new Module()
  edit_model = new Module()

  add_id_exist = false
  add_name_exist = false

  constructor(private dataservice:DataService, private snack_bar:MatSnackBar) { }

  ngOnInit(): void {
    this.dataservice.readData("module").subscribe((res)=>{
      this.module_data = res
      this.filtered_data = this.module_data["module"]
      this.edit_mode = new Array(this.filtered_data.length).fill(false)
    })
  }

  onSubmit(form:NgForm) {
    this.dataservice.writeData("module", this.module_model).subscribe((res)=>{
      this.module_data = res
      if ('module' in this.module_data) {
        this.filtered_data = this.module_data["module"]
        this.edit_mode = new Array(this.filtered_data.length).fill(false)
        
        this.snack_bar.open("Successfully added module!", "Close")

        this.module_model = new Module()
        form.resetForm()
      }
    })
  }

  findModuleDetails(id?:string, name?:string){
    id? this.idExists(id):this.idExists()
    name? this.nameExists(name):this.nameExists()
  }

  nameExists(name?:string){
    if (name) {
      this.dataservice.findData("module", {"module_name": this.edit_model.module_name})
      .toPromise()
      .then((res)=>{
        let data:any = res
        this.edit_name_exist = data.module?.length > 0 && data.module[0].module_name != name
      })
    } else {
      this.dataservice.findData("module", {"module_name": this.module_model.module_name})
      .toPromise()
      .then((res)=>{
        let data:any = res
        this.add_name_exist = data.module?.length > 0
      })
    }
  }

  idExists(id?:string){
    if (id) {
      this.dataservice.findData("module", {"module_id": this.edit_model.module_id})
      .toPromise()
      .then((res)=>{
        let data:any = res
        this.edit_id_exist = data.module?.length > 0 && data.module[0].module_id != id
      })
    } else {
      this.dataservice.findData("module", {"module_id": this.module_model.module_id})
      .toPromise()
      .then((res)=>{
        let data:any = res
        this.add_id_exist = data.module?.length > 0
      })
    }
  }

  onInput(event:any){
    this.filtered_data = this.module_data["module"].filter((item: any) => {
      return item.module_name.toLowerCase().includes(event.target.value.toLowerCase()) || 
        item.module_id.toLowerCase().includes(event.target.value.toLowerCase())
    })
    this.edit_mode = new Array(this.filtered_data.length).fill(false)
  }

  tabSize(event:any){
    this.page = event;
  }  

  onEdit(i:any, data:any) {
    this.edit_mode = new Array(this.filtered_data.length).fill(false)
    this.edit_mode[i] = true

    this.edit_model = new Module(data.module_id, data.module_name, data.description)
  }

  onSave(i:any, key:any) {
    this.edit_mode = new Array(this.filtered_data.length).fill(false)

    this.filtered_data[i] = this.edit_model

    this.dataservice.editData("module", {"key":key, "value":this.edit_model}).subscribe((res)=>{
        this.module_data = res
        if ('module' in this.module_data) {
          this.filtered_data = this.module_data["module"]
          this.edit_mode = new Array(this.filtered_data.length).fill(false)
          this.snack_bar.open("Successfully edited module!", "Close")
        }
    })
  }

  onCancel() {
    this.edit_mode = new Array(this.filtered_data.length).fill(false)
  }

  onDelete(id:any) {
    if(confirm("Are you sure to delete this module?")) {
      this.dataservice.deleteData("module", {"module_id":id}).subscribe((res)=>{
        this.module_data = res
        if ('module' in this.module_data) {
          this.filtered_data = this.module_data["module"]
          this.edit_mode = new Array(this.filtered_data.length).fill(false)
          this.snack_bar.open("Successfully deleted module!", "Close")
        }
      })
    }
  }

  sort(col:string) {
    if(col == 'ID'){
      this.sort_id?
      this.filtered_data.sort((a:any,b:any) => a.module_id - b.module_id):
      this.filtered_data.sort((a:any,b:any) => b.module_id - a.module_id)
      this.sort_id = !this.sort_id
    }
    if(col == 'Name'){
      this.sort_name?
      this.filtered_data.sort((a:any,b:any) => (a.module_name < b.module_name) ? 1 : ((b.module_name < a.module_name) ? -1 : 0)):
      this.filtered_data.sort((a:any,b:any) => (a.module_name > b.module_name) ? 1 : ((b.module_name > a.module_name) ? -1 : 0))
      this.sort_name = !this.sort_name
    }
  }
}
