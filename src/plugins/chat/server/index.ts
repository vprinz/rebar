import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import * as Utility from '@Shared/utility/index.js';
import './api.js';

import { ChatConfig } from '../shared/config.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();

function handlePlayerMessage(player: alt.Player, msg: string) {
    for (let target of alt.Player.all) {
        if (!ChatConfig.globalChat && Utility.vector.distance2d(player.pos, target.pos) > ChatConfig.chatDistance) {
            continue;
        }

        if (!target.valid) {
            continue;
        }

        messenger.message.send(target, { type: 'player', content: msg, author: player.name });
    }
}

alt.on('rebar:playerSendMessage', handlePlayerMessage);
