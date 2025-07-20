<template>
  <div ref="cherryRef" class="cherry-wrapper" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Cherry from 'cherry-markdown'
import 'cherry-markdown/dist/cherry-markdown.css'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const cherryRef = ref(null)
let cherryInstance = null

onMounted(() => {
  cherryInstance = new Cherry({
    el: cherryRef.value,
    value: props.modelValue,
    toolbars: {
      theme: 'light',
      toolbar: ['bold', 'italic', 'header', '|', 'list', 'image', 'link', '|', 'preview', 'fullscreen']
    },
    callback: {
      afterChange: text => emit('update:modelValue', text)
    },
  //   el,
  // fileUpload: async (file, callback) => {
  //   const { data } = await $api.uploadFile(file)
  //   callback(data.url) // Cherry 会把 url 插入 ![上传成功](url)
  // }
  })
})

watch(() => props.modelValue, val => {
  if (cherryInstance && val !== cherryInstance.getValue()) {
    cherryInstance.setValue(val)
  }
})
</script>

<style scoped>
.cherry-wrapper {
  height: 100%;
  min-height: 400px;
}
</style>