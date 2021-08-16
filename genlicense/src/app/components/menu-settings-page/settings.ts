export class Permission {
    site:employee[] = [];
    module:employee[] = [];
    site_module:employee[] = [];
    generate_file:employee[] = [];
    download_file:employee[] = [];
    menu_settings:employee[] = [];
}

export class Hidden {
    site:boolean = true;
    module:boolean = true;
    site_module:boolean = true;
    generate_file:boolean = true;
    download_file:boolean = true;
    menu_settings:boolean = true;
}
  
export interface employee {
    emp_id:string;
    first_name:string;
    last_name:string;
    department_id:number;
    department_name:string;
}