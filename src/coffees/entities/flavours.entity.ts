import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Coffee} from "./coffees.entity";

@Entity('flavours')
export class Flavour {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(
        type => Coffee,
        coffee => coffee.flavours,
    )
    coffees: Coffee[]
}
