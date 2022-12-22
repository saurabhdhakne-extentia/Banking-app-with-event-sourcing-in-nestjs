import { Currency } from "../../currency.constant";
import { IsEnum, IsInt, Min } from "class-validator";

export class CreateWalletInputDto {
    @IsInt()
    @Min(0)
    balance: number;

    @IsEnum(Currency)
    currency: Currency;

}