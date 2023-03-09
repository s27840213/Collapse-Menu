<template lang="pug">
collapse-menu
  collapse-item(
    v-for="(item, index) in drinks"
    :activeItemId="activeItemId"
    :item="item"
    :itemIndex="index"
    :activeIdPath="activeIdPath"
    :depth="0"
    @update:activeItemId="(id: string) => updateActiveItemId(id)")
select(class="selector" v-model="activeItemId")
  option(v-for="[key, val] in drinksMap" :key="key" :value="key") {{ val.name }}
</template>

<script setup lang="ts">
import drinksJSON from '@/assets/json/data.json'
import { computed, onMounted, ref } from 'vue'
import CollapseItem from './components/CollapseItem.vue'
import CollapseMenu from './components/CollapseMenu.vue'
import type { DrinksMap, IMenuItem } from './interface'
// assume this to be static data
const drinks = ref<Array<IMenuItem>>(drinksJSON)

// recursively flatten the drinks array, and create a map for quick search
/**
 *
 * @param items - the array to be flatten
 * @param result - the result map we created
 * @param idPath - I don't know how to properly name this array Orz, this is used to record the active node in different depth
 *
 * for example, the depth 3 item is highlighted, we must make this item's ascendant parent node to be in open state
 */
const flatten = (
  items: Array<IMenuItem>,
  result: DrinksMap = new Map(),
  idPath: Array<string> = []
) => {
  for (let i = 0; i < items.length; i++) {
    const currItem = items[i]
    const currPath = [...idPath, currItem.id]
    result.set(currItem.id, { name: currItem.name, idPath: currPath })

    if (currItem.items) {
      flatten(currItem.items, result, currPath)
    }
  }

  return result
}
/**
 * @activeItemId - the current active item id
 */
const activeItemId = ref('none')

/**
 * @function updateActiveItemId - used to update the active item id, and record the id into local storage
 */
const updateActiveItemId = (id: string) => {
  activeItemId.value = id === activeItemId.value ? 'none' : id
  localStorage.setItem('activeItemId', activeItemId.value)
}

// when the app mounted, get the id from local storage and update the active item id
onMounted(() => {
  const id = localStorage.getItem('activeItemId')
  if (id) {
    activeItemId.value = id
  }
})

// assume this to be static data too
const drinksMap = new Map().set('none', { name: '-', idPath: [] })

// get the active item id from depth 0 to depth n (n is the depth of the active item)
const activeIdPath = computed(() => {
  return drinksMap.get(activeItemId.value)?.idPath
})

flatten(drinks.value, drinksMap)
</script>

<style scoped>
.selector {
  margin-top: 0.5rem;
  width: 120px;
}
</style>
