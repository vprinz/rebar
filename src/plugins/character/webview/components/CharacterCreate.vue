<script lang="ts" setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const defaultPedModel = 'u_m_m_aldinapoli';
const selectedPedModel = ref(defaultPedModel);

const pedModels = [
    { name: 'u_m_m_aldinapoli', image: '/images/ped-models/u_m_m_aldinapoli.webp' },
    { name: 'ig_mrs_thornhill', image: '/images/ped-models/ig_mrs_thornhill.webp' },
    { name: 'player_one', image: '/images/ped-models/player_one.webp' },
    { name: 'u_f_m_promourn_01', image: '/images/ped-models/u_f_m_promourn_01.webp' },
    { name: 'u_m_y_caleb', image: '/images/ped-models/u_m_y_caleb.webp' },
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

function selectPedModel(name: string) {
    selectedPedModel.value = name;
}

const onSubmit = handleSubmit((values) => {
    const data = {
        skin: selectedPedModel.value,
        ...values,
    };
    console.log(data);
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
                v-for="pedModel in pedModels"
                :key="pedModel.name"
                @click="selectPedModel(pedModel.name)"
                class="card bg-base-100 cursor-pointer border-2 shadow-md transition hover:shadow-xl"
                :class="{
                    'border-primary': selectedPedModel === pedModel.name,
                    'border-transparent': selectedPedModel !== pedModel.name,
                }"
            >
                <figure class="px-4 pt-4">
                    <img :src="pedModel.image" alt="PedModel" class="h-40 object-contain" />
                </figure>
            </div>
        </div>

        <div class="overflow-x-auto">
            <div class="mt-4 flex flex-col items-center gap-3">
                <button type="submit" class="btn btn-primary">Save and Spawn</button>
                <button @click="$emit('navigate', 'character-list')" type="button" class="btn btn-sm btn-ghost">
                    Back
                </button>
            </div>
        </div>
    </form>
</template>
