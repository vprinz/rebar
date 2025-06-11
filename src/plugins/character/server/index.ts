import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { Character } from '@Shared/types/character.js';
import { CollectionNames } from '@Server/document/shared.js';

import { CharacterEvents } from '../shared/characterEvents.js';

const Rebar = useRebar();
const api = Rebar.useApi();
const db = Rebar.database.useDatabase();

async function showCharacterSelection(player: alt.Player) {
    const accDocument = Rebar.document.account.useAccount(player);
    if (!accDocument) {
        player.kick('Account not found');
        return;
    }

    const characters = await db.getMany<Character>(
        { account_id: accDocument.getField('_id') },
        CollectionNames.Characters,
    );

    const webview = Rebar.player.useWebview(player);
    webview.show('Character', 'page');
    webview.emit(CharacterEvents.toClient.populateCharacters, characters);
}

async function handleCharacterCreation(player: alt.Player, characterData: Character) {
    const accDocument = Rebar.document.account.useAccount(player);
    if (!accDocument) {
        player.kick('Account not found');
        return;
    }

    characterData.account_id = accDocument.getField('_id');
    characterData._id = alt.uuidv4();

    await db.insertOne(characterData, CollectionNames.Characters);
    player.emit(CharacterEvents.toClient.characterCreated, characterData);
}

async function init() {
    await alt.Utils.waitFor(() => api.isReady('auth-api'), 30000);
    const auth = api.get('auth-api');
    auth.onLogin(showCharacterSelection);

    alt.onRpc(CharacterEvents.toServer.createCharacter, handleCharacterCreation);
}

await init();
