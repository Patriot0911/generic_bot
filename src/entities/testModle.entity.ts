import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

@Entity()
export default class testEnt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    text: string;

    @Column({
        type: 'varchar',
    })
    description: string;
};
