import { Request } from 'express';
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Post, Get, Body, Req, Param } from "@nestjs/common";
import { CreateWalletInputDto } from './dtos/create-wallet-input.dto';
import { CreateWalletOutputDto } from './dtos/create-wallet-output.dto';
import { validate as uuidValidate } from 'uuid';
import { AddWalletCommand } from './commands/impl/add-wallet.command';
import { WalletDto } from './dtos/wallet.dto';
import { GetWalletQuery } from './queries/impl/get-wallets.query';
import { TransferFundsInput } from './transfer-funds.input';
import { TransferFundsCommand } from './commands/impl/transfer-funds.command';

@Controller('wallet')
export class WalletController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post()
    async createWallet(
        @Body() payload: CreateWalletInputDto,
        @Req() request: Request
    ): Promise<CreateWalletOutputDto> {
        const companyId = request.header('X-Company-Id');
        if (!uuidValidate(companyId)) {
            throw new HttpException('Company Id must be a valid uuid', HttpStatus.BAD_REQUEST);
        }
        const id = await this.commandBus.execute(new AddWalletCommand(payload.balance, payload.currency, companyId));
        return { id };
    }

    @Get()
    async getWallets(
        @Req() request: Request
    ): Promise<WalletDto[]> {
        const companyId = request.header('X-Company-Id');
        if (!uuidValidate(companyId)) {
            throw new HttpException('Company Id must be a valid uuid', HttpStatus.BAD_REQUEST);
        }
        return this.queryBus.execute(new GetWalletQuery(companyId));
    }


    @Post(':walletId/transfer')
    async transferWalletFunds(
        @Req() request: Request,
        @Param('walletId') walletId: string,
        @Body() payload: TransferFundsInput
    ): Promise<void> {
        const companyId = request.header('X-Company-Id');
        if (!uuidValidate(companyId)) {
            throw new HttpException('Company Id must be a valid uuid', HttpStatus.BAD_REQUEST);
        }
        if (!uuidValidate(walletId)) {
            throw new HttpException('Wallet Id must be a valid uuid', HttpStatus.BAD_REQUEST);
        }
        await this.commandBus.execute(new TransferFundsCommand(walletId, payload.destinationWalletId, payload.amount, companyId));
    }

}
