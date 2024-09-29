import { playersArray_1, playersArray_2, playersArray_3, } from './players';
import { Collection, } from 'discord.js';
import { IBalanceUser } from './interfaces';

export const set1 = new Collection<string, IBalanceUser>(
    playersArray_1.map(
        item => [item.name, item]
    )
);

export const set2 = new Collection<string, IBalanceUser>(
    playersArray_2.map(
        item => [item.name, item]
    )
);

export const set3 = new Collection<string, IBalanceUser>(
    playersArray_3.map(
        item => [item.name, item]
    )
);
