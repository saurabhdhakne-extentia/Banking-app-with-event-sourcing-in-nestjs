import { AddWalletCommand } from "../impl/add-wallet.command";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { WalletRepositoryToken } from "./../../wallet-repository.token";
import { WalletRepository } from "../../repository/wallet.repository";
import * as uuid from 'uuid';
import { Wallet } from "../../entities/wallet";
import { WalletAddedEvent } from "../../events/wallet-added.event";

@CommandHandler(AddWalletCommand)
export class AddWalletHandler {

    constructor(
        @Inject(WalletRepositoryToken)
        private readonly repository: WalletRepository,
        private readonly eventBus: EventBus
    ) { }


    async execute(command: AddWalletCommand): Promise<string> {
        const id = uuid.v4();
        const wallet = new Wallet(id, command.balance, command.currency, command.companyId);
        await this.repository.save([wallet]);
        this.eventBus.publish(new WalletAddedEvent(id, command.balance, command.currency, command.companyId));
        return id;
    }
}
