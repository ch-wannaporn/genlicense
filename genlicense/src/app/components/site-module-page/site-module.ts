export interface DataNode {
    id: string;
    name: string;
    description: string;
    details?: DataNode[];
}

export interface SiteModuleFlatNode {
    expandable: boolean;
    id:string;
    name: string;
    level: number;
}

export class SiteModule {
    constructor(
        public site_id: string = '',
        public module_id: string = ''
      ) {  }
}