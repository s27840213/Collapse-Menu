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
import { computed, onMounted, ref } from 'vue'
import CollapseItem from './components/CollapseItem.vue'
import CollapseMenu from './components/CollapseMenu.vue'
import type { DrinksMap, IMenuItem } from './interface'

// assume this to be static data
const drinks: Array<IMenuItem> = [
  {
    name: '好喝黑糖',
    id: '64f',
    items: [
      {
        name: '黑糖鮮奶',
        id: '445',
        items: [
          { name: '黑糖珍珠鮮奶', id: '37a' },
          { name: '黑糖芋圓鮮奶', id: 'feb' },
          { name: '黑糖蒟蒻鮮奶', id: '59c' }
        ]
      },
      {
        name: '黑糖冬瓜',
        id: '29e',
        items: [
          { name: '黑糖冬瓜牛奶', id: 'ac3' },
          { name: '黑糖冬瓜珍珠', id: 'ca0' }
        ]
      }
    ]
  },
  {
    name: '茶',
    id: '6c3',
    items: [
      { name: '烏龍綠', id: '5dc' },
      { name: '綠茶', id: 'b5f' },
      { name: '紅茶', id: 'b09' },
      { name: '青茶', id: '887' }
    ]
  },
  {
    name: '咖啡',
    id: 'c81',
    items: [
      {
        name: '黑咖啡',
        id: 'e02',
        items: [
          { name: '濃縮咖啡', id: 'd20' },
          { name: '美式咖啡', id: '1f8' }
        ]
      },
      {
        name: '牛奶咖啡',
        id: 'd7a',
        items: [
          {
            name: '拿鐵',
            id: 'c09',
            items: [
              { name: '黑糖拿鐵', id: 'db2' },
              { name: '榛果拿鐵', id: '9f6' },
              { name: '香草拿鐵', id: 'b61' }
            ]
          },
          { name: '卡布奇諾', id: '9ac' },
          { name: '摩卡', id: 'ce8' }
        ]
      }
    ]
  }
]

// recursively flatten the drinks array, and create a map for quick search
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

const activeItemId = ref('none')
const updateActiveItemId = (id: string) => {
  activeItemId.value = id === activeItemId.value ? 'none' : id
  localStorage.setItem('activeItemId', activeItemId.value)
}

onMounted(() => {
  const id = localStorage.getItem('activeItemId')
  console.log(localStorage.getItem('activeItemId'))
  if (id) {
    activeItemId.value = id
  }
})

// assume this to be static data too
const drinksMap = new Map().set('none', { name: '-', idPath: [] })

const activeIdPath = computed(() => {
  return drinksMap.get(activeItemId.value)?.idPath
})

flatten(drinks, drinksMap)
</script>

<style scoped>
.selector {
  margin-top: 0.5rem;
  width: 120px;
}
</style>
