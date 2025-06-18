import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { Character } from '@Shared/types/character.js';
import { CollectionNames } from '@Server/document/shared.js';
import { EventResult } from '@Shared/types/eventResult.js';

import { CharacterEvents } from '../shared/characterEvents.js';
import { AuthEvents } from '@Plugins/auth/shared/authEvents.js';

const Rebar = useRebar();
const api = Rebar.useApi();
const db = Rebar.database.useDatabase();

const defaultSpawnPosition = new alt.Vector3({ x: -864.1, y: -172.6, z: 37.8 });

async function showCharacterSelection(player: alt.Player) {
    const accDocument = getValidAccountOrKick(player);
    if (!accDocument) return;

    const characters = await accDocument.getCharacters();
    const webview = Rebar.player.useWebview(player);
    webview.show('Character', 'page');
    webview.emit(CharacterEvents.toClient.populateCharacters, characters);
}

async function handleCharacterCreation(
    player: alt.Player,
    characterData: Pick<Character, 'name' | 'skin'>,
): Promise<EventResult> {
    const accDocument = getValidAccountOrKick(player);
    if (!accDocument) return { success: false, error: 'Account not found' };

    const _id = await db.create<Character>(
        { account_id: accDocument.getField('_id'), name: characterData.name, skin: characterData.skin },
        CollectionNames.Characters,
    );
    if (!_id) {
        player.kick('Character creation failed');
        return { success: false, error: 'Character creation failed' };
    }

    await handleSpawnCharacter(player, _id);

    return { success: true };
}

async function handleSpawnCharacter(player: alt.Player, characterId: string | number): Promise<void> {
    const accDocument = getValidAccountOrKick(player);
    if (!accDocument.isValid()) return;

    const character = await accDocument.getCharacter(characterId);
    const spawnPosition = character.pos || defaultSpawnPosition;

    Rebar.document.character.useCharacterBinder(player).bind(character);
    Rebar.player.useWebview(player).hide('Character');
    Rebar.player.useNative(player).invoke('triggerScreenblurFadeOut', 1000);
    player.dimension = 0;
    player.spawn(spawnPosition);
    player.emit(AuthEvents.toClient.cameraDestroy);
}

async function handleDeleteCharacter(player: alt.Player, characterDocId: string): Promise<EventResult> {
    const result = await db.deleteDocument(characterDocId, CollectionNames.Characters);
    await showCharacterSelection(player);
    return { success: result };
}

function getValidAccountOrKick(player: alt.Player) {
    const accDocument = Rebar.document.account.useAccount(player);
    if (!accDocument.isValid()) {
        player.kick('Account not found');
        return undefined;
    }
    return accDocument;
}

async function init() {
    await alt.Utils.waitFor(() => api.isReady('auth-api'), 30000);
    const auth = api.get('auth-api');
    auth.onLogin(showCharacterSelection);

    alt.onRpc(CharacterEvents.toServer.createCharacter, handleCharacterCreation);
    alt.onRpc(CharacterEvents.toServer.spawnCharacter, handleSpawnCharacter);
    alt.onRpc(CharacterEvents.toServer.deleteCharacter, handleDeleteCharacter);
}

await init();
