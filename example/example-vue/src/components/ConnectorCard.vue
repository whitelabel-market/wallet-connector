<template>
  <div class="card">
    <div class="card-header">
      <!--      <div class="connector-logo" v-html="provider.logo"></div>-->
      <h2>{{ connector.name }}</h2>
    </div>

    <div class="card-body">
      <ConnectorCardTable :connector="connector"/>
      <button @click="connector.connected ? connector.disconnect() : connect()">
        {{ label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue';
import ConnectorCardTable from "@/components/ConnectorCardTable.vue";
import {ChainIdNotAllowedError, type IConnectorWrapper} from "@whitelabel-solutions/wallet-connector";

export default defineComponent({
  name: 'ConnectorCard',
  components: {ConnectorCardTable},
  props: {
    connector: Object as PropType<IConnectorWrapper>,
  },
  setup({connector}) {
    const connect = async () => {
      await connector?.connect()
      if (connector?.error instanceof ChainIdNotAllowedError) {
        console.warn("Invalid Chainid")
      }
    }

    const label = computed(() => {
      return connector?.connected ? "Disconnect" :
        (connector?.loading ? "Loading" :
          (connector?.error ? "Try Again" : "Connect"))
    })

    return {connect, label}
  }
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
