export interface ResultsDto{
    _id: {$oid: string};
    fighterWhite: string;
    fighterBlack: string;
    results: string;
    event: string;
    data: string;
}