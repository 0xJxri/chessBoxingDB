export interface DetailedFighterDTO {
    id: string;
    name: string;
    results: string[];
    pfpLink: string;
    age: string;
    height: string;
    weight: string;
    reach: string | null;
    elo: string;
    country: string;
    hometown: string;
    gym: string;
    job: string;
    description: string;
    fights: FightDto[];
}

export interface FightDto {
    opponentChessColor: string;
    opponentName: string;
    eventName: string;
    date: string;
    result: string;
    description: string;
    round: string;
}
