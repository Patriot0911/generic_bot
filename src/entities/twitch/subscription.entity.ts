import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import twitchGuild from './twitchGuilds.entity';
import notification from './notification.entity';

@Entity()
export default class subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    broadcaster_id: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    subscriptionId: string;

    @Column({
        type: 'varchar',
    })
    streamerName: string;

    @ManyToMany(() => twitchGuild)
    @JoinTable()
    guilds: twitchGuild[];

    @OneToMany(
        () => notification,
        (notificationMessage) => notificationMessage.subscription, {
           nullable: true
    })
    notifications: notification[];
};
