import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TargetType } from "../target-type";
import { MoneyLoadedEvent } from "../../card/events/money-loaded.event";
import { RecordTransferCommand } from "../commands/impl/record-transfer.command";

@EventsHandler(MoneyLoadedEvent)
export class CardLoadedTransferListener implements IEventHandler<MoneyLoadedEvent> {

    constructor(
        private readonly commandBus: CommandBus
    ) { }

    async handle(event: MoneyLoadedEvent): Promise<void> {
        await this.commandBus.execute(
            new RecordTransferCommand(
                event.amount,
                event.currency,
                event.currency,
                event.walletId,
                event.cardId,
                TargetType.WALLET,
                0
            )
        );
        return;
    }
}