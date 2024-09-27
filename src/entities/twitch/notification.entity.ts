import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import subscription from './subscription.entity';
import twitchGuild from './twitchGuilds.entity';

@Entity()
export default class notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => twitchGuild, (twitchGuild) => twitchGuild.notifications)
    guild: twitchGuild;

    @ManyToOne(() => subscription, (subscription) => subscription.notifications)
    subscription: subscription;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    embed?: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    webhook?: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    channelId?: string;
};
