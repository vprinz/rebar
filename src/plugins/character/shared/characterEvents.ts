export const CharacterEvents = {
    toServer: {
        createCharacter: 'character:event:create:',
        spawnCharacter: 'character:event:spawn:',
        deleteCharacter: 'character:event:delete:',
    },
    toClient: {
        populateCharacters: 'character:event:populate',
    },
};
