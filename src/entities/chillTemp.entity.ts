import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

@Entity()
export default class chillTemp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
    })
    channelId: string;

    @Column({
        type: 'varchar',
    })
    guildId: string;
};
