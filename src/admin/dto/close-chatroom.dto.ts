import { IsString, IsNotEmpty } from 'class-validator';

export class CloseChatRoomDto {
    @IsString()
    @IsNotEmpty()
    summary: string;
}
