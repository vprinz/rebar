import { Commands } from '@Shared/data/commands.js';

export const Groups = {
    ADMIN: 'admin',
};

export const Permissions = {
    ADMIN: [Commands.VEH.name, Commands.WEAPON.name],
};
