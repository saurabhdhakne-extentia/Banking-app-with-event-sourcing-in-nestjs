import { Body, Controller, HttpException, Param, Post, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCardInputDto } from './dtos/create-card-input.dto';
import { validate as uuidValidate } from 'uuid';
import { Request } from 'express';
import { CreateCardOutputDto } from './dtos/create-card-output.dto';
import { AddCardCommand } from './commands/impl/add-card.command';
import { Get } from '@nestjs/common/decorators';
import { CardDto } from './dtos/card.dto';
import { GetCardQuery } from './queries/impl/get-card.query';
import { BlockCardCommand } from './commands/impl/block-card.command';
import { UnblockCardCommand } from './commands/impl/unblock-card.command';
import { LoadMoneyDto } from './dtos/load-money.dto';
import { LoadMoneyCommand } from './commands/impl/load-money.command';
import { UnloadMoneyCommand } from './commands/impl/unload-money.command';

@Controller('card')
export class CardController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post()
    async createCard(
        @Body() payload: CreateCardInputDto,
        @Req() request: Request
    ): Promise<CreateCardOutputDto> {
        const userId = request.header('X-User-Id');
        if (!uuidValidate(userId)) {
            throw new HttpException('User Id must be a valid uuid', 400);
        }

        const id = await this.commandBus.execute(new AddCardCommand(payload.walletId, userId));
        return { id };
    }

    @Get()
    async getCards(
        @Req() request: Request
    ): Promise<CardDto[]> {
        const userId = request.header('X-User-Id');
        if (!uuidValidate(userId)) {
            throw new HttpException('User Id must be a valid uuid', 400);
        }
        return this.queryBus.execute(new GetCardQuery(userId));
    }

    @Post(':cardId/block')
    async blockCard(
        @Req() request: Request,
        @Param('cardId') cardId: string
    ): Promise<void> {
        const userId = request.header('X-User-Id');
        if (!uuidValidate(userId)) {
            throw new HttpException('User Id must be a valid uuid', 400);
        }
        await this.commandBus.execute(new BlockCardCommand(cardId, userId));
    }

    @Post(':cardId/unblock')
    async unblockCard(
        @Req() request: Request,
        @Param('cardId') cardId: string
    ): Promise<void> {
        const userId = request.header('X-User-Id');
        if (!uuidValidate(userId)) {
            throw new HttpException('User Id must be a valid uuid', 400);
        }
        await this.commandBus.execute(new UnblockCardCommand(cardId, userId));
    }

    @Post(':cardId/load')
    async loadMoneyToCard(
        @Req() request: Request,
        @Param('cardId') cardId: string,
        @Body() payload: LoadMoneyDto,
    ): Promise<void> {
        const userId = request.header('X-User-Id');
        if (!uuidValidate(userId)) {
            throw new HttpException('User Id must be a valid uuid', 400);
        }
        await this.commandBus.execute(new LoadMoneyCommand(userId, cardId, payload.amount))
    }

    @Post(':cardId/unload')
    async unloadMoneyToCard(
        @Req() request: Request,
        @Param('cardId') cardId: string,
        @Body() payload: LoadMoneyDto,
    ): Promise<void> {
        const userId = request.header('X-User-Id');
        if (!uuidValidate(userId)) {
            throw new HttpException('User Id must be a valid uuid', 400);
        }
        await this.commandBus.execute(new UnloadMoneyCommand(userId, cardId, payload.amount))
    }
}
