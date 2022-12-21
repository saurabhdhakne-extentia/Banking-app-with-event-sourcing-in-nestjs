import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { Wallet } from './entities/wallet';
import { typeormDbConnection } from '../typeorm-db.connection';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddWalletHandler } from './commands/handler/add-wallet.handler';
import { WalletRepositoryToken } from './wallet-repository.token';
import { TypeormWalletRepository } from './repository/typeorm-wallet.repository';
import { GetWalletHandler } from './queries/handlers/get-wallet.handler';

const command = [AddWalletHandler];
const queries = [GetWalletHandler]
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Wallet], typeormDbConnection)
  ],
  controllers: [WalletController],
  providers: [
    {
      provide: WalletRepositoryToken,
      useClass: TypeormWalletRepository
    },
    ...command,
    ...queries
  ]
})
export class WalletModule { }
