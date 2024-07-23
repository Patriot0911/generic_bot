import { chillCreators } from "@/modules/commands/data/constants";
import isChillCreator from "@/modules/commands/data/isChillCreator";
import { ChannelType, VoiceState, } from "discord.js";

export default async function (oldState: VoiceState, newState: VoiceState) {
    if(!oldState.channel && !newState.channel)
        return;
    // || oldState.channel.members.size > 0
    if(newState.channel && isChillCreator(newState.guild.id, newState.channel.id)) {
        const channelParent = newState.channel.parent;
        const newChannel = await newState.guild.channels.create({
            name: 'new chillCreator',
            userLimit: 0,
            parent: channelParent,
            type: ChannelType.GuildVoice,
        });
        if(!newChannel)
            return;
        chillCreators.delete(`${newState.guild.id}:${newState.channel.id}`);
        chillCreators.set(`${newChannel.guild.id}:${newChannel.id}`, {});
        // if(!newState.member?.voice) // classic way
        //     return console.log('not in voice');
        // newState.member.voice.setChannel(newChannel);
    };
    if(
        oldState.channel && !isChillCreator(oldState.guild.id, oldState.channel.id)
    ) {
        oldState.channel.delete('Chill Temp Channel');
    };
};
