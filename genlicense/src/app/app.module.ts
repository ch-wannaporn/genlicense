import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatTabsModule } from '@angular/material/tabs'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTreeModule } from '@angular/material/tree'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatNativeDateModule } from '@angular/material/core'
import { MatStepperModule } from '@angular/material/stepper'
import { MatListModule } from '@angular/material/list'

import { NgxPaginationModule } from 'ngx-pagination'
import { NgSelectModule } from '@ng-select/ng-select'

import { DataService } from './services/data.service'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SitePageComponent } from './components/site-page/site-page.component';
import { ModulePageComponent } from './components/module-page/module-page.component';
import { SiteModulePageComponent } from './components/site-module-page/site-module-page.component';
import { GenerateFilePageComponent } from './components/generate-file-page/generate-file-page.component';
import { DownloadFilePageComponent } from './components/download-file-page/download-file-page.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { MenuSettingsPageComponent } from './components/menu-settings-page/menu-settings-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    DashboardComponent,
    SitePageComponent,
    ModulePageComponent,
    SiteModulePageComponent,
    GenerateFilePageComponent,
    DownloadFilePageComponent,
    ErrorPageComponent,
    MenuSettingsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatStepperModule,
    MatListModule,
    NgxPaginationModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
