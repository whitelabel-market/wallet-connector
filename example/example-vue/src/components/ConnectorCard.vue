<template>
  <div class="card">
    <div class="card-header">
      <!--      <div class="connector-logo" v-html="provider.logo"></div>-->
      <h2>{{ connector.name }}</h2>
    </div>

    <div class="card-body">
      <ConnectorCardTable :connector="connector"/>
      <button @click="connector.status === 'connected' ? connector.disconnect() : connector.connect()">
        {{ connector.status === 'connected' ? 'Disconnect' : 'Connect' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ConnectorCardTable from "@/components/ConnectorCardTable.vue";

export default defineComponent({
  name: 'ConnectorCard',
  components: {ConnectorCardTable},
  props: {
    connector: Object,
  },
});
</script>

<style scoped>
button {
  display: block;
  padding: 10px;
  margin-top: 16px;
  width: 100%;
  border: none;
  border-radius: 4px;
  background-color: #f3f3f3;
  cursor: pointer;
}
</style>
