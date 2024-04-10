export interface FightersListDto {
    _id: { $oid: string };
    urlImg: string;
    profileLink: string;
    name: string;
    nationality: string;
    fights: Number;
    record: string;
    elo: Number;
    height: string;
    weight: string;
    activeYears: string;
}