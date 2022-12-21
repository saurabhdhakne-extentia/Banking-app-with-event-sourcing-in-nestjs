import { Request } from 'express';
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Post, Body, Req } from "@nestjs/common";
import { CreateWalletInput } from './create-wallet.input';
import { CreateWalletOutput } from './create-wallet.output';
import { validate as uuidValidate } from 'uuid';
import { AddWalletCommand } from './commands/impl/add-wallet.command';

@Controller('wallet')
export class WalletController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly query: QueryBus
    ) { }

    @Post()
    async createWallet(
        @Body() payload: CreateWalletInput,
        @Req() request: Request
    ): Promise<CreateWalletOutput> {
        const companyId = request.header('X-Company-Id');
        if (!uuidValidate(companyId)) {
            throw new HttpException('Company Id must be a valid uuid', HttpStatus.BAD_REQUEST);
        }
        const id = await this.commandBus.execute(new AddWalletCommand(payload.balance, payload.currency, companyId));
        return { id };
    }

}
