import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const Messenger = Rebar.messenger.useMessenger();

Messenger.commands.register({
    name: 'veh',
    desc: '[model] - Create a vehicle',
    callback: async (player, model: string) => {
        const posInFrontOfPlayer = Rebar.utility.vector.getVectorInFrontOfPlayer(player, 5);
        new alt.Vehicle(model, posInFrontOfPlayer, alt.Vector3.zero);
    },
});
