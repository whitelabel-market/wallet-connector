<template>
  <div class="card">
    <div class="card-header">
      <h2>Connection</h2>
    </div>

    <div class="card-body">
      <p>Easy access to the current connector state from the connection instance</p>
      <ConnectionCardTable :connection="connection"/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ConnectionCardTable from "@/components/ConnectionCardTable.vue";

export default defineComponent({
  name: 'ConnectionCard',
  components: {ConnectionCardTable},
  props: {
    connection: Object,
  },
});
</script>