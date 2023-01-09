import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormDbConnection } from "../typeorm-db.connection";
import { TransferRepositoryToken } from "./transfer-repository.token";
import { RecordTransferHandler } from "./commands/handler/record-transfer.handler";
import { CardLoadedTransferListener } from "./events/card-loaded-transfer.listener";
import { CardUnloadedTransferListener } from "./events/card-unloaded-transfer.listener";
import { WalletFundTransferListener } from "./events/wallet-fund-transfer.listener";
import { Transfer } from "./entities/transfer.entity";
import { TypeormTransferRepository } from "./repository/typeorm-transfer.repository";

const Commands = [RecordTransferHandler];
const EventListeners = [CardLoadedTransferListener, CardUnloadedTransferListener, WalletFundTransferListener];

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Transfer], typeormDbConnection)
    ],
    providers: [
        {
            provide: TransferRepositoryToken,
            useClass: TypeormTransferRepository
        },
        ...Commands,
        ...EventListeners
    ]
})
export class TransferModule { }