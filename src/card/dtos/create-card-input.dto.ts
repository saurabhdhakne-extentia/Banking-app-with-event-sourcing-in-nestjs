import { IsUUID } from "class-validator";

export class CreateCardInputDto {
    @IsUUID()
    walletId: string
}
