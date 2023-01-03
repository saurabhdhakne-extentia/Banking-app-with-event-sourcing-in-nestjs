import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { Card } from './entities/card';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormDbConnection } from '../typeorm-db.connection';
import { RandomCardGenerator } from './random-card.generator';
import { CardRepositoryToken } from './card-repository.token';
import { TypeormCardRepository } from './repository/typeorm-card.repository';
import { CardGeneratorToken } from './card-generator.token';
import { WalletModule } from '../wallet/wallet.module';
import { Wallet } from '../wallet/entities/wallet';
import { AddCardHandler } from './commands/handler/add-card.handler';
import { GetCardHandler } from './queries/handlers/get-card.handler';
import { BlockCardHandler } from './commands/handler/block-card.handler';
import { UnblockCardHandler } from './commands/handler/unblock-card.handler';
import { LoadMoneyHandler } from './commands/handler/load-money.handler';
import { UnloadMoneyHandler } from './commands/handler/unload-money.handler';

const Commands = [AddCardHandler, BlockCardHandler, UnblockCardHandler, LoadMoneyHandler, UnloadMoneyHandler]
const Queries = [GetCardHandler]

@Module({
  imports: [
    WalletModule,
    CqrsModule,
    TypeOrmModule.forFeature([Card, Wallet], typeormDbConnection)
  ],
  providers: [
    RandomCardGenerator,
    {
      provide: CardRepositoryToken,
      useClass: TypeormCardRepository
    },
    {
      provide: CardGeneratorToken,
      useClass: RandomCardGenerator
    },
    ...Commands,
    ...Queries
  ],
  controllers: [CardController]
})
export class CardModule { }
