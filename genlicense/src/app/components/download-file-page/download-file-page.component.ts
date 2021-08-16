import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute } from '@angular/router'

import { DataService } from '../../services/data.service'

const environments = [
  'PROD', 'UAT', 'SIT', 'DR', 'DEV', 'TEST'
]

@Component({
  selector: 'app-download-file-page',
  templateUrl: './download-file-page.component.html',
  styleUrls: ['./download-file-page.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class DownloadFilePageComponent implements OnInit {

  site_options:any = []
  env_options:any = []
  modules:any = []

  site_id:any = ''
  env_id:any = ''
  lic_name:any = ''

  exp_date:any = []

  constructor(private dataservice: DataService, private snack_bar: MatSnackBar,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.dataservice.readData("file").subscribe((res)=>{
      let data:any = res
      this.site_options = data["file"]
      this.route.paramMap.subscribe((params)=>{
        if (params.has("site_id") && params.has("env_id")) // Edit Mode?
          this.editMode(params)
      })
    })
  }

  editMode(params:any) {
    this.site_id = params.get('site_id')
    this.env_id = params.get('env_id')
    
    let env = this.site_options.filter((item:any)=>{
      return item.site_id == params.get('site_id')
    })[0]

    let modules = env.environments.filter((item:any)=>{
      return item.env_id == params.get('env_id')
    })[0]

    this.changeEnv(modules)
  }

  changeSite(event:any){
    this.env_id = ''
    this.modules = []
    this.env_options = event?.environments.sort((a:any, b:any) => {
      return environments.indexOf(a.env_id) - environments.indexOf(b.env_id); // Sort Env Name
    });
  }

  changeEnv(event:any){
    for (let i = 0; i < event?.details.length; i++) {
      if (event.details[i].expired_date != 'Never') {
          this.exp_date[i] = event.details[i].expired_date
          let date = new Date(event.details[i].expired_date) // Change str to Date
          date = new Date ( Date.UTC(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                            date.getHours(),
                            date.getMinutes(),
                            date.getSeconds()
                            )
                          )
          event.details[i].expired_date = date  
      }
      else 
      {
        this.exp_date[i] = "Never"
      }
    }
    this.lic_name = event?.lic_name
    this.modules = event?.details
  }

  makeContent():string {
    let text:string = ''

    for (let i = 0; i<this.modules.length; i++)
    text += ("<"+this.modules[i].module_id+">"+
            this.modules[i].module_name+":1=A"+
            this.modules[i].agent+",S"+
            this.modules[i].supervisor+",M"+
            this.modules[i].manager+",EXP:"+
            this.exp_date[i]+"\n")
    
    return text
  }

  onSubmit() {
      let content = this.makeContent()
      let data = new Blob([content], {type: 'text/plain'});
      let url = window.URL.createObjectURL(data);
 
      let a = document.createElement('a');
      document.body.appendChild(a);
 
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = this.lic_name+".lic";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();   
  }

  onDelete(){
    this.dataservice.deleteData("file", {"site_id": this.site_id, "env_id": this.env_id})
    .subscribe((res)=>{
      let data:any = res
      if ('file' in data) {
      this.site_options = data["file"]
      this.env_options = this.modules = this.exp_date = [] 
      this.site_id = this.env_id = this.lic_name = ''
      this.snack_bar.open("Successfully deleted file!", "Close")
      }
    })
    
  }
}