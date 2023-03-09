<template lang="pug">
div(class="nav-item" @click.stop="handleClickTrigger(item)")
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
          v-if="isOpen"
          :item="subItem"
          :itemIndex="index"
          :activeItemId="activeItemId"
          :activeIdPath="activeIdPath"
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
  activeIdPath: {
    type: Array as () => Array<string>,
    required: true
  },
  depth: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['update:activeItemId'])

const currDepthActiveId = computed(() => {
  return props.activeIdPath[props.depth]
})

/**
 * When the item is active and the sub item of the current item is active, set isOpen to true
 * How I check the sub item is active? Actually, I didn't check bcz when I flatten the drinks data,
 * I have record all the active in certain depth when the certain item is active
 */
const isOpen = computed(() => {
  return (
    props.item.id === props.activeItemId ||
    props.item.id === currDepthActiveId.value
  )
})

/**
 * The rule we update the activeItemId:
 * 1. if the click item isn't active, set its id to be activeItemId
 * 2. if not the 1 condition, make the parent item active, and if don't have parent item, make the activeItem to 'none'
 */
const updateActiveItemId = (id: string) => {
  emits(
    'update:activeItemId',
    id === props.activeItemId
      ? props.depth === 0
        ? 'none'
        : props.activeIdPath[props.depth - 1]
      : id
  )
}

const handleClickTrigger = (item: IMenuItem) => {
  /**
   * @Question does the item that doesn't have sub item could be highlighted?
   */
  // if (!item.items) {
  //   return
  // }
  emits(
    'update:activeItemId',
    checkIsOpen(item.id)
      ? props.depth === 0
        ? 'none'
        : props.activeIdPath[props.depth - 1]
      : item.id
  )
}
const checkIsOpen = (id: string) => {
  return id === props.activeItemId || id === currDepthActiveId.value
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
    display: fldex;
    align-items: center;
    box-sizing: border-box;
    &--active {
      background-color: #dadada;
    }

    &:hover {
      background-color: #e7e5e5;
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
