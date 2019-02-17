<template>
    <PdfDemo v-bind:TestProps="MyData" />
</template>

<script>
import PdfDemo from './components/PdfDemo'

export default {
  name: 'App',
  data(){
    return {
      MyData:"You can also pass PDF data here!"
    }
  },
  components: {
    PdfDemo
  }
}
</script>

<style>
</style>
