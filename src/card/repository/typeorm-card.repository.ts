import { CardRepository } from "./card.repository";
import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { typeormDbConnection } from "../../typeorm-db.connection";
import { Card } from "../entities/card";
import { Wallet } from "../../wallet/entities/wallet";

@Injectable()
export class TypeormCardRepository implements CardRepository {
    constructor(
        @InjectRepository(Card, typeormDbConnection)
        private readonly repository: Repository<Card>,
        @InjectConnection(typeormDbConnection)
        private connection: Connection
    ) { }

    async save(card: Card): Promise<void> {
        await this.repository.save(card);
        return;
    }

    findCardByNumber(cardNumber: string): Promise<Card | undefined> {
        return this.repository.findOne({
            where: {
                number: cardNumber
            }
        });
    }

    findCardsByUserId(userId: string): Promise<Card[]> {
        return this.repository.find({
            where: {
                userId: userId
            }
        });
    }

    findById(id: string): Promise<Card | undefined> {
        return this.repository.findOne({
            where: {
                id
            }
        });
    }

    async saveInSingleTransaction(card: Card, wallet: Wallet): Promise<void> {
        await this.connection.transaction(async em => {
            await em.save<Card>(card);
            await em.save<Wallet>(wallet);
        });
        return;
    }
}