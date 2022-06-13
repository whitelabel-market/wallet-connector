<template>
  <div v-if="connection">
    <div class="container">
      <div class="grid">
        <ConnectionCard :connection="connection" class="connection-card"/>
      </div>
      <div class="grid">
        <ConnectorCard v-for="connector in connection.connectors" :key="connector.id" :connector="connector"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import ConnectorCard from "@/components/ConnectorCard.vue";
import ConnectionCard from "@/components/ConnectionCard.vue";
import {
  CoinbaseWallet,
  Connection,
  IConnectorWrapper,
  MetaMask,
  WalletConnect
} from '@whitelabel-solutions/wallet-connector';
import detectProvider from "@metamask/detect-provider"
import WalletConnectProvider from '@walletconnect/web3-provider';
import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";

export default defineComponent({
  name: 'App',
  components: {ConnectionCard, ConnectorCard},
  setup() {
    const appName = "wallet-connector-example-vue"
    const infuraId = "69b854375f754ababacab55f40fceca8"
    const chainId = 1
    const options = {
      allowedChainIds: [chainId, 3],
      desiredChainOrChainId: chainId,
      cache: {
        enabled: true
      }
    }

    const connectors = [
      MetaMask({detectProvider}),
      WalletConnect({WalletConnectProvider, options: {infuraId}}),
      CoinbaseWallet({
        CoinbaseWalletSDK,
        options: {
          appName,
          rpcUrl: "https://mainnet.infura.io/v3/" + infuraId,
          chainId
        },
      })
    ]

    const connection = ref<Connection>(new Connection(options, connectors))

    connection.value.on("error", (error: any, connector: IConnectorWrapper) => {
      console.warn(error.message, connector)
    })

    connection.value.on("connect", (to: IConnectorWrapper, connector: IConnectorWrapper) => {
      console.log("Connect - to is a connector", to.chainId, connector)
    })


    connection.value.loadFromCache()
    return {connection}
  }
});
</script>

<style>
#app {
  font-family: sans-serif;
}

.card {
  padding: 16px;
  border: 2px dashed #f3f3f3;
  border-radius: 4px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-body {
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.2em;
}

.connector-logo {
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

table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

td, th {
  border: 2px solid #f3f3f3;
  text-align: left;
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

td:first-child {
  font-weight: bold;
  width: 50%;
}

td:last-child {
  width: 50%;
}
</style>

<style scoped>
.container {
  width: 100%;
  max-width: 1020px;
  padding: 16px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}
</style>
