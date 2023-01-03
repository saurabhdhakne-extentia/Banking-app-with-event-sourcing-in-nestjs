import { Currency } from "../../currency.constant";

export class MoneyUnloadedEvent {
    constructor(
        readonly amount: number,
        readonly cardId: string,
        readonly currency: Currency,
        readonly walletId: string
    ) { }
}
