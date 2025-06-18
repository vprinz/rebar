import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { EventResult } from '@Shared/types/eventResult.js';

import { AuthEvents } from '../shared/authEvents.js';
import { Account } from '@Shared/types/account.js';

const Rebar = useRebar();
const ServerConfig = Rebar.useServerConfig();
const db = Rebar.database.useDatabase();

const loginCallbacks: Array<(player: alt.Player) => void> = [];
const loggedInPlayers: Map<number, string> = new Map<number, string>();

type AccountData = { token: string } & Account;

async function handleConnect(player: alt.Player) {
    const didLogin = await tryRememberMe(player);
    if (!didLogin) {
        Rebar.player.useWebview(player).show('Auth', 'page');
    }

    player.dimension = player.id + 1;
    ServerConfig.set('hideMinimapInPage', true);
    player.emit(AuthEvents.toClient.cameraCreate);
    Rebar.player.useNative(player).invoke('triggerScreenblurFadeIn', 1000);
}

async function handleDisconnect(player: alt.Player) {
    delete loggedInPlayers[player.id];
}

function setAccount(player: alt.Player, account: Account) {
    Rebar.document.account.useAccountBinder(player).bind(account);
    Rebar.player.useWebview(player).hide('Auth');
    loggedInPlayers[player.id] = account._id;
    for (let cb of loginCallbacks) {
        cb(player);
    }
}

async function handleRegister(player: alt.Player, email: string, password: string): Promise<EventResult> {
    console.log(email, password);
    let account = await db.get<Account>({ email }, Rebar.database.CollectionNames.Accounts);
    if (account) {
        return { success: false, error: 'Account already exists' };
    }

    const _id = await db.create<Partial<Account>>(
        { email, password: Rebar.utility.password.hash(password) },
        Rebar.database.CollectionNames.Accounts,
    );
    if (!_id) {
        return { success: false, error: 'Account creation failed' };
    }

    account = await db.get<Account>({ _id }, Rebar.database.CollectionNames.Accounts);
    if (!account) {
        return { success: false, error: 'Account not found after creation' };
    }

    setAccount(player, account);

    return { success: true };
}

async function handleLogin(
    player: alt.Player,
    email: string,
    password: string,
    rememberMe: boolean,
): Promise<EventResult> {
    const account = await db.get<Account>({ email }, Rebar.database.CollectionNames.Accounts);
    if (!account) {
        return { success: false, error: 'Account not found' };
    }

    if (!Rebar.utility.password.check(password, account.password)) {
        return { success: false, error: 'Invalid password' };
    }

    if (Object.values(loggedInPlayers).includes(account._id)) {
        return { success: false, error: 'Account already logged in' };
    }

    if (rememberMe) {
        await updateRememberMe(player, account._id);
    }

    setAccount(player, account);

    return { success: true };
}

function getHash(player: alt.Player) {
    return Rebar.utility.sha256(
        player.ip + player.hwidHash + player.hwidExHash + player.socialID + player.socialClubName,
    );
}

async function tryRememberMe(player: alt.Player): Promise<boolean> {
    const token = getHash(player);
    const account = await db.get<AccountData>({ token }, Rebar.database.CollectionNames.Accounts);
    if (!account) {
        return false;
    }

    setAccount(player, account);
    return true;
}

async function updateRememberMe(player: alt.Player, _id: string) {
    await db.update<AccountData>({ _id, token: getHash(player) }, Rebar.database.CollectionNames.Accounts);
}

alt.on('playerConnect', handleConnect);
alt.on('playerDisconnect', handleDisconnect);

alt.onRpc(AuthEvents.toServer.register, handleRegister);
alt.onRpc(AuthEvents.toServer.login, handleLogin);

export function useAuth() {
    function onLogin(callback: (player: alt.Player) => void) {
        loginCallbacks.push(callback);
    }

    return {
        onLogin,
    };
}

declare global {
    export interface ServerPlugin {
        ['auth-api']: ReturnType<typeof useAuth>;
    }
}

Rebar.useApi().register('auth-api', useAuth());
