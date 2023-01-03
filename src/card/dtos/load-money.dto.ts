import { IsInt, Min } from "class-validator";

export class LoadMoneyDto {
    @IsInt()
    @Min(1)
    amount: number;
}
