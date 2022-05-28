<template>
  <div class="provider-wrapper">
    <ProviderCard v-if="providers.length > 0" v-for="provider in providers" :key="provider.id" :connector="connector" :provider="provider"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue';
import ProviderCard from "@/components/ProviderCard.vue";
import {Connector, IProvider, Providers} from "@whitelabel-solutions/wallet-connector"

const {MetaMask, WalletConnect} = Providers
export default defineComponent({
  name: 'App',
  components: {ProviderCard},
  setup() {
    const providers = ref<any[]>([])
    const connector = ref<any>(null)

    onMounted(async () => {
      connector.value = await Connector.init({
        allowedChainIds: [1],
        cache: {key: "CACHED_PROVIDER", enabled: true}
      }, [MetaMask(), WalletConnect({})])
      providers.value = connector.value.providers
      console.log("connector.value.provider", connector.value.provider)
    })
    return {providers, connector}
  }
});
</script>

<style>
#app {
  font-family: sans-serif;
}
</style>

<style scoped>
.provider-wrapper {
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
}
</style>
