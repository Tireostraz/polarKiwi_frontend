<template>
  <ClientOnly>
    <div class="editor-canvas-wrapper">
      <div class="canvas-frame">
        <v-stage :config="{ width: settings.width, height: settings.height }">
          <v-layer>
            <template v-for="(node, index) in nodes" :key="index">
              <v-rect
                v-if="node?.type === 'rect'"
                :config="node.attrs"
                @click="() => $emit('select-node', node)"
                @dragmove="(e: KonvaEventObject<DragEvent>) => handleDragMove(e, index)"
              />
              <v-text
                v-else-if="node?.type === 'text'"
                :config="node.attrs"
                @click="() => $emit('select-node', node)"
                @dragmove="(e: KonvaEventObject<DragEvent>) => handleDragMove(e, index)"
              />
              <!-- <v-image
                v-else-if="node?.type === 'image'"
                :config="imageConfig(node.attrs)"
                @click="() => $emit('select-node', node)"
                @dragmove="(e: KonvaEventObject<DragEvent>) => handleDragMove(e, index)"
              /> -->
            </template>
          </v-layer>
        </v-stage>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ClientOnly } from "#components";
import type { KonvaEventObject } from "konva/lib/Node";

const emit = defineEmits(["select-node"]);

const props = defineProps<{
  settings: {
    width: number;
    height: number;
    type: string;
  };
  nodes: {
    type: string;
    attrs: Record<string, any>;
  }[];
}>();

function handleDragMove(e: KonvaEventObject<DragEvent>, index: number) {
  const shape = e.target;
  const node = props.nodes[index];
  const x = shape.x();
  const y = shape.y();
  const width = shape.width();
  const height = shape.height();

  const maxX = props.settings.width - width;
  const maxY = props.settings.height - height;

  shape.position({
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY)),
  });

  node!.attrs.x = shape.x();
  node!.attrs.y = shape.y();
}
</script>

<style scoped>
.editor-canvas-wrapper {
  padding: 20px;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  min-height: 600px;
}

.canvas-frame {
  background: white;
  border: 2px solid #007acc;
  padding: 10px;
}
</style>
