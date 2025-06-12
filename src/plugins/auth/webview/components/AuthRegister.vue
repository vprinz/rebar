<script lang="ts" setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

import { useEvents } from '@Composables/useEvents.js';
import { EventResult } from '@Shared/types/eventResult.js';
import { AuthEvents } from '../../shared/authEvents';

const events = useEvents();

const schema = yup.object({
    email: yup.string().required('Email is required').email('Email must be valid'),
    password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
});

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');
const serverError = ref('');

const onSubmit = handleSubmit(async (values) => {
    serverError.value = '';

    const result: EventResult = await events.emitServerRpc(AuthEvents.toServer.register, values.email, values.password);
    if (!result.success) {
        serverError.value = result.error || 'An unknown error occurred';
        return;
    }
});
</script>

<template>
    <form @submit.prevent="onSubmit" class="card bg-base-100 mx-auto w-full max-w-sm shadow-xl">
        <div class="card-body">
            <h2 class="card-title justify-center">Sign Up</h2>
            <div class="form-control mb-2">
                <label class="label" for="email">
                    <span class="label-text">Email</span>
                </label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="Enter your email"
                    class="input input-bordered"
                    required
                />
                <div v-if="errors.email" class="mt-2 text-xs text-red-500">{{ errors.email }}</div>
            </div>
            <div class="form-control mb-2">
                <label class="label" for="password">
                    <span class="label-text">Password</span>
                </label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="Create a password"
                    class="input input-bordered"
                    required
                />
                <div v-if="errors.password" class="mt-2 text-xs text-red-500">{{ errors.password }}</div>
            </div>
            <div class="form-control mb-2">
                <label class="label" for="confirm-password">
                    <span class="label-text">Confirm Password</span>
                </label>
                <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    class="input input-bordered"
                    required
                />
                <div v-if="errors.confirmPassword" class="mt-2 text-xs text-red-500">{{ errors.confirmPassword }}</div>
            </div>
            <div v-if="serverError" class="mb-2 text-center text-xs text-red-500">
                {{ serverError }}
            </div>
            <button class="btn btn-primary">Create account</button>
            <button @click="$emit('navigate', 'login')" class="btn btn-ghost">I already have an account</button>
        </div>
    </form>
</template>
