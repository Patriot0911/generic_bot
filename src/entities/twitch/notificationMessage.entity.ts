import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import twitchGuild from './twitchGuilds.entity';
import subscription from './subscription.entity';

@Entity()
export default class notificationMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => twitchGuild, (twitchGuild) => twitchGuild.messages)
    guild: twitchGuild;

    @ManyToOne(() => subscription, (subscription) => subscription.messages)
    subscription: subscription;

    @Column({
        type: 'json',
        nullable: true,
    })
    json: JSON;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    channelId?: string;
};
