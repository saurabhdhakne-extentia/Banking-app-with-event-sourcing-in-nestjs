import { Wallet } from "../../wallet/entities/wallet";
import { Card } from "../entities/card";

export interface CardRepository {
    save(card: Card): Promise<void>;
    findCardByNumber(cardNumber: string): Promise<Card | undefined>;
    findCardsByUserId(userId: string): Promise<Card[]>;
    findById(cardId: string): Promise<Card | undefined>;
    saveInSingleTransaction(card: Card, wallet: Wallet): Promise<void>;
}
