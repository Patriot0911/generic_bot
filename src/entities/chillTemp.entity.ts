import { Column, Entity, PrimaryGeneratedColumn, Unique, } from 'typeorm';

@Entity()
@Unique('uniqTempGuildChannel', ['channelId', 'guildId'])
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
