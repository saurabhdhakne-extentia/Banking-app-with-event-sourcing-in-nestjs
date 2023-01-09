import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TargetType } from "../target-type";
import { FundsTransferedEvent } from "../../wallet/events/funds-transfered.event";
import { RecordTransferCommand } from "../commands/impl/record-transfer.command";

@EventsHandler(FundsTransferedEvent)
export class WalletFundTransferListener implements IEventHandler<FundsTransferedEvent> {

    constructor(
        private readonly commandBus: CommandBus
    ) { }

    async handle(event: FundsTransferedEvent): Promise<void> {
        await this.commandBus.execute(
            new RecordTransferCommand(
                event.destinationAmount,
                event.originCurrency,
                event.destinationCurrency,
                event.originWalletId,
                event.destinationWalletId,
                TargetType.WALLET,
                event.commission
            )
        );
        return;
    }

}