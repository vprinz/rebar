import { useRebar } from '@Server/index.js';
import * as alt from 'alt-server';
import { Groups, Permissions } from '@Shared/data/permissions.js';
import { Commands } from '@Shared/data/commands.js';

const Rebar = useRebar();
const Messenger = Rebar.messenger.useMessenger();
const Group = Rebar.permissions.usePermissionGroup();

await Group.add(Groups.ADMIN, {
    permissions: Permissions.ADMIN,
});

Messenger.commands.register({
    name: Commands.VEH.name,
    desc: Commands.VEH.desc,
    options: {
        groups: [Groups.ADMIN],
    },
    callback: async (player, model: string) => {
        const posInFrontOfPlayer = Rebar.utility.vector.getVectorInFrontOfPlayer(player, 5);
        new alt.Vehicle(model, posInFrontOfPlayer, alt.Vector3.zero);
    },
});

Messenger.commands.register({
    name: Commands.WEAPON.name,
    desc: Commands.WEAPON.desc,
    options: {
        groups: [Groups.ADMIN],
    },
    callback: async (player, model: string) => {
        player.giveWeapon(model, -1, true);
    },
});

Messenger.commands.register({
    name: Commands.POS.name,
    desc: Commands.POS.desc,
    options: {
        groups: [Groups.ADMIN],
    },
    callback: async (player) => {
        alt.log(player.pos.toString());
    },
});

Messenger.commands.register({
    name: Commands.SKIN.name,
    desc: Commands.SKIN.desc,
    options: {
        groups: [Groups.ADMIN],
    },
    callback: async (player, model: string) => {
        player.model = model;
    },
});
