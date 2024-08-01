import { Column, Entity, PrimaryGeneratedColumn, Unique, } from 'typeorm';

@Entity()
@Unique('uniqTempCreatorGuildChannel', ['channelId', 'guildId'])
export default class voiceCreator {
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
        nullable: true,
    })
    catId?: string;

    @Column({
        type: 'varchar',
    })
    channelName: string;

    @Column({
        type: 'int',
    })
    limit: number;
};
