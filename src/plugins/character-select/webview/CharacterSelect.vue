<template>
    <div class="flex h-screen w-screen items-center justify-center overflow-hidden">
        <div class="rounded-box w-full max-w-3xl bg-white p-6 shadow-2xl">
            <h2 class="mb-6 text-center text-3xl font-semibold">Select Character</h2>

            <div class="overflow-x-auto">
                <table class="table">
                    <!-- head -->
                    <thead>
                        <tr>
                            <th>
                            </th>
                            <th>Name</th>
                            <th>Last active</th>
                            <th>Level</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- row 1 -->
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" class="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar placeholder">
                                        <div class="bg-neutral text-neutral-content w-12 rounded-full">
                                            <span>HH</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold">Hart Hagerty</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                May 31, 10:32
                            </td>
                            <td>13</td>
                            <th>
                                <button class="btn btn-primary btn-xs">spawn</button>
                            </th>
                        </tr>
                        <!-- row 2 -->
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" class="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar placeholder">
                                        <div class="bg-neutral text-neutral-content w-12 rounded-full">
                                            <span>BW</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold">Brice Swyre</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                June 7, 15:36
                            </td>
                            <td>4</td>
                            <th>
                                <button class="btn btn-primary btn-xs">spawn</button>
                            </th>
                        </tr>
                    </tbody>
                </table>
                <div class="flex justify-end gap-3 mt-4">
                    <button class="btn btn-ghost btn-sm">Add new character</button>
                    <button disabled class="btn btn-ghost btn-sm text-red-500">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>