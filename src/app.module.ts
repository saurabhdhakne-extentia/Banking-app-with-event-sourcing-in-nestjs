import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet/entities/wallet';
import { typeormDbConnection } from './typeorm-db.connection';
import { CardModule } from './card/card.module';
import { Card } from './card/entities/card';
import { TransferModule } from './transfer/transfer.module';
import { Transfer } from './transfer/entities/transfer.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: typeormDbConnection,
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'toor',
      database: 'BANK404',
      entities: [Wallet, Card, Transfer],
      synchronize: true,
    }),
    WalletModule,
    CardModule,
    TransferModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
