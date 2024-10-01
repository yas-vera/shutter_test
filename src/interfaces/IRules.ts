export interface IRulesFilter {
    rule_id: string;
    creation_date_start: string;
    creation_date_end: string;
    validity_start_time: string;
    validity_end_time: string;
    sensing_start_time: string;
    sensing_end_time: string;
    rule_name: string;
    rule_type: string;
    status: string;
    comments: string;
    sensing_time:string;
    validity_time:string;
    acquisition_mode_id:string;
    mission_id:string;
    creation_date_criteria:string;
}