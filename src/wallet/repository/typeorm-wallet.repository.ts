import { Injectable } from "@nestjs/common";
import { WalletRepository } from "./wallet.repository";
import { Wallet } from "../entities/wallet";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { typeormDbConnection } from "../../typeorm-db.connection";

@Injectable()
export class TypeormWalletRepository implements WalletRepository {

    constructor(
        @InjectRepository(Wallet, typeormDbConnection)
        private readonly repository: Repository<Wallet>
    ) { }

    async save(wallets: Wallet[]): Promise<void> {
        await this.repository.save(wallets);
        return;
    }

}