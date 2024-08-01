import { Column, Entity, PrimaryGeneratedColumn, Unique, } from 'typeorm';

@Entity()
@Unique('uniqTempChillGuildChannel', ['channelId', 'guildId'])
export default class chillTemp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    channelId: string;

    @Column({
        type: 'varchar',
    })
    guildId: string;
};
