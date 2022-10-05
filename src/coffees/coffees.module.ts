import {Module, Scope} from '@nestjs/common';
import {CoffeesController} from "./coffees.controller";
import {CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Coffee} from "./entities/coffees.entity";
import {Flavour} from "./entities/flavours.entity";
import {Events} from "../events/entities/events.entity";
import {COFFEE_BRANDS} from "./coffees.constants";
import {ConfigModule} from "@nestjs/config";
import coffeesConfig from "./config/coffees.config";

// class MockCoffeeService {}

// class ConfigService {}
// class DevelopmentConfigService {}
// class ProductionConfigService {}

// @Injectable()
// export class CoffeesBrandfactory {
//     create() {
//         /* ...do something... */
//         return ["bru", "nescafe"];
//     }
// }

@Module({
    imports: [
        TypeOrmModule.forFeature([Coffee, Flavour, Events]),
        ConfigModule.forFeature(coffeesConfig)
    ],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        { provide: COFFEE_BRANDS, useFactory: () => ["bru", "nescafe"] }
    ],
    // providers: [{ provide: CoffeesService, useClass: CoffeesService}]
    // providers: [{ provide: CoffeesService, useClass: process.env.NODE_ENV === 'dev' ? DevelopmentConfigService : ProductionConfigService }] // Custom Provider values (useClass syntax)
    // providers: [{ provide: CoffeesService, useValue: new MockCoffeeService() }] // Custom Provider values (useValue syntax) - can be used for testing
    // providers: [{ provide: CoffeesService, { provide: COFFEE_BRANDS, useValue: ["bru", "nescafe"] }] // Using constants as providers
    // providers: [{ provide: CoffeesService, { provide: COFFEE_BRANDS, useFactory: () => ["bru", "nescafe"] }] // Custom Providers & Can Inject other providers, see below
    // providers: [ CoffeesService, CoffeesBrandfactory, { provide: COFFEE_BRANDS, useFactory: (brandsFactory: CoffeesBrandfactory) => brandsFactory.create(), inject: [CoffeesBrandfactory] }],
    // providers: [ CoffeesService, { provide: COFFEE_BRANDS, useFactory: async (connection: Connection): Promise<string[]> => {
    //             // const coffeeBrands = await connection.query('Select * ...'); // mocking the db operation
    //             const coffeeBrands = await Promise.resolve(["bru", "nescafe"]);
    //             console.log('[!] Async factory');
    //             return coffeeBrands;
    //         }
    //     }], // Using Factory pattern to wait for async operation to complete before loading the module
    exports: [CoffeesService]
})
export class CoffeesModule {}
