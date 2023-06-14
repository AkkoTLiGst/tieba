<template>
    <view class="userInfo">
        
    </view>
</template>

<script setup lang="ts">
import { loginStore } from '@/store/login';
const user = loginStore();
console.log(user);


</script>

<style scoped lang="scss">
.userInfo{
    width: 100%; 
    height: 280px;
    color: red;
    background-color: white;
}
</style>