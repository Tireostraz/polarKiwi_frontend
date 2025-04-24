<template>
  <div>
    <v-stage :config="stageConfig" ref="stage">
      <v-layer>
        <component
          v-for="(node, index) in nodes"
          :key="index"
          :is="getComponentType(node.type)"
          v-bind="getNodeConfig(node)"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  templateData: object;
  width?: number;
  height?: number;
}>();

const stage = ref(null);
const images = ref<Record<string, HTMLImageElement | null>>({});
const parsedData = ref<any>(null);

const stageConfig = computed(() => ({
  width: props.width || 800,
  height: props.height || 600,
}));

const nodes = computed(() => parsedData.value?.nodes || []);

const getComponentType = (type: string) => {
  return (
    {
      rect: "v-rect",
      text: "v-text",
      image: "v-image",
      circle: "v-circle",
      line: "v-line",
      path: "v-path",
    }[type] || null
  );
};

const getNodeConfig = (node: any) => {
  if (node.type === "image") {
    return {
      ...node.attrs,
      image: images.value[node.attrs.src] || null,
    };
  }
  return node.attrs;
};

const loadImage = async (url: string) => {
  if (!url || url === "placeholder") return null;
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

const parseTemplateData = async () => {
  parsedData.value =
    typeof props.templateData === "string"
      ? JSON.parse(props.templateData)
      : props.templateData;

  const imageNodes =
    parsedData.value.nodes?.filter((n: any) => n.type === "image") || [];
  for (const node of imageNodes) {
    const src = node.attrs?.src;
    if (src && !images.value[src]) {
      images.value[src] = await loadImage(src);
    }
  }
};

watch(() => props.templateData, parseTemplateData, { immediate: true });
</script>
