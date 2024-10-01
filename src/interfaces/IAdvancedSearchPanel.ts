export interface IAdvancedSearchPanel{
    tipology: string,
    missionAndSensor: string,
    acquisitionArea: string,
    acquisitionMode: string,
    rankRangeFrom: Date | string,
    rankRangeTo: Date | string,
    timeWindowValidityFrom: Date | string,
    timeWindowValidityTo: Date | string,
    applicationToUserGroups: string,
    users: string
}