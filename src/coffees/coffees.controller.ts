import {
    Controller, Get, Param, Post, Body, Patch, Delete, Query, Inject, UsePipes, ValidationPipe, SetMetadata
} from '@nestjs/common';
import { CoffeesService } from "./coffees.service";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Public } from "../common/decorators/public.decorator";

// Controller scoped pipes, can also use instance like: @UsePipes(new ValidationPipe({options}))
// @UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {
    constructor(
        private readonly coffeesService: CoffeesService,
        // @Inject(REQUEST) private readonly request: Request, // this allows the app to create a new instance of controller each time a request is made
    ) {
        console.log('Coffees controller created');
    }

    // Method / Route scoped pipe
    @UsePipes(ValidationPipe)
    // @SetMetadata('isPublic', true) // set the meta-data to just one end-point, although custom decorator to do this would be better approach
    @Public() // A custom decorator to set the route public
    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        // const { limit, offset } = paginationQuery;
        await new Promise(resolve => setTimeout(resolve, 5000));
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

    // Param scope piping using @Body(ValidationPipe)
    @Patch(':id')
    update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}
