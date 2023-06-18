<template>
    <view class="enterBa">
        <recommended v-if="!user.isLogin"/>
        <follows v-if="user.isLogin"/>
    </view>
</template>

<script setup lang="ts">
import { loginStore } from '@/store/login'; 
import follows from './follows.vue';
import recommended from './recommended.vue';

const user = loginStore();

</script>

<style scoped lang="scss">
page{
    background-color: #f8f8f8;
}
</style>