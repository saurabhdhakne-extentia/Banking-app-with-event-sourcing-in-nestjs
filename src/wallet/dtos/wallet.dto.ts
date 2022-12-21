
import { Currency } from "../../currency.constant";

export interface WalletDto {
    id: string;
    currentBalance: number;
    currency: Currency;
    companyId: string;
}