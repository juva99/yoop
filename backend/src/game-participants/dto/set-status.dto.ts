import { IsEnum, IsString } from "class-validator";
import { ParticipationStatus } from "src/enums/participation-status.enum";

export class SetStatusDto{

    @IsString()
    uid: string;

    @IsString()
    gameId: string;

    @IsEnum(ParticipationStatus)
    newStatus: ParticipationStatus;

}