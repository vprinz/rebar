<script setup lang="ts">
import { ref } from 'vue';
import { useEvents } from '@Composables/useEvents.js';
import { AuthResult } from '../../shared/types.js';
import { AuthEvents } from '../../shared/authEvents';

const events = useEvents();

const email = ref('');
const password = ref('');
const serverError = ref('');

const onSubmit = async () => {
    serverError.value = '';
    const result: AuthResult = await events.emitServerRpc(AuthEvents.toServer.login, email.value, password.value);
    if (!result.success) {
        serverError.value = result.error || 'Invalid email or password';
        return;
    }
};
</script>

<template>
    <form @submit.prevent="onSubmit" class="card bg-base-100 mx-auto w-full max-w-sm shadow-xl">
        <div class="card-body">
            <h2 class="card-title justify-center">Sign In</h2>
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
            </div>
            <div class="form-control mb-2">
                <label class="label" for="password">
                    <span class="label-text">Password</span>
                </label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="Your password"
                    class="input input-bordered"
                    required
                />
            </div>
            <div v-if="serverError" class="mb-2 text-center text-xs text-red-500">
                {{ serverError }}
            </div>
            <button class="btn btn-primary">Sign In</button>
            <button @click="$emit('navigate', 'register')" class="btn btn-ghost">Don't have an account?</button>
        </div>
    </form>
</template>
