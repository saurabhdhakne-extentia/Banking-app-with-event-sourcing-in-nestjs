import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import * as uuid from 'uuid';
import { AddCardCommand } from "../impl/add-card.command";
import { CardRepositoryToken } from "../../card-repository.token";
import { CardRepository } from "../../repository/card.repository";
import { WalletRepositoryToken } from "../../../wallet/wallet-repository.token";
import { CardGeneratorToken } from "../../card-generator.token";
import { WalletRepository } from "../../../wallet/repository/wallet.repository";
import { RandomCardGenerator } from "../../random-card.generator";
import { WalletIdDoesNotExistException } from "../../../wallet/exceptions/wallet-id-does-not-exist.exception";
import { Card } from "../../entities/card";
import { CardAddedEvent } from "../../events/card-added.event";

@CommandHandler(AddCardCommand)
export class AddCardHandler implements ICommandHandler<AddCardCommand> {

    constructor(
        @Inject(CardRepositoryToken)
        private readonly cardRepository: CardRepository,
        @Inject(WalletRepositoryToken)
        private readonly walletRepository: WalletRepository,
        @Inject(CardGeneratorToken)
        private readonly cardGenerator: RandomCardGenerator,
        private readonly eventBus: EventBus
    ) {
    }

    async execute(command: AddCardCommand): Promise<any> {

        const wallet = await this.walletRepository.findById(command.walletId);

        if (!wallet) {
            throw new WalletIdDoesNotExistException();
        }

        const id = uuid.v4();
        const cardNumbers = await this.cardGenerator.generateCardNumber();
        const card = new Card(
            id,
            wallet.currency,
            0,
            cardNumbers.number,
            cardNumbers.ccv,
            command.userId,
            wallet.id
        );
        await this.cardRepository.save(card);
        this.eventBus.publish(new CardAddedEvent(id, command.userId, wallet.companyId, wallet.id));
        return id;
    }
}