<template>
  <div class="connector-item">
    <div class="connector-item-header">
      <!--      <div class="connector-item-logo" v-html="provider.logo"></div>-->
      <h2>{{ connector.name }}</h2>
    </div>

    <div class="provider-item-body">
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
.connector-item {
  width: 100%;
  max-width: 364px;
  padding: 16px;
  border: 2px dashed #f3f3f3;
  border-radius: 4px;
  margin: 16px;
}

.connector-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.connector-item-body {
  margin-top: 16px;
}

.connector-item-logo {
  display: block;
  width: 1em;
  height: 1em;
  overflow: hidden;
}

h2 {
  display: block;
  font-size: 18px;
  margin: 0;
}

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
