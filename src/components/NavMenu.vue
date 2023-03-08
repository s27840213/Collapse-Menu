<template lang="pug">
div(class="nav-menu")
  div(
    class="nav-menu__item"
    v-for="(item, index) in menu"
    :key="item.id"
    @click.stop="updateActiveItemId(item.id)"
  )
    div(:class="{ active: item.id === activeItemId }") {{ item.name }}
    nav-menu(
      v-if="item.items"
      v-show="item.id === activeItemId || index === currDepthActiveIndex"
      :menu="item.items"
      :depth="depth + 1"
      :openedIndexs="openedIndexs"
      :active-item-id="activeItemId"
      @update:activeItemId="(id) => updateActiveItemId(id)"
    )
</template>

<script setup lang="ts">
import type { IMenuItem } from '@/interface'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
  menu: {
    type: Array<IMenuItem>,
    required: true
  },
  activeItemId: {
    type: String,
    required: true
  },
  openedIndexs: {
    type: Array as () => Array<number>,
    required: true
  },
  depth: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['update:activeItemId'])

const currDepthActiveIndex = computed(() => {
  return props.openedIndexs[props.depth]
})

const updateActiveItemId = (id: string) => {
  emits('update:activeItemId', id == props.activeItemId ? '-' : id)
}
</script>

<style lang="scss">
.nav-menu {
  display: inline-flex;
  flex-direction: column;
  padding: 0;
  padding: 0.5em 1rem;

  &__item {
    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
