<template>
  <div>
    <v-stage :config="stageConfig" ref="stage">
      <v-layer>
        <component
          v-for="(node, index) in nodes"
          :key="index"
          :is="getComponentType(node.type)"
          :config="getNodeConfig(node)"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup>
const props = defineProps({
  templateData: {
    type: [Object, String],
    required: true,
  },
  width: {
    type: Number,
    default: 800,
  },
  height: {
    type: Number,
    default: 600,
  },
});

const stage = ref(null);
const images = ref({});
const parsedData = ref(null);

const stageConfig = computed(() => ({
  width: props.width,
  height: props.height,
}));

const nodes = computed(() => {
  if (!parsedData.value) return [];
  return parsedData.value.nodes || [];
});

const getComponentType = (type) => {
  const componentMap = {
    rect: "v-rect",
    text: "v-text",
    image: "v-image",
    circle: "v-circle",
    line: "v-line",
    path: "v-path",
  };
  return componentMap[type] || null;
};

const getNodeConfig = (node) => {
  if (node.type === "image") {
    return {
      ...node.attrs,
      image: images.value[node.attrs.src] || null,
    };
  }
  return node.attrs;
};

const loadImage = async (url) => {
  if (!url || url === "placeholder") return null;

  try {
    const img = new Image();
    img.src = url;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    return img;
  } catch (error) {
    console.error("Error loading image:", url, error);
    return null;
  }
};

const parseTemplateData = async () => {
  try {
    parsedData.value =
      typeof props.templateData === "string"
        ? JSON.parse(props.templateData)
        : props.templateData;

    // Preload images
    const imageNodes =
      parsedData.value.nodes?.filter((n) => n.type === "image") || [];
    for (const node of imageNodes) {
      if (node.attrs?.src && !images.value[node.attrs.src]) {
        images.value[node.attrs.src] = await loadImage(node.attrs.src);
      }
    }
  } catch (error) {
    console.error("Error parsing template data:", error);
  }
};

watch(() => props.templateData, parseTemplateData, { immediate: true });
</script>
