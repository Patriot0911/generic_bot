import { Column, Entity, PrimaryGeneratedColumn, Unique, } from 'typeorm';

@Entity()
@Unique('uniqCreatorGuildChannel', ['channelId', 'guildId'])
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

    @Column({
        type: 'varchar',
    })
    channelName: string;

    @Column({
        type: 'int',
    })
    limit: number;
};
