import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TargetType } from "../target-type";
import { MoneyUnloadedEvent } from "../../card/events/money-unloaded.event";
import { RecordTransferCommand } from "../commands/impl/record-transfer.command";

@EventsHandler(MoneyUnloadedEvent)
export class CardUnloadedTransferListener implements IEventHandler<MoneyUnloadedEvent> {

    constructor(
        private readonly commandBus: CommandBus
    ) { }

    async handle(event: MoneyUnloadedEvent): Promise<void> {
        await this.commandBus.execute(
            new RecordTransferCommand(
                event.amount,
                event.currency,
                event.currency,
                event.cardId,
                event.walletId,
                TargetType.CARD,
                0
            )
        );
        return;
    }
}