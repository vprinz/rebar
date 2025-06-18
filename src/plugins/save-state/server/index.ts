import * as alt from 'alt-server';

import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
let isUpdatingPlayers = false;

function updatePlayers() {
    if (isUpdatingPlayers) {
        return;
    }

    isUpdatingPlayers = true;

    for (let player of alt.Player.all) {
        if (!player.valid) {
            continue;
        }

        const document = Rebar.document.character.useCharacter(player);
        if (!document.isValid()) {
            continue;
        }

        const ammo: { [key: string]: number } = {};
        for (let weapon of player.weapons) {
            ammo[weapon.hash] = player.getAmmo(weapon.hash);
        }

        Rebar.player.useWeapon(player).save();
        Rebar.player.useState(player).save();
    }

    isUpdatingPlayers = false;
}

alt.setInterval(updatePlayers, 5000);
