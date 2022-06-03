<template>
  <table>
    <tr>
      <td>Id</td>
      <td>
        {{ connection.activeConnector?.id ?? 'None' }}
      </td>
    </tr>
    <tr>
      <td>Status</td>
      <td>
        <div class="status-wrapper">
          <span class="status" :style="{backgroundColor: wrapperColor[connectionStatus]}"></span>
          <span>{{ connectionStatus }}</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>Selected Address</td>
      <td>{{ connection.activeConnector?.selectedAccount ?? 'None' }}</td>
    </tr>
    <tr>
      <td>Error</td>
      <td>{{ connectionStatus === 'error' ? connection.activeConnector.error.message : 'None' }}</td>
    </tr>
    <tr>
      <td>Chain Id</td>
      <td>{{ connection.activeConnector?.chainId ?? 'None' }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';

export default defineComponent({
  name: 'ConnectionCardTable',
  props: {
    connection: Object,
  },
  setup({connection}) {
    const connectionStatus = computed(() => connection?.activeConnector?.status ?? 'disconnected')
    const wrapperColor = {
      disconnected: "#e5e5e5",
      loading: "#f0ad4e",
      connected: "#5cb85c",
      error: "#d9534f",
    }
    return {connectionStatus, wrapperColor}
  }
});
</script>