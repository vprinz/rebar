export interface PermissionsDocumentMixin {
    /**
     * The permissions associated with this document.
     * @type {string[]}
     */
    permissions?: string[];
}

export interface GroupsDocumentMixin {
    /**
     * The groups associated with this document.
     * @type {string[]}
     */
    groups?: string[];
}

export type Permission = string | string[] | PermissionLogic;
type PermissionLogic = AndPermission | OrPermission;
type AndPermission = { and: Permission[] };
type OrPermission = { or: Permission[] };

export type Group = string | string[] | GroupLogic;
type GroupLogic = AndGroup | OrGroup;
type AndGroup = { and: Group[] };
type OrGroup = { or: Group[] };

export interface PermissionOptions {
    /**
     * Permissions required to access this entity.
     *
     * @type {Permission}
     */
    permissions?: Permission;

    /**
     * Groups required to access this command.
     * @type {Group}
     */
    groups?: Group;
}
