import { useRebar } from '@Server/index.js';
import * as alt from 'alt-server';
import './commands.js';

const Rebar = useRebar();
const api = Rebar.useApi();
const groups = Rebar.permissions.usePermissionGroup();

const ADMIN_LIST = ['vokler98@gmail.com'];
const ADMIN_GROUP = 'admin';
const ADMIN_PERMISSIONS = ['veh'];

await groups.add(ADMIN_GROUP, {
    permissions: ADMIN_PERMISSIONS,
});

async function setupAdmin(player: alt.Player) {
    const account = Rebar.document.account.useAccount(player);
    if (!account.isValid()) return;

    const accountEmail = account.getField('email');
    const isInAdminList = ADMIN_LIST.includes(accountEmail);
    const isMemberOfAdminGroup = account.groups.memberOf(ADMIN_GROUP);

    if (isInAdminList && !isMemberOfAdminGroup) {
        await account.groups.add(ADMIN_GROUP);
    } else if (!isInAdminList && isMemberOfAdminGroup) {
        await account.groups.remove(ADMIN_GROUP);
    }
}

async function init() {
    await alt.Utils.waitFor(() => api.isReady('auth-api'), 30000);
    const auth = api.get('auth-api');
    auth.onLogin(setupAdmin);
}

await init();
