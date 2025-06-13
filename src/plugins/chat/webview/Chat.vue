<script lang="ts" setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { useEvents } from '@Composables/useEvents.js';
import { useMessenger } from '@Composables/useMessenger.js';
import ChatMessage from './components/ChatMessage.vue';
import { ChatConfig } from '../shared/config.js';
import { ChatEvents } from '../shared/chatEvents.js';

const events = useEvents();
const { messages, emit } = useMessenger();

const input = ref('');
const inputBox = ref<HTMLInputElement | null>(null);
const chatBox = ref<HTMLInputElement | null>(null);
const timestamp = ref(true);
const focused = ref(true);

const chatMessages = computed(() => {
    if (messages.value.length < ChatConfig.messagesPerPage) {
        return [...messages.value].reverse();
    }

    if (!focused.value) {
        return messages.value.slice(0, ChatConfig.messagesPerPage).reverse();
    }

    return [...messages.value].reverse();
});

function focus() {
    focused.value = true;
    inputBox.value.focus();

    nextTick(() => {
        const child = chatBox.value.children[chatBox.value.children.length - 1];
        if (!child) {
            return;
        }

        child.scrollIntoView({ behavior: 'instant' });
    });
}

function unfocus() {
    focused.value = false;
    inputBox.value.blur();
}

function send() {
    focused.value = false;
    inputBox.value.blur();

    if (input.value.length <= 0) {
        return;
    }

    emit(input.value);
    input.value = '';
}

onMounted(() => {
    events.on(ChatEvents.toWebview.focus, focus);
    events.on(ChatEvents.toWebview.unfocus, unfocus);
    events.on(ChatEvents.toWebview.send, send);
});
</script>

<template>
    <div class="fixed left-6 top-6 flex flex-col gap-6">
        <div
            class="flip-left flex max-h-[448px] min-h-[448px] min-w-[448px] max-w-[448px] flex-col gap-4 overflow-y-auto pl-3"
            ref="chatBox"
        >
            <ChatMessage v-for="(msg, idx) in chatMessages" :key="idx" :message="msg" :timestamp="timestamp" />
        </div>
        <div class="flex w-full flex-col gap-4">
            <label
                class="input input-bordered flex items-center gap-2"
                :class="focused ? ['opacity-85'] : ['opacity-0']"
            >
                <input
                    :max="ChatConfig.inputLength"
                    v-model="input"
                    ref="inputBox"
                    type="text"
                    class="grow"
                    placeholder="Write text"
                />
                <kbd class="kbd kbd-sm">Enter</kbd>
            </label>
        </div>
    </div>
</template>
