<template>
  <div class="provider-card">
    <h2>{{ provider.name }}</h2>
    <div class="status-wrapper">
      <span class="status"></span>
      <span>Disconnected</span>
    </div>
    <button @click="connect(provider)">
      Connect
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ProviderCard',
  props: {
    provider: Object,
    connector: Object
  },
  setup({connector}: { connector: any }) {
    const connect = async (provider: any) => {
      const res = await provider.connect()
      console.log("connected", connector.provider.provider)
    }

    return {connect}
  }
});
</script>

<style scoped>
.provider-card {
  width: 100%;
  max-width: 320px;
  padding: 16px;
  border: 1px solid black;
  border-radius: 16px;
  margin: 16px;
}

h2 {
  margin: 0 0 16px;
  font-size: 18px;
}

.status-wrapper {
  display: flex;
  align-items: center;
}

.status {
  display: block;
  border: 1px solid lightgray;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

button {
  display: block;
  margin: 32px 0 0;
  padding: 8px 4px;
  width: 100%;
  border: none;
  background-color: lightgray;
  cursor: pointer;
}
</style>
