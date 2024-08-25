import { Column, Entity, OneToMany, PrimaryColumn, } from 'typeorm';
import notificationMessage from './notificationMessage.entity';

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
        type: 'enum',
        enum: TwitchGuildPerms,
        default: TwitchGuildPerms.None,
    })
    permission: TwitchGuildPerms;

    @OneToMany(() => notificationMessage, (notificationMessage) => notificationMessage.guild)
    messages: notificationMessage[];
};
