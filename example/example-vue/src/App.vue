<template>
  <div class="connection-wrapper" v-if="connection">
    <ConnectorCard v-for="connector in connection.connectors" :key="connector.id" :connector="connector"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import ConnectorCard from "@/components/ConnectorCard.vue";
import {Connection, Connectors} from "@whitelabel-solutions/wallet-connector"

export default defineComponent({
  name: 'App',
  components: {ConnectorCard},
  setup() {
    const appName = "wallet-connector-example-vue"
    const infuraId = "69b854375f754ababacab55f40fceca8"
    const chainId = 4
    const connection = ref<any>(null)

    onMounted(async () => {
      const options = {
        allowedChainIds: [chainId],
        cache: {
          enabled: true
        }
      }
      const connectors = []
      connectors[0] = Connectors.MetaMask()
      connectors[1] = Connectors.WalletConnect({infuraId})
      connectors[2] = Connectors.WalletLink({
        appName,
        rpcUrl: "https://mainnet.infura.io/v3/" + infuraId,
        chainId
      })
      connection.value = await Connection.init(options, connectors)
    })
    return {connection}
  }
});
</script>

<style>

#app {
  font-family: sans-serif;
}
</style>

<style scoped>
.connection-wrapper {
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  width: calc(100% - 32px);
  margin: 0 auto;
}
</style>
