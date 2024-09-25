import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import subscription from './subscription.entity';
import twitchGuild from './twitchGuilds.entity';
import { APIEmbed, } from 'discord.js';

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
    embed?: APIEmbed;

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
