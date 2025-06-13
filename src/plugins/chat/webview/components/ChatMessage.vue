<script lang="ts" setup>
import { computed } from 'vue';
import { Message } from '@Shared/types/message';
import { formatTimestamp } from '@Shared/utility/time';
// import { ChatConfig } from '../../shared/config';

const props = defineProps<{ message: Message; timestamp?: boolean }>();

const classes = computed(() => {
    const classesToAdd: string[] = [];

    switch (props.message.type) {
        case 'alert':
            classesToAdd.push('text-error');
            break;
        case 'warning':
            classesToAdd.push('text-warning');
            break;
        case 'system':
            classesToAdd.push('text-info');
            break;
        case 'info':
            classesToAdd.push('text-success');
            break;
        case 'player':
            classesToAdd.push('text-white');
            break;
    }

    return classesToAdd;
});

const content = computed(() => {
    const timestamp = formatTimestamp(props.message.timestamp);

    let content = props.timestamp ? `[${timestamp.hour}:${timestamp.minute}:${timestamp.second}]` : ``;

    if (props.message.type === 'player') {
        content += ' ' + props.message.author.replace('_', ' ') + ' says:';
    }

    content += ' ' + props.message.content;

    // if (content.length > ChatConfig.inputLength) {
    //     content = content.slice(0, ChatConfig.inputLength) + '...';
    // }

    return content;
});
</script>

<template>
    <div class="text-shadow font-bold tracking-wider" :class="classes">
        <span v-html="content"></span>
    </div>
</template>

<style scoped>
.text-shadow {
    text-shadow:
        0 -2px 2px rgba(0, 0, 0, 1),
        0 2px 2px rgba(0, 0, 0, 1),
        -2px 0 2px rgba(0, 0, 0, 1),
        2px 0 2px rgba(0, 0, 0, 1);
}
</style>
