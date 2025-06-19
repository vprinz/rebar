import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

type CurrencyType = 'cash' | 'bank';

Rebar.services.useServiceRegister().register('currencyService', {
    async add(player: alt.Player, type: CurrencyType, quantity: number) {
        if (quantity < 0) return false;

        const currentAmount = await this.get(player, type);
        const newAmount = Math.min(currentAmount + quantity, Number.MAX_SAFE_INTEGER);

        await Rebar.document.character.useCharacter(player).set(type, newAmount);
        return true;
    },
    async sub(player: alt.Player, type: CurrencyType, quantity: number) {
        if (quantity <= 0) return false;

        const currentAmount = await this.get(player, type);
        if (currentAmount < quantity) return false;

        const newAmount = currentAmount - quantity;
        await Rebar.document.character.useCharacter(player).set(type, newAmount);
        return true;
    },
    async has(player, type, quantity) {
        if (quantity <= 0) return false;
        const currentAmount = await this.get(player, type);
        return currentAmount >= quantity;
    },
    async get(player: alt.Player, type: CurrencyType) {
        const document = Rebar.document.character.useCharacter(player);
        return document.get()[type] || 0;
    },
});
