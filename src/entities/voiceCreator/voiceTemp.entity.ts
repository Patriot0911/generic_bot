import { Column, Entity, PrimaryGeneratedColumn, Unique, } from 'typeorm';

@Entity()
@Unique('uniqTempGuildChannel', ['channelId', 'guildId'])
export default class voiceTemp {
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

    @Column({
        type: 'varchar',
    })
    lastOwnerId: string;
};
