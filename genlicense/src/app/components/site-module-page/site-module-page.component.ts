import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataService } from '../../services/data.service'
import { DataNode, SiteModuleFlatNode, SiteModule } from './site-module'

@Component({
  selector: 'app-site-module-page',
  templateUrl: './site-module-page.component.html',
  styleUrls: ['./site-module-page.component.css', '../../../assets/vendor/fontawesome-free/css/all.min.css', '../../../assets/css/sb-admin-2.min.css']
})
export class SiteModulePageComponent implements OnInit {

  site_module_model = new SiteModule()

  site_module_data: DataNode[] = []
  siteoptions: DataNode[] = []
  moduleoptions: DataNode[] = []

  page: number = 1

  siteFilter: string = ''
  moduleFilter: string = ''

  //#region tree

  private _transformer = (node: DataNode, level: number) => {
    return {
      expandable: !!node.details && node.details.length > 0,
      id: node.id,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<SiteModuleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.details);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: SiteModuleFlatNode) => node.expandable;

  getParent(node: SiteModuleFlatNode) {
    const { treeControl } = this;
    const currentLevel = treeControl.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const index = treeControl.dataNodes.indexOf(node) - 1;

    for (let i = index; i >= 0; i--) {
      const currentNode = treeControl.dataNodes[i];

      if (treeControl.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }

    return null;
  }

  //#endregion tree

  constructor(private dataservice: DataService, private snack_bar: MatSnackBar) { }

  ngOnInit() {
    this.getData()
  }

  numberOfPages() {
    return Math.ceil(this.site_module_data.length / 10);
  };

  onClick(src: string) {
    this.page = (src == 'prev') ? this.page - 1 : (src == 'next') ? this.page + 1 : this.page
    this.dataSource.data = this.site_module_data.slice(this.page * 10 - 10, this.page * 10)
  }

  changePage(event: any) {
    this.page = event.target.value
    this.dataSource.data = this.site_module_data.slice(this.page * 10 - 10, this.page * 10)
  }

  getData() {
    this.dataservice.readData("site-module").subscribe((res) => {
      let data: any = res
      this.site_module_data = data["site-module"]
      this.siteoptions = data["site-module"]
      this.dataSource.data = this.site_module_data.slice(this.page * 10 - 10, this.page * 10)
    })
  }

  filterData() {
    this.dataservice.findData("site-module",
      { "sitefilter": this.siteFilter, "modulefilter": this.moduleFilter }).subscribe((res) => {
        let data: any = res
        this.site_module_data = data["site-module"]
        this.dataSource.data = this.site_module_data.slice(this.page * 10 - 10, this.page * 10)
      })
  }

  onInputFilter(event: any) {
    event.target.id == 'site_search' ? this.siteFilter = event.target.value : null
    event.target.id == 'module_search' ? this.moduleFilter = event.target.value : null

    this.filterData()
  }

  onChangeOption(event: any) {
    this.site_module_model.module_id = ''

    if (event) {
      let module_id: any = []
      for (let i = 0; i < event?.details.length; i++)
        module_id[i] = event.details[i].id

      this.dataservice.findData("module", { 'module_id': { $nin: module_id } }).subscribe((res) => {
        let data: any = res
        this.moduleoptions = data["module"]
      })
    } else {
      this.moduleoptions = []
    }

  }

  onSubmit(form: NgForm) {
    this.dataservice.writeData("site-module", this.site_module_model).subscribe((res) => {
      let data: any = res
      if ('site-module' in data) {
        this.site_module_data = data["site-module"]
        this.siteoptions = data["site-module"]
        this.dataSource.data = this.site_module_data.slice(this.page * 10 - 10, this.page * 10)

        this.snack_bar.open("Successfully added module to site!", "Close")

        this.site_module_model = new SiteModule()
        form.resetForm()
      }
    })
  }

  onDel(node: any) {
    if (confirm("Are you sure to delete this module from site?")) {
      this.dataservice.deleteData("site-module", { "site_id": this.getParent(node)?.id, "module_id": node.id })
        .subscribe((res) => {
          let data: any = res
          if ('site-module' in data) {
            this.site_module_data = data["site-module"]
            this.siteoptions = data["site-module"]
            this.dataSource.data = this.site_module_data.slice(this.page * 10 - 10, this.page * 10)
            this.snack_bar.open("Successfully deleted module from site!", "Close")
          }
        })
    }
  }
}