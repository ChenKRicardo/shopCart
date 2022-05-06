<template>
  <div>
  <Card/>
  <Sale/>
  <Observe/>
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  components:{
    Card,
    Sale,
    Observe
  }
 
}
</script>

