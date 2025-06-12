<script lang="ts" setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { CharacterEvents } from '../../shared/characterEvents';
import { useEvents } from '@Composables/useEvents.js';
import { Character } from '@Shared/types/index.js';
import { EventResult } from '@Shared/types/eventResult.js';

const events = useEvents();

const defaultSkin = 'u_m_m_aldinapoli';
const selectedSkin = ref(defaultSkin);

const skins = [
    { name: 'u_m_m_aldinapoli', image: '/images/skins/u_m_m_aldinapoli.webp' },
    { name: 'ig_mrs_thornhill', image: '/images/skins/ig_mrs_thornhill.webp' },
    { name: 'player_one', image: '/images/skins/player_one.webp' },
    { name: 'u_f_m_promourn_01', image: '/images/skins/u_f_m_promourn_01.webp' },
    { name: 'u_m_y_caleb', image: '/images/skins/u_m_y_caleb.webp' },
];

const schema = yup.object().shape({
    firstName: yup
        .string()
        .required('First name is required')
        .matches(/^[a-zA-Z]+$/, 'Only latin letters allowed')
        .min(3, 'At least 3 characters'),
    lastName: yup
        .string()
        .required('Last name is required')
        .matches(/^[a-zA-Z]+$/, 'Only latin letters allowed')
        .min(3, 'At least 3 characters'),
});

const { handleSubmit, errors } = useForm({ validationSchema: schema });
const { value: firstName } = useField('firstName');
const { value: lastName } = useField('lastName');
const serverError = ref('');

function selectSkin(name: string) {
    selectedSkin.value = name;
}

const onSubmit = handleSubmit(async (values) => {
    const data: Pick<Character, 'name' | 'skin'> = {
        name: `${values.firstName} ${values.lastName}`,
        skin: selectedSkin.value,
    };
    const result: EventResult = await events.emitServerRpc(CharacterEvents.toServer.createCharacter, data);
    if (!result.success) {
        serverError.value = result.error || 'An error occurred while creating the character';
    }
});
</script>

<template>
    <h2 class="mb-6 text-center text-3xl font-semibold">Create Character</h2>
    <form @submit.prevent="onSubmit">
        <div class="mb-6 flex gap-4">
            <div class="form-control flex-1">
                <label class="label" for="firstName">
                    <span class="label-text">First Name</span>
                </label>
                <input
                    id="firstName"
                    v-model="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    class="input input-bordered"
                    required
                />
                <div v-if="errors.firstName" class="mt-2 text-xs text-red-500">{{ errors.firstName }}</div>
            </div>

            <div class="form-control flex-1">
                <label class="label" for="lastName">
                    <span class="label-text">Last Name</span>
                </label>
                <input
                    id="lastName"
                    v-model="lastName"
                    type="text"
                    placeholder="Enter you last name"
                    class="input input-bordered"
                    required
                />
                <div v-if="errors.lastName" class="mt-2 text-xs text-red-500">{{ errors.lastName }}</div>
            </div>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            <div
                v-for="skin in skins"
                :key="skin.name"
                @click="selectSkin(skin.name)"
                class="card bg-base-100 cursor-pointer border-2 shadow-md transition hover:shadow-xl"
                :class="{
                    'border-primary': selectedSkin === skin.name,
                    'border-transparent': selectedSkin !== skin.name,
                }"
            >
                <figure class="px-4 pt-4">
                    <img :src="skin.image" alt="Skin" class="h-40 object-contain" />
                </figure>
            </div>
        </div>

        <div class="overflow-x-auto">
            <div class="flex flex-col items-center gap-3">
                <div v-if="serverError" class="mb-2 text-center text-xs text-red-500">
                    {{ serverError }}
                </div>
                <button type="submit" class="btn btn-primary">Save and Spawn</button>
                <!--                FIXME: show correct list of character after returning back-->
                <!--                <button @click="$emit('navigate', 'character-list')" type="button" class="btn btn-sm btn-ghost">-->
                <!--                    Back-->
                <!--                </button>-->
            </div>
        </div>
    </form>
</template>
