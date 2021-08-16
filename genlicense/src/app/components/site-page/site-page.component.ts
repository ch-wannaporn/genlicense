import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar'

import { DataService } from '../../services/data.service'

import { Site } from './site'

@Component({
  selector: 'app-site-page',
  templateUrl: './site-page.component.html',
  styleUrls: ['./site-page.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class SitePageComponent implements OnInit {

  // view data tab variables

  site_data: any = []
  filtered_data: any = []
  edit_mode: boolean[] = []

  sort_id = true
  sort_name = true

  page = 1

  edit_id_exist = false
  edit_name_exist = false

  // add data tab variables

  site_model = new Site()
  edit_model = new Site()

  add_id_exist = false
  add_name_exist = false

  constructor(private dataservice: DataService, private snack_bar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataservice.readData("site").subscribe((res) => {
      this.site_data = res
      this.filtered_data = this.site_data["site"]
      this.edit_mode = new Array(this.filtered_data.length).fill(false)
    })
  }

  onSubmit(form: NgForm) {
    this.dataservice.writeData("site", this.site_model).subscribe((res) => {
      this.site_data = res
      if ('site' in this.site_data) {
        this.filtered_data = this.site_data["site"]
        this.edit_mode = new Array(this.filtered_data.length).fill(false)

        this.snack_bar.open("Successfully added site!", "Close")
        this.site_model = new Site()
        form.resetForm()
      }
    })
  }

  findSiteDetails(id?: string, name?: string) {
    id ? this.idExists(id) : this.idExists()
    name ? this.nameExists(name) : this.nameExists()
  }

  nameExists(name?: string) {
    if (name) {
      this.dataservice.findData("site", { "site_name": this.edit_model.site_name })
        .toPromise()
        .then((res) => {
          let data: any = res
          this.edit_name_exist = data.site?.length > 0 && data.site[0].site_name != name
        })
    } else {
      this.dataservice.findData("site", { "site_name": this.site_model.site_name })
        .toPromise()
        .then((res) => {
          let data: any = res
          this.add_name_exist = data.site?.length > 0
        })
    }
  }

  idExists(id?: string) {
    if (id) {
      this.dataservice.findData("site", { "site_id": this.edit_model.site_id })
        .toPromise()
        .then((res) => {
          let data: any = res
          this.edit_id_exist = data.site?.length > 0 && data.site[0].site_id != id
        })
    } else {
      this.dataservice.findData("site", { "site_id": this.site_model.site_id })
        .toPromise()
        .then((res) => {
          let data: any = res
          this.add_id_exist = data.site?.length > 0
        })
    }
  }

  onInput(event: any) {
    this.filtered_data = this.site_data["site"].filter((item: any) => {
      return item.site_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        item.site_id.toLowerCase().includes(event.target.value.toLowerCase())
    })
    this.edit_mode = new Array(this.filtered_data.length).fill(false)
  }

  tabSize(event: any) {
    this.page = event;
  }

  onEdit(i: any, data: any) {
    this.edit_mode = new Array(this.filtered_data.length).fill(false)
    this.edit_mode[i] = true

    this.edit_model = new Site(data.site_id, data.site_name, data.description)
  }

  onSave(i: any, key: any) {
    this.edit_mode = new Array(this.filtered_data.length).fill(false)

    this.filtered_data[i] = this.edit_model

    this.dataservice.editData("site", { "key": key, "value": this.edit_model }).subscribe((res) => {
      this.site_data = res
      if ('site' in this.site_data) {
        this.filtered_data = this.site_data["site"]
        this.edit_mode = new Array(this.filtered_data.length).fill(false)
        this.snack_bar.open("Successfully edited site!", "Close")
      }
    })
  }

  onCancel() {
    this.edit_mode = new Array(this.filtered_data.length).fill(false)
  }

  onDelete(id: any) {
    if (confirm("Are you sure to delete this site?")) {
      this.dataservice.deleteData("site", { "site_id": id }).subscribe((res) => {
        this.site_data = res
        if ('site' in this.site_data) {
          this.filtered_data = this.site_data["site"]
          this.edit_mode = new Array(this.filtered_data.length).fill(false)
          this.snack_bar.open("Successfully deleted site!", "Close")
        }
      })
    }
  }

  sort(col: string) {
    if (col == 'ID') {
      this.sort_id ?
        this.filtered_data.sort((a: any, b: any) => (a.site_id < b.site_id) ? 1 : ((b.site_id < a.site_id) ? -1 : 0)) :
        this.filtered_data.sort((a: any, b: any) => (a.site_id > b.site_id) ? 1 : ((b.site_id > a.site_id) ? -1 : 0))
      this.sort_id = !this.sort_id
    }
    if (col == 'Name') {
      this.sort_name ?
        this.filtered_data.sort((a: any, b: any) => (a.site_name < b.site_name) ? 1 : ((b.site_name < a.site_name) ? -1 : 0)) :
        this.filtered_data.sort((a: any, b: any) => (a.site_name > b.site_name) ? 1 : ((b.site_name > a.site_name) ? -1 : 0))
      this.sort_name = !this.sort_name
    }
  }
}
