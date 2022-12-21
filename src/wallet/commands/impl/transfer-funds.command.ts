export class TransferFundsCommand {
    constructor(
        public readonly originWalletId: string,
        public readonly destinationWalletId: string,
        public readonly amount: number,
        public readonly companyId: string
    ) { }
}
