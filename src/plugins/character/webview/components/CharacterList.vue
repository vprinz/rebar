<script setup lang="ts">
import { ref } from 'vue';

import { Character } from '@Shared/types/index.js';
import { useEvents } from '@Composables/useEvents.js';
import { EventResult } from '@Shared/types/eventResult.js';

import { CharacterEvents } from '../../shared/characterEvents.js';

const events = useEvents();
const characters = ref<Character[]>([]);
const selectedCharacterId = ref<string>('');
const serverError = ref('');

function handlePopulateCharacters(_characters: Character[]) {
    characters.value = _characters;
}

async function spawnCharacter(characterId: number) {
    await events.emitServerRpc(CharacterEvents.toServer.spawnCharacter, characterId);
}

async function deleteCharacter() {
    console.log('Deleting character with ID:', selectedCharacterId.value);
    const result: EventResult = await events.emitServerRpc(
        CharacterEvents.toServer.deleteCharacter,
        selectedCharacterId.value,
    );
    if (!result.success) {
        serverError.value = 'An error occurred while deleting the character';
    }
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
}

events.on(CharacterEvents.toClient.populateCharacters, handlePopulateCharacters);
</script>

<template>
    <h2 class="mb-6 text-center text-3xl font-semibold">Select Character</h2>
    <div class="overflow-x-auto">
        <template v-if="characters.length">
            <table class="table">
                <!-- head -->
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="character in characters">
                        <th>
                            <label>
                                <input
                                    v-model="selectedCharacterId"
                                    :value="character._id"
                                    type="radio"
                                    class="radio"
                                />
                            </label>
                        </th>
                        <td>
                            <div class="flex items-center gap-3">
                                <div class="avatar placeholder">
                                    <div class="bg-neutral text-neutral-content w-12 rounded-full">
                                        <span>{{ getInitials(character.name) }}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold">{{ character.name }}</div>
                                </div>
                            </div>
                        </td>
                        <th>
                            <button @click="spawnCharacter(character.id)" class="btn btn-primary btn-xs">spawn</button>
                        </th>
                    </tr>
                </tbody>
            </table>
            <div v-if="serverError" class="mt-4 text-center text-xs text-red-500">{{ serverError }}</div>
            <div class="mt-4 flex justify-end gap-3">
                <button @click="$emit('navigate', 'character-create')" class="btn btn-ghost btn-sm">
                    Add new character
                </button>
                <button
                    @click="deleteCharacter"
                    :disabled="!selectedCharacterId"
                    class="btn btn-ghost btn-sm text-red-500"
                >
                    Delete
                </button>
            </div>
        </template>

        <template v-else>
            <div class="mb-2 flex flex-col items-center">
                <div class="mb-6 text-lg text-gray-500">You don't have any created characters yet</div>
                <button @click="$emit('navigate', 'character-create')" class="btn btn-primary btn-lg">
                    Create a character
                </button>
            </div>
        </template>
    </div>
</template>
