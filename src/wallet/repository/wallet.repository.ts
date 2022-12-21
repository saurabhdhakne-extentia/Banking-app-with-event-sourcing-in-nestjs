import { Wallet } from "../entities/wallet";
import { Currency } from "../../currency.constant";

export interface WalletRepository {
    save(wallets: Wallet[]): Promise<void>;
    findByCompanyId(companyId: string): Promise<Wallet[]>;
}