import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet/entities/wallet';
import { typeormDbConnection } from './typeorm-db.connection';

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
      entities: [Wallet],
      synchronize: true,
    }),
    WalletModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
