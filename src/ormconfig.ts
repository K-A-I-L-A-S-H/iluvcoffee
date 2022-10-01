import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    migrationsTableName: 'migrations',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    // cli: {
    //     migrationsDir: 'src/migrations',
    // },
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource;

// npx typeorm migration:create src/migrations/Coffeerefactor
// npx typeorm migration:generate src/migrations/SchemaSync
// npx typeorm migration:run -d dist/ormconfig.js
// npx typeorm migration:revert -d dist/ormconfig.js
