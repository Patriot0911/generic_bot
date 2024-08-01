import { Column, Entity, PrimaryGeneratedColumn, Unique, } from 'typeorm';

@Entity()
@Unique('uniqChillCreatorGuildChannel', ['channelId', 'guildId'])
export default class chillCreator {
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
    channelName: string;

    @Column({
        type: 'int',
    })
    limit: number;
};
