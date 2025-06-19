import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const Messenger = Rebar.messenger.useMessenger();

Messenger.commands.register({
    name: 'veh',
    desc: 'Spawn a vehicle in front of player',
    callback: async (player, model: string) => {
        const posInFrontOfPlayer = Rebar.utility.vector.getVectorInFrontOfPlayer(player, 5);
        new alt.Vehicle(model, posInFrontOfPlayer, alt.Vector3.zero);
    },
});

Messenger.commands.register({
    name: 'weapon',
    desc: 'Give a weapon to player',
    callback: async (player, model: string) => {
        await Rebar.player.useWeapon(player).add(model, 9999);
    },
});

Messenger.commands.register({
    name: 'pos',
    desc: 'Get player position',
    callback: async (player) => {
        alt.log(player.pos.toString());
    },
});

Messenger.commands.register({
    name: 'skin',
    desc: 'Change player skin',
    callback: async (player, model: string) => {
        await Rebar.player.useClothing(player).setSkin(model);
    },
});

Messenger.commands.register({
    name: 'tpwp',
    desc: 'Teleport player to waypoint',
    callback: async (player: alt.Player) => {
        const pos = await Rebar.player.useWaypoint(player).get();
        if (!pos) {
            return;
        }

        player.pos = pos;
    },
});

Messenger.commands.register({
    name: 'givemoney',
    desc: 'Give money to player',
    callback: async (player: alt.Player, currencyType: string, amount: string) => {
        const result = await Rebar.services.useCurrencyService().add(player, currencyType, Number(amount));
    },
});
