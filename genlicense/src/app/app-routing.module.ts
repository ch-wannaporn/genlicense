import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginGuard } from './guards/login.guard';

import { DashboardComponent } from '../app/components/dashboard/dashboard.component'
import { SitePageComponent } from '../app/components/site-page/site-page.component'
import { ModulePageComponent } from '../app/components/module-page/module-page.component'
import { SiteModulePageComponent } from '../app/components/site-module-page/site-module-page.component'
import { GenerateFilePageComponent } from '../app/components/generate-file-page/generate-file-page.component'
import { DownloadFilePageComponent } from '../app/components/download-file-page/download-file-page.component'
import { ErrorPageComponent } from '../app/components/error-page/error-page.component'
import { MenuSettingsPageComponent } from '../app/components/menu-settings-page/menu-settings-page.component'

const routes: Routes = [
  { path: '',
    canActivateChild: [LoginGuard], 
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'site', component: SitePageComponent },
      { path: 'module', component: ModulePageComponent },
      { path: 'site-module', component: SiteModulePageComponent },
      { path: 'generate-file', component: GenerateFilePageComponent },
      { path: 'download-file', component: DownloadFilePageComponent },
      { path: 'menu-settings', component: MenuSettingsPageComponent }
    ]
  },
  { path: 'error', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
