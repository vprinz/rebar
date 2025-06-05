<script setup lang="ts">
import { computed, ref } from 'vue';
import AuthRegister from './components/AuthRegister.vue';
import AuthLogin from './components/AuthLogin.vue';

const pageMap = {
    login: AuthLogin,
    register: AuthRegister,
};

const currentPage = ref('login');

const currentPageComponent = computed(() => pageMap[currentPage.value]);

function navigateTo(page) {
    if (page in pageMap) currentPage.value = page;
}
</script>

<template>
    <div class="flex h-screen w-screen items-center justify-center overflow-hidden">
        <component :is="currentPageComponent" @navigate="navigateTo" />
    </div>
</template>
