import { WalletRepository } from "../../repository/wallet.repository";
import { WalletRepositoryToken } from "../../wallet-repository.token";
import { Inject } from "@nestjs/common";
import { GetWalletQuery } from "../impl/get-wallets.query";
import { WalletDto } from "src/wallet/dtos/wallet.dto";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetWalletQuery)
export class GetWalletHandler {

    constructor(
        @Inject(WalletRepositoryToken)
        private readonly repository: WalletRepository
    ) { }

    async execute(query: GetWalletQuery): Promise<WalletDto[]> {
        const wallets = await this.repository.findByCompanyId(query.companyId);
        return wallets.map(wallet => ({ id: wallet.id, currentBalance: wallet.currentBalance, currency: wallet.currency, companyId: query.companyId } as WalletDto));
    }
}
