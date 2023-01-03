import { Currency } from "../../currency.constant";

export class CardDto {
    id: string;

    currency: Currency;

    currentBalance: number;

    number: string;

    expirationDate: Date;

    ccv: string;

    userId: string;

    status: boolean;

    walletId: string;
}
