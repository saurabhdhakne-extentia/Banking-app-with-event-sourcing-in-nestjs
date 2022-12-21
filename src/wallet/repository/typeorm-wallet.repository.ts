import { Injectable } from "@nestjs/common";
import { WalletRepository } from "./wallet.repository";
import { Wallet } from "../entities/wallet";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { typeormDbConnection } from "../../typeorm-db.connection";
import { Currency } from "../../currency.constant";

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

    findByCompanyId(companyId: string): Promise<Wallet[]> {
        return this.repository.find({
            where: {
                companyId: companyId
            }
        });
    }

    findById(walletId: string): Promise<Wallet | undefined> {
        return this.repository.findOne({
            where: {
                id: walletId
            }
        });
    }

    findByIds(ids: string[]): Promise<Wallet[] | undefined> {
        return this.repository.findByIds(ids);
    }

    findCommissionWallet(currency: Currency): Promise<Wallet | undefined> {
        return this.repository.findOne({
            where: {
                currency: currency, master: true
            }
        });
    }

}