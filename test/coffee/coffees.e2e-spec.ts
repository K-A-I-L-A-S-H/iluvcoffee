import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { CoffeesModule } from "../../src/coffees/coffees.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpExceptionFilter } from "../../src/common/filters/http-exception.filter";
import { WrapResponseInterceptor } from "../../src/common/interceptors/wrap-response.interceptor";
import { TimeoutInterceptor } from "../../src/common/interceptors/timeout.interceptor";
import { CreateCoffeeDto } from "../../src/coffees/dto/create-coffee.dto";

describe('[Feature] Coffees - /coffees', () => {
    const coffee = {
        name: 'Shipwreck Roast',
        brand: 'Bru',
        flavours: ['chocolate', 'caramel'],
    }
    let app: INestApplication;

    beforeAll(async () => {
       const moduleFixture: TestingModule = await Test.createTestingModule({
           imports: [
               CoffeesModule,
               TypeOrmModule.forRoot({
                   type: 'postgres',
                   host: 'localhost',
                   port: 5433,
                   username: 'postgres',
                   password: 'pass123',
                   database: 'postgres',
                   autoLoadEntities: true,
                   synchronize: true,
               }),
           ],
       }).compile();

       app = moduleFixture.createNestApplication();
       app.useGlobalPipes(
           new ValidationPipe({
               whitelist: true,
               forbidNonWhitelisted: true,
               transform: true,
               transformOptions: {
                   enableImplicitConversion: true,
               },
           })
       );
       app.useGlobalFilters(new HttpExceptionFilter());
       app.useGlobalInterceptors(
           new WrapResponseInterceptor(),
           new TimeoutInterceptor()
       );
       await app.init();
    });

    it('Create [POST /]', () => {
        return request(app.getHttpServer())
            .post('/coffees')
            .send(coffee as CreateCoffeeDto)
            .expect(HttpStatus.CREATED);
            // .then(({ body }) => {
            //     const expectedCoffee = {
            //         ...coffee,
            //         flavours: coffee.flavours.map((name, idx) => {
            //             return { id: idx+1, name };
            //         }),
            //         recommendations: 0,
            //     };
            //     console.log(expectedCoffee);
            //     console.log(body);
            //     expect(body).toEqual(expectedCoffee);
            // });
    });
    it.todo('Get all [GET /]');
    it.todo('Get one [Get /:id]');
    it.todo('Update one [PATCH /:id]');
    it.todo('Delete one [DELETE /:id]');

    afterAll(async () => {
       await app.close();
    });

});
