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
import { ParseIntPipe } from "../common/pipes/parse-int.pipe";
import { Protocol } from "../common/decorators/protocol.decorator";
import { ApiForbiddenResponse, ApiResponse, ApiTags } from "@nestjs/swagger";

// Controller scoped pipes, can also use instance like: @UsePipes(new ValidationPipe({options}))
// @UsePipes(ValidationPipe)
@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
    constructor(
        private readonly coffeesService: CoffeesService,
        // @Inject(REQUEST) private readonly request: Request, // this allows the app to create a new instance of controller each time a request is made
    ) {
        console.log('Coffees controller created');
    }

    // Method / Route scoped pipe
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @UsePipes(ValidationPipe)
    // @SetMetadata('isPublic', true) // set the meta-data to just one end-point, although custom decorator to do this would be better approach
    @Public() // A custom decorator to set the route public
    @Get()
    findAll(@Protocol("https") protocol, @Query() paginationQuery: PaginationQueryDto) {
        // const { limit, offset } = paginationQuery;
        // await new Promise(resolve => setTimeout(resolve, 5000)); // To check if timeout interceptor is working or not
         console.log(protocol);
        return this.coffeesService.findAll(paginationQuery);
    }

    @Get('flavours')
    findFlavours() {
        return 'All flavours';
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        console.log(id);
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
