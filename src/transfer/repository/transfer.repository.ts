import { Transfer } from "../entities/transfer.entity";

export interface TransferRepository {
    save(transfer: Transfer): Promise<void>;
}