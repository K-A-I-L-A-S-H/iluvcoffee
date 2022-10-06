import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { Connection, Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Coffee } from "./entities/coffees.entity";
import { Flavour } from "./entities/flavours.entity";
import { COFFEE_BRANDS } from "./coffees.constants";
import coffeesConfig from "./config/coffees.config";
import {NotFoundException} from "@nestjs/common";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn()
})

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  let flavourRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: Connection, useValue: {} },
        { provide: getRepositoryToken(Coffee), useValue: createMockRepository() },
        { provide: getRepositoryToken(Flavour), useValue: createMockRepository() },
        { provide: COFFEE_BRANDS, useFactory: () => ["bru", "nescafe"] },
        { provide: coffeesConfig.KEY, useValue: {} }
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
    flavourRepository = module.get<MockRepository>(getRepositoryToken(Flavour));
    // service = module.resolve<CoffeesService>(CoffeesService); // if we want to retrieve request/transient scoped providers
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const id = '1';
        const expectedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(id);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const id = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(id);
        } catch(err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${id} not found`)
        }
      });
    });
  });
});
