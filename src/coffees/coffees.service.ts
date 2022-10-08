import {Inject, Injectable, NotFoundException, Scope} from '@nestjs/common';
import {Coffee} from "./entities/coffees.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, Repository} from "typeorm";
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {Flavour} from "./entities/flavours.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Events} from "../events/entities/events.entity";
import {COFFEE_BRANDS} from "./coffees.constants";
import {ConfigService, ConfigType} from "@nestjs/config";
import coffeesConfig from "./config/coffees.config";

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavour)
        private readonly flavourRepository: Repository<Flavour>,
        private readonly connection: Connection,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
        // private readonly configService: ConfigService,
        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>
    ) {
        console.log('Coffee Service instantiated');
        // console.log(this.configService.get<string>('DATABASE_HOST', 'localhost'));
        // console.log(this.configService.get('database.host', 'localhost'));
        // console.log(this.configService.get('coffee'));
        // console.log(this.configService.get('coffee.foo'));
        console.log(this.coffeesConfiguration.foo);
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const {limit, offset} = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavours'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({
            where: {id: Number(id)},
            relations: ['flavours'],
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavours = await Promise.all(
            createCoffeeDto.flavours.map(flavour => this.preloadFlavourByName(flavour))
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavours,
        });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavours = await Promise.all(
            updateCoffeeDto.flavours.map(flavour => this.preloadFlavourByName(flavour))
        );
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavours,
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id: string) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            coffee.recommendations++;

            const recommendEvent = new Events();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        } catch(err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavourByName(name: string): Promise<Flavour> {
        const existingFlavour = await this.flavourRepository.findOne({
            where: {name: name},
        });
        if (existingFlavour) {
            return existingFlavour;
        }
        return this.flavourRepository.create({ name });
    }
}
