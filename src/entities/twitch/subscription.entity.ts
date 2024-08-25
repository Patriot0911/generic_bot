import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import twitchGuild from './twitchGuilds.entity';
import notificationMessage from './notificationMessage.entity';

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

    @ManyToMany(() => twitchGuild)
    @JoinTable()
    guilds: twitchGuild[];

    @OneToMany(() => notificationMessage, (notificationMessage) => notificationMessage.subscription)
    messages: notificationMessage[];
};
