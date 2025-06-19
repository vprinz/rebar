import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

const API_NAME = 'currency-api';
type CurrencyType = 'cash' | 'bank';

function useCurrency(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);

    if (!document.isValid()) return undefined;

    async function updateCurrency(type: CurrencyType, newAmount: number): Promise<boolean> {
        if (!['bank', 'cash'].includes(type)) return false;
        await document.set(type, newAmount);
        return true;
    }

    /**
     * Add a specific amount of currency to the player.
     *
     * @param {CurrencyType} type - The type of currency to add.
     * @param {number} amount
     * @returns {boolean} - Returns true if the operation was successful, false otherwise.
     */
    async function add(type: CurrencyType, amount: number): Promise<boolean> {
        if (amount <= 0) return false;

        const currentAmount = get(type);
        const amountChangedTo = Math.min(currentAmount + amount, Number.MAX_SAFE_INTEGER);

        return updateCurrency(type, amountChangedTo);
    }

    /**
     * Subtracts a given currency type from an amount.
     *
     * @param {CurrencyType} type - The type of currency to add.
     * @param {number} amount
     * @returns {boolean} - Returns true if the operation was successful, false otherwise.
     */
    async function subtract(type: CurrencyType, amount: number): Promise<boolean> {
        if (amount <= 0) return false;

        const currentAmount = get(type);
        if (currentAmount < amount) return false;

        const newAmount = currentAmount - amount;

        return updateCurrency(type, newAmount);
    }

    /**
     * Get the current amount of currency the player has.
     *
     * * @param {CurrencyType} type - The type of currency to get.
     * @returns {number}
     */
    function get(type: CurrencyType): number {
        const character = document.get();
        return character[type] || 0;
    }

    return {
        add,
        subtract,
        get,
    };
}

function useApi() {
    return {
        useCurrency,
    };
}

declare global {
    export interface ServerPlugin {
        [API_NAME]: ReturnType<typeof useApi>;
    }
}

Rebar.useApi().register(API_NAME, useApi());
