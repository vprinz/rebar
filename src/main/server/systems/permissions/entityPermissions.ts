import * as alt from 'alt-server';
import { Group, Permission, PermissionOptions } from '@Shared/types/index.js';
import { usePermissions } from '@Server/systems/permissions/usePermissions.js';

function evaluateAccess(access: Permission | Group, hasAccess: (value: string) => boolean): boolean {
    if (!access) return false;

    if (typeof access === 'string') {
        return hasAccess(access);
    } else if (Array.isArray(access)) {
        return access.every((value) => hasAccess(value));
    } else if ('and' in access) {
        return access.and.every((value) => evaluateAccess(value, hasAccess));
    } else if ('or' in access) {
        return access.or.some((value) => evaluateAccess(value, hasAccess));
    }
    return false;
}

export function useEntityPermissions<T extends PermissionOptions>(entity: T) {
    function check(player: alt.Player): boolean {
        const permissions = usePermissions(player);
        const hasPerm = evaluateAccess(entity.permissions, (perm) => permissions.hasPermission(perm));
        const hasGroup = evaluateAccess(entity.groups, (group) => permissions.isInGroup(group));
        return hasPerm || hasGroup;
    }

    return { check };
}
