<template lang="pug">
div(class="nav-item" @click.stop="handleClickTrigger(item.id, itemIndex)")
  div(
    class="nav-item__trigger"
    :class="{ 'nav-item__trigger--active': item.id === activeItemId }"
    :style="triggerPadding")
    img(
      class="nav-item__arrow-icon"
      :class="{ 'nav-item__arrow-icon--rotated': isOpen, 'nav-item__arrow-icon--hidden': !item.items }"
      :src="arrowSvg")
    span {{ item.name }}
  collapse-menu(v-if="item.items")
    template(v-for="(subItem, index) in item.items")
      transition(
        name="accordion"
        @enter="transitionStart"
        @after-enter="transitionEnd"
        @before-leave="transitionStart"
        @after-leave="transitionEnd")
        collapse-item(
          v-show="isOpen"
          :item="subItem"
          :itemIndex="index"
          :activeItemId="activeItemId"
          :openedMenuIndexes="openedMenuIndexes"
          :depth="depth + 1"
          @update:activeItemId="(id) => updateActiveItemId(id)")
</template>

<script setup lang="ts">
import arrowSvg from '@/assets/arrow.svg'
import CollapseMenu from '@/components/CollapseMenu.vue'
import type { IMenuItem } from '@/interface'
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<IMenuItem>,
    required: true
  },
  itemIndex: {
    type: Number,
    required: true
  },
  activeItemId: {
    type: String,
    required: true
  },
  openedMenuIndexes: {
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
  return props.openedMenuIndexes[props.depth]
})

const isOpen = computed(() => {
  return (
    props.item.id === props.activeItemId ||
    props.itemIndex === currDepthActiveIndex.value
  )
})

const updateActiveItemId = (id: string) => {
  emits('update:activeItemId', id === props.activeItemId ? 'none' : id)
}

const handleClickTrigger = (id: string, index: number) => {
  emits(
    'update:activeItemId',
    checkIsOpen(id, index, props.depth) ? 'none' : id
  )
}
const checkIsOpen = (id: string, index: number, depth: number) => {
  return id === props.activeItemId || index === currDepthActiveIndex.value
}

const transitionStart = (el: HTMLElement) => {
  el.style.maxHeight = el.scrollHeight + 'px'
}
const transitionEnd = (el: HTMLElement) => {
  el.style.maxHeight = ''
}

const triggerPadding = computed(() => {
  return {
    padding: `0.25rem 0.5rem 0.25rem ${props.depth * 1}rem`
  }
})
</script>

<style lang="scss">
.nav-item {
  box-sizing: border-box;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  opacity: 1;

  &__trigger {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &--active {
      background-color: #dadada;
    }

    &:hover {
      background-color: #dadada;
    }
  }

  &__arrow-icon {
    // vertical center
    width: 1.5rem;
    height: 1.5rem;
    transition: 0.3s transform;

    &--rotated {
      transform: rotate(90deg);
    }

    &--hidden {
      visibility: hidden;
    }
  }

  .accordion-enter-active,
  .accordion-leave-active {
    will-change: max-height, opacity;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
  }

  .accordion-enter-from,
  .accordion-leave-to {
    max-height: 0 !important;
    opacity: 0;
  }
}
</style>
