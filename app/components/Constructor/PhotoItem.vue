<script setup lang="ts">
import type { PhotoLayout } from "~/repository/layouts";

const props = defineProps<{
  photo: PhotoLayout;
}>();

const DPI = 300;
const withText = ref(false);

function mmToPx(mm: number, DPI: number): number {
  return (mm / 25.4) * DPI; //mm -> inch -> pixels
}
const stageWidth = mmToPx(props.photo.size.width, DPI);
const stageHeight = mmToPx(props.photo.size.height, DPI);

const scale = computed(() => {
  const maxWidth = 200;
  return maxWidth / stageWidth;
});
const stageSize = {
  width: stageWidth * scale.value,
  height: stageHeight * scale.value,
};

const textConfig = {
  x: 0,
  y:
    mmToPx(props.photo.size.height - props.photo.size.bottom / 2, DPI) *
    scale.value,
  text: "Ваш текст",
  fontSize: 18,
  fontFamily: "Calibri",
  fill: "#555",
  width: 200,
  align: "center",
};

const jsonData =
  '{"rectangle":{"x":20,"y":20,"width":100,"height":50,"fill":"rgb(204, 204, 204)"}}';
const data = JSON.parse(jsonData);

const rectData = {
  rectangle: {
    x: mmToPx(props.photo.size.top, DPI) * scale.value,
    y: mmToPx(props.photo.size.left, DPI) * scale.value,
    width:
      mmToPx(
        props.photo.size.width - props.photo.size.left - props.photo.size.right,
        DPI
      ) * scale.value,
    height:
      mmToPx(
        props.photo.size.height -
          props.photo.size.top -
          props.photo.size.bottom,
        DPI
      ) * scale.value,
    fill: "rgb(204, 204, 204)",
  },
};
const image = "";
</script>

<template>
  <div class="photo-canvas">
    <v-stage v-if="jsonData" :config="stageSize">
      <v-layer>
        <v-rect v-if="!image" :config="rectData.rectangle" />
        <v-text v-if="withText" :config="textConfig" />
      </v-layer>
    </v-stage>
  </div>
</template>

<style scoped>
.photo-canvas {
  border: solid 1px black;
}
.photo-canvas:hover {
  border: solid 1px rgb(72, 251, 72);
}
</style>
