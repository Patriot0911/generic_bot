export interface IBalanceUser {
    name: string;
    roles: {
        tank?: number;
        damage?: number;
        support?: number;
    };
};
