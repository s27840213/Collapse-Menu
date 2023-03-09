<template lang="pug">
div(class="collapse-menu" ref="menu")
  slot
</template>

<script setup lang="ts"></script>

<style lang="scss">
.collapse-menu {
  box-sizing: border-box;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  opacity: 1;
}
</style>
