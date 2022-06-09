<template>
  <div class="status-indicator">
    <span class="status" :style="{backgroundColor: color}"></span>
    <span>{{ label }}</span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, toRefs} from 'vue';

export default defineComponent({
  name: 'StatusIndicator',
  props: {
    connected: Boolean,
    loading: Boolean,
    error: Boolean
  },
  setup(props) {

    const color = computed(() => props.error ? "#d9534f" : (
      props.connected ? "#5cb85c" : (props.loading ? "#f0ad4e" : "#e5e5e5")
    ))
    const label = computed(() => props.error ? "Error" : (
      props.connected ? "Connected" : (props.loading ? "Loading" : "Disconnected")
    ))

    return {color, label}
  }
});
</script>
<style scoped>
.status-indicator {
  display: flex;
  align-items: center;
  text-transform: capitalize;
}

.status {
  display: block;
  border-radius: 100%;
  width: 8px;
  height: 8px;
  margin-right: 4px;
}
</style>