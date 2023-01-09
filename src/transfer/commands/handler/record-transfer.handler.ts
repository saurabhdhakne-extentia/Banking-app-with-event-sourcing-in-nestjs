import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { RecordTransferCommand } from "../impl/record-transfer.command";
import { Inject } from "@nestjs/common";
import * as uuid from 'uuid';
import { TransferRepositoryToken } from "../../transfer-repository.token";
import { TransferRepository } from "../../repository/transfer.repository";
import { Transfer } from "../../entities/transfer.entity";
import { TransferRecordedEvent } from "../../events/transfer-recorded.event";

@CommandHandler(RecordTransferCommand)
export class RecordTransferHandler implements ICommandHandler<RecordTransferCommand>{

    constructor(
        @Inject(TransferRepositoryToken)
        private readonly transferRepository: TransferRepository,
        private readonly eventBus: EventBus
    ) { }

    async execute(command: RecordTransferCommand): Promise<any> {

        const id = uuid.v4();
        const transfer = new Transfer(
            id,
            command.amount,
            command.originCurrency,
            command.targetCurrency,
            command.originId,
            command.targetId,
            command.targetType,
            command.conversionFee
        );

        await this.transferRepository.save(transfer);
        this.eventBus.publish(new TransferRecordedEvent(id));
        return id;
    }
}