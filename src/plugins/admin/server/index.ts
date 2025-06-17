import { useRebar } from '@Server/index.js';
import * as alt from 'alt-server';

const Rebar = useRebar();
const api = Rebar.useApi();
const groups = Rebar.permissions.usePermissionGroup();

const ADMIN_LIST = ['vprinz.me@gmail.com'];
const ADMIN_GROUP = 'admin';
const ADMIN_PERMISSIONS = ['id', 'pos', 'kick', 'ban'];

await groups.add(ADMIN_GROUP, {
    permissions: ADMIN_PERMISSIONS,
});

async function setupAdmin(player: alt.Player) {
    const account = Rebar.document.account.useAccount(player);
    if (!account.isValid()) {
        player.kick('Account not found');
        return;
    }

    const accountEmail = account.getField('email');
    if (ADMIN_LIST.includes(accountEmail) && !account.groups.memberOf(ADMIN_GROUP)) {
        account.groups.add(ADMIN_GROUP);
    }
}

async function init() {
    await alt.Utils.waitFor(() => api.isReady('auth-api'), 30000);
    const auth = api.get('auth-api');
    auth.onLogin(setupAdmin);
}

await init();
