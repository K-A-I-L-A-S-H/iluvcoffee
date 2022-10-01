import {
    Controller, Get, Param, Post, Body, Patch, Delete, Query, Inject
} from '@nestjs/common';
import { CoffeesService } from "./coffees.service";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Controller('coffees')
export class CoffeesController {
    constructor(
        private readonly coffeesService: CoffeesService,
        @Inject(REQUEST) private readonly request: Request
    ) {
        console.log('Coffees controller created');
    }

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        // const { limit, offset } = paginationQuery;
        return this.coffeesService.findAll(paginationQuery);
    }

    @Get('flavours')
    findFlavours() {
        return 'All flavours';
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.coffeesService.findOne(''+id);
    }

    // @Post()
    // @HttpCode(HttpStatus.GONE)
    // create(@Body() body) {
    //     return body;
    // }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}
