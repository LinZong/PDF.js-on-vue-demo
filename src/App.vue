<template>
    <PdfDemo v-bind:TestProps="MyData" />
</template>

<script>
import PdfDemo from './components/PdfDemo'

export default {
  name: 'App',
  data(){
    return {
      MyData:"Hello!Data"
    }
  },
  components: {
    PdfDemo
  }
}
</script>

<style>
</style>
