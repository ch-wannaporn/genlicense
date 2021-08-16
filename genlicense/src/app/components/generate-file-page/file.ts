export class File {
    constructor(
        public site_id: string = '',
        public module_id: string = '',
        public license_agent: number = 0,
        public license_supervisor: number = 0,
        public license_manager: number = 0,
        public env_id: string = '',
        public lic_name: string = '',
        public license_expired_date: any = 'Never'
    ) {}
}

export class EXP {
    constructor(
        public date: Date = new Date(),
        public never: boolean = true
    ) {}
}