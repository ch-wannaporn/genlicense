import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'

import { DataService } from '../../services/data.service' 
import { File, EXP } from './file'

const environments = [
  'PROD', 'UAT', 'SIT', 'DR', 'DEV', 'TEST'
]

@Component({
  selector: 'app-generate-file-page',
  templateUrl: './generate-file-page.component.html',
  styleUrls: ['./generate-file-page.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class GenerateFilePageComponent implements OnInit {

// Data Variables

  site_module_data : any = []
  env_data = environments
  details : any = []

// Form Variables

  site_id = ''
  env_id = ''
  lic_name = ''
  keyword = ''

  files: File[] = []
  expired_date: EXP[] = []

  exp_valid = true

// Edit Flag

  edit_mode = false

  constructor(private dataservice:DataService, private snack_bar:MatSnackBar,
              private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.getData()

    // get params for edit data form
    this.route.paramMap.subscribe((params)=>{
      if (params.has("site_id") && params.has("env_id"))
        this.editMode(params)
    })
  }

  getData() {
    this.dataservice.readData("site-module").subscribe((res)=>{
      this.site_module_data = res
    })
  }

  editMode(params:any) {
    this.edit_mode = true

    let data:any = []

    this.dataservice.readData("file").subscribe((res)=>{
      data = res
      
      let site_edit = data["file"].filter((item:any)=>{
          return item.site_id == params.get('site_id')
      })[0]

      let env_edit = site_edit["environments"].filter((item:any)=>{
        return item.env_id == params.get('env_id')
      })[0]

      this.site_id = params.get('site_id')
      this.env_id = params.get('env_id')
      this.lic_name = env_edit.lic_name
      let modules_edit = this.site_module_data["site-module"].filter((item:any)=>{
        return item.id == params.get('site_id')
      })[0]["details"]

      this.formBuild(modules_edit, env_edit.details)
    })
  }

  onChangeSiteForm(event?:any) {
    if(this.site_id && this.env_id)
    {
      if(this.keyword == '')
        this.lic_name = this.site_id + "_" + this.env_id
      else
        this.lic_name = this.keyword
    }

    this.makeEnvOptions()
    
    if(event)
      this.formBuild(event.details)
  }

  makeEnvOptions(){
    this.dataservice.readData("file").subscribe((res)=>{ // Filter env data 
      let data:any = res
      let env = data.file.filter((item:any)=>{
        return item.site_id == this.site_id
      })[0]?.environments
      this.env_data = environments.filter((item:any)=>{
        for(let i = 0; i<env?.length; i++){
          if(env[i].env_id == item)
            return false
        }
        return true
      })
    })
  }

  onChangeKeyword(event:any) { // If user input keyword -> No auto keyword
    this.keyword = event.target.value
  }

  formBuild(modules:any, data?:any) {
    this.details = []
    this.details = modules

    this.files = []
    this.expired_date = []
    
    if(data){ // Build form for editting data
      for (let i = 0; i<modules.length; i++)
      {
        this.files[i] = new File(this.site_id, modules[i].id, data[i].agent, data[i].supervisor, data[i].manager)
        if (data[i].expired_date == 'Never')
        {
          this.expired_date[i] = new EXP()
        }
        else
        {
          this.expired_date[i] = new EXP(new Date(data[i].expired_date), false)
        }
      }
    }else{ // Build empty form
      for (let i = 0; i<modules.length; i++)
      {
        this.files[i] = new File(this.site_id, modules[i].id)
        this.expired_date[i] = new EXP()
      }
    }
    
  }

  onDateChange() {
    this.exp_valid = this.isExpiredDateValid()
  }

  isExpiredDateValid():boolean { // Validation of Expired Date (Input)
    for (let i = 0; i< this.expired_date.length; i++)
    {
      if (this.expired_date[i].never == false && this.expired_date[i].date == null)
        return false
    }
    return true
  }

  onSubmitDesc() { // Select expired date or never?
    for (let i = 0; i< this.files.length; i++)
    {
      this.files[i].env_id = this.env_id
      this.files[i].lic_name = this.lic_name
      if (this.expired_date[i].never)
      {
        this.files[i].license_expired_date = 'Never'
      } else {
        this.files[i].license_expired_date = this.expired_date[i].date
      }
    }
  }

  onSubmit(form: NgForm) {
      if(this.edit_mode)
      {
        this.onSubmitDesc()
        this.dataservice.writeData("file", this.files).subscribe((res)=>{
          let data:any = res
          if ('file' in data) {
            this.snack_bar.open("Successfully edited file!", "Close")
            this.router.navigate(['/download-file', {site_id: this.site_id, env_id: this.env_id}])
          }
        })
      }
      else
      {
        this.onSubmitDesc()
        this.dataservice.writeData("file", this.files).subscribe((res)=>{
          let data:any = res
          if ('file' in data) {
            this.snack_bar.open("Successfully generated file!", "Close")

            this.details = this.files = this.expired_date = []
            this.site_id = this.env_id = this.lic_name = this.keyword = ''
            this.exp_valid = true

            form.resetForm()
          }
        })
      }     
  }
}