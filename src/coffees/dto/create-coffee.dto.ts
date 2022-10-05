import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger";
export class CreateCoffeeDto {
    @ApiProperty({ description: 'Name of the coffee' })
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'Brand of the coffee' })
    @IsString()
    readonly brand: string;

    @ApiProperty({ description: 'Flavours of the coffee', example: ['caramel', 'chocolate'] })
    @IsString({ each: true })
    readonly flavours: string[];
}
