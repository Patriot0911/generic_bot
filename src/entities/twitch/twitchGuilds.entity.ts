import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, } from 'typeorm';
import notificationMessage from './notification.entity';
import subscription from './subscription.entity';

export enum TwitchGuildPerms {
    ManageGuilds,
    Listen,
    None,
};

@Entity()
export default class twitchGuild {
    @PrimaryColumn({
        type: 'varchar',
        unique: true,
    })
    guildId: string;

    @Column({
        type: 'varchar',
    })
    defaultChannel: string;

    @Column({
        type: 'enum',
        enum: TwitchGuildPerms,
        default: TwitchGuildPerms.None,
    })
    permission: TwitchGuildPerms;

    @ManyToMany(() => subscription)
    @JoinTable()
    subscriptions: subscription[];

    @OneToMany(() => notificationMessage, (notificationMessage) => notificationMessage.guild)
    messages: notificationMessage[];
};
