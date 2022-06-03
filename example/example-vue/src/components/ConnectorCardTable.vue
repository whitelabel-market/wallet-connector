<template>
  <table>
    <tr>
      <td>Id</td>
      <td>{{ connector?.id }}</td>
    </tr>
    <tr>
      <td>Status</td>
      <td>
        <div class="status-wrapper">
          <span class="status" :style="{backgroundColor: wrapperColor[connector.status]}"></span>
          <span>{{ connector.status }}</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>Selected Address</td>
      <td>{{ connector?.selectedAccount ?? 'None' }}</td>
    </tr>
    <tr>
      <td>Error</td>
      <td>{{ connector.status === 'error' ? connector.error.message : 'None' }}</td>
    </tr>
    <tr>
      <td>Chain Id</td>
      <td>{{ connector?.chainId ?? 'None' }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';

export default defineComponent({
  name: 'ConnectorCardTable',
  props: {
    connector: Object,
  },
  setup() {
    const wrapperColor = {
      disconnected: "#e5e5e5",
      loading: "#f0ad4e",
      connected: "#5cb85c",
      error: "#d9534f",
    }
    return {wrapperColor}
  }
});
</script>