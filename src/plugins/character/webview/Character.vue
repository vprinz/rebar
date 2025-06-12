<script setup lang="ts">
import { computed, ref } from 'vue';
import { CharacterList, CharacterCreate } from './components';

const defaultPage = 'character-list';
const currentPage = ref(defaultPage);

const pageMap = {
    'character-list': CharacterList,
    'character-create': CharacterCreate,
};

const currentPageComponent = computed(() => pageMap[currentPage.value]);

function navigateTo(page) {
    if (page in pageMap) currentPage.value = page;
}
</script>

<template>
    <div class="flex h-screen w-screen items-center justify-center overflow-hidden">
        <div class="rounded-box w-full max-w-3xl bg-white p-6 shadow-2xl">
            <component :is="currentPageComponent" @navigate="navigateTo" />
        </div>
    </div>
</template>
