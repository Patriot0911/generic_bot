import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

@Entity()
export default class chillCreator {
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
