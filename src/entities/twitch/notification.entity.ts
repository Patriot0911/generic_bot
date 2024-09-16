import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import twitchGuild from './twitchGuilds.entity';
import subscription from './subscription.entity';

@Entity()
export default class notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => twitchGuild, (twitchGuild) => twitchGuild.messages)
    guild: twitchGuild;

    @ManyToOne(() => subscription, (subscription) => subscription.notifications)
    subscription: subscription;

    @Column({
        type: 'json',
        nullable: true,
    })
    embed?: JSON;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    webhook?: string;
    // add tag restriction

    @Column({
        type: 'varchar',
        nullable: true,
    })
    channelId?: string;
};
