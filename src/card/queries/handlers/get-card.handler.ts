import { QueryHandler } from "@nestjs/cqrs";
import { GetCardQuery } from "../impl/get-card.query";
import { CardRepositoryToken } from "../../card-repository.token";
import { CardRepository } from "../../repository/card.repository";
import { Inject } from "@nestjs/common/decorators/core/inject.decorator";
import { CardDto } from "../../dtos/card.dto";

@QueryHandler(GetCardQuery)
export class GetCardHandler {
    constructor(
        @Inject(CardRepositoryToken)
        private readonly cardRepository: CardRepository,
    ) { }

    async execute(query: GetCardQuery): Promise<CardDto[]> {
        const cards = await this.cardRepository.findCardsByUserId(query.userId);
        return cards.map(card => ({ ...card } as CardDto));
    }
}
