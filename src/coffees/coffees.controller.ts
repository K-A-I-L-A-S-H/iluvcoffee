import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    Query
    // HttpCode,
    // HttpStatus
} from '@nestjs/common';
import { CoffeesService } from "./coffees.service";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) {}

    @Get()
    findAll(@Query() paginationQuery) {
        // const { limit, offset } = paginationQuery;
        return this.coffeesService.findAll();
    }

    @Get('flavours')
    findFlavours() {
        return 'All flavours';
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        console.log(typeof id);
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
