<script lang="ts" setup>
import { ref } from 'vue';
import { Message } from '@Shared/types/message';

import ChatMessage from './components/ChatMessage.vue';

const chatBox = ref<HTMLInputElement | null>(null);
const demoMessages: Message[] = [
    {
        type: 'player',
        author: 'Valera_Pavlikov',
        content: 'Привет! Как дела?',
        timestamp: Date.now(),
    },
    {
        type: 'system',
        author: '',
        content: 'Добро пожаловать на сервер!',
        timestamp: Date.now(),
    },
    {
        type: 'alert',
        author: '',
        content: 'Внимание! Сервер будет перезапущен через 5 минут.',
        timestamp: Date.now(),
    },
    {
        type: 'warning',
        author: '',
        content: 'У вас мало HP!',
        timestamp: Date.now(),
    },
    {
        type: 'info',
        author: '',
        content: 'Сегодня x2 опыт для новичков!',
        timestamp: Date.now(),
    },
];
</script>

<template>
    <div class="fixed left-6 top-6 flex flex-col gap-6">
        <div
            class="flip-left flex max-h-[448px] min-h-[448px] min-w-[448px] max-w-[448px] flex-col gap-4 overflow-y-auto pl-3"
            ref="chatBox"
        >
            <ChatMessage v-for="(msg, idx) in demoMessages" :key="idx" :message="msg" :timestamp="true" />
        </div>
        <div class="flex w-full flex-col gap-4">
            <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="Write text or /command" />
                <kbd class="kbd kbd-sm">Enter</kbd>
            </label>
        </div>
    </div>
</template>
