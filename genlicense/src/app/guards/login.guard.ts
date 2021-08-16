import { Injectable, OnInit} from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { DataService } from '../services/data.service'

@Injectable({
  providedIn: 'root'
})
 
export class LoginGuard implements OnInit, CanActivateChild {

  constructor(private router: Router, private dataservice: DataService) { }
 
  ngOnInit() { }
 
  async canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<any> {

      let nav:any = await this.navigate(next.url[0]["path"])
      if (nav)
        return true
      else
        this.router.navigate(['/error'])
        
  }

  async navigate(path:any):Promise<boolean> {
    let nav:boolean = false
    switch(path) { 
      case 'dashboard': nav = await this.rootfn().then((res:any)=> {return res})
                        break
      case 'site': nav = await this.pagefn('site').then((res:any)=> {return res})
                    break
      case 'module': nav = await this.pagefn('module').then((res:any)=> {return res})
                      break
      case 'site-module': nav = await this.pagefn('site_module').then((res:any)=> {return res})
                            break
      case 'generate-file': nav = await this.pagefn('generate_file').then((res:any)=> {return res})
                            break
      case 'download-file': nav = await this.pagefn('download_file').then((res:any)=> {return res})
                            break
      case 'menu-settings': nav = await this.pagefn('menu_settings').then((res:any)=> {return res})
                            break
      default: nav = false
    }
    return nav
  }

  getData():Promise<Object> {
    return this.dataservice.auth().toPromise()
  }

  findData(page:string):Promise<Object> {
    return this.dataservice.findData('permission', 
      {'emp_id':sessionStorage.getItem('emp_id'), 'page':page}).toPromise()
  }

  async rootfn():Promise<boolean> {
    let data:any = await this.getData()
    if(data.user)
      sessionStorage.setItem('emp_id', data.user[1])
    return data.user?.length>0
  }

  async pagefn(page:string):Promise<boolean> {
    let data:any = await this.findData(page)
    return data.user?.length>0
  }
}