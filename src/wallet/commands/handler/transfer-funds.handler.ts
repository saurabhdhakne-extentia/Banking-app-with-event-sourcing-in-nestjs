import { Inject } from "@nestjs/common";
import { TransferFundsCommand } from "../impl/transfer-funds.command";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import { WalletRepositoryToken } from "../../wallet-repository.token";
import { WalletRepository } from "../../repository/wallet.repository";
import { Wallet } from "../../entities/wallet";
import { WalletIdDoesNotExistException } from "../../exceptions/wallet-id-does-not-exist.exception";
import { WalletDoesNotBelongToCompanyException } from "../../exceptions/wallet-does-not-belong-to-company.exception";
import { TransfersCannotBeAcrossCompaniesException } from "../../exceptions/transfers-cannot-be-across-companies.exception";
import { InsufficientFundsInWalletException } from "../../exceptions/insufficient-funds-in-wallet.exception";
import { CouldNotConvertCurrenciesException } from "../../exceptions/could-not-convert-currencies.exception";
import { FundsTransferedEvent } from "../../events/funds-transfered.event";

@CommandHandler(TransferFundsCommand)
export class TransferFundsHandler {

    constructor(
        @Inject(WalletRepositoryToken)
        private readonly repository: WalletRepository,
        private readonly eventBus: EventBus
    ) { }


    async execute(command: TransferFundsCommand): Promise<void> {
        let originWallet: Wallet;
        let destinationWallet: Wallet;

        const wallets = await this.repository.findByIds([command.originWalletId, command.destinationWalletId]);

        if (!wallets) {
            throw new WalletIdDoesNotExistException();
        }

        if (wallets.length != 2) {
            throw new WalletIdDoesNotExistException();
        }

        if (wallets[0].id === command.originWalletId) {
            originWallet = wallets[0];
            destinationWallet = wallets[1];
        } else {
            originWallet = wallets[1];
            destinationWallet = wallets[0];
        }

        if (originWallet.companyId !== command.companyId) {
            throw new WalletDoesNotBelongToCompanyException();
        }

        if (originWallet.companyId !== destinationWallet.companyId) {
            throw new TransfersCannotBeAcrossCompaniesException();
        }

        if (originWallet.currentBalance < command.amount) {
            throw new InsufficientFundsInWalletException();
        }

        let transactionWallets: Wallet[];
        let commission = 0;
        let destinationAmount = command.amount;

        if (originWallet.currency === destinationWallet.currency) {
            originWallet.unloadMoney(command.amount);
            destinationWallet.loadMoney(command.amount);
            transactionWallets = [originWallet, destinationWallet];
        } else {
            throw new CouldNotConvertCurrenciesException();
        }

        await this.repository.save(transactionWallets);

        this.eventBus.publish(new FundsTransferedEvent(
            originWallet.id,
            destinationWallet.id,
            originWallet.currency,
            destinationWallet.currency,
            command.amount,
            destinationAmount,
            commission,
            new Date()
        ));
    }
}
