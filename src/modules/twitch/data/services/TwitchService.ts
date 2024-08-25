import axios, { AxiosError, } from "axios";
import { callbackUrl } from "../constants";

// add validation for token
class TwitchService {
    static baseApiUrl = 'https://api.twitch.tv/helix';
    static clientId = process.env.TWITCH_CLIENT_ID;
    static token = process.env.TWITCH_TOKEN;

    constructor() {};

    private static getHeaders() {
        return {
            Authorization: `Bearer ${this.token}`,
            "Client-Id": this.clientId,
        };
    }

    static async getSubscriptionList() {
        const headers = this.getHeaders();
        try {
            const { data, } = await axios.get(
                `${this.baseApiUrl}/eventsub/subscriptions`, { headers, }
            );
            return {
                data,
            };
        } catch(e) {
            const { message, } = <AxiosError> e;
            return {
                message,
            };
        };
    };

    static async getStreamer(streamerName: string) {
        const headers = this.getHeaders();
        try {
            const {
                data,
            } = await axios.get(
                `${this.baseApiUrl}/search/channels?query=${streamerName}&first=1`, { headers, }
            );
            if(!data || data.data.lenght < 1)
                return {
                    message: 'Cannot find user',
                };
            return {
                data: data.data[0],
            };
        } catch(e) {
            const { message, } = <AxiosError> e;
            return {
                message,
            };
        };
    };

    static async callAddStreamer(broadcaster_user_id: string) {
        const headers = {
            ...this.getHeaders(),
            'Content-Type': 'application/json',
        };
        const data = {
            type: "stream.online",
            version: "1",
            condition: {
                broadcaster_user_id,
            },
            transport: {
                method: "webhook",
                callback: callbackUrl,
                secret: process.env.TWITCH_SECRET,
            },
        };
        try {
            const { data: resData, } = await axios.post(
                `${this.baseApiUrl}/eventsub/subscriptions`, data, { headers, }
            );
            return {
                data: resData,
            };
        } catch(e) {
            const { message, } = <AxiosError> e;
            return {
                message,
            };
        };
    };

    static async deleteSubscription(id: string) {
        const headers = this.getHeaders();
        try {
            const { data, } = await axios.delete(
                `${this.baseApiUrl}/eventsub/subscriptions?id=${id}`, { headers, }
            );
            return {
                data,
            };
        } catch(e) {
            const { message, } = <AxiosError> e;
            return {
                message,
            };
        };
    };
};

export default TwitchService;
