// ________TemplateDTO____________

export interface TemplateDTO {
  response: {
    id: string;
    definition: {
      page_configuration: PageConfigurationDTO;
      definition_version: string;
      min_dpi: number;
      template_type: string; // "print" | 'photobook' | "smsbook"
      asset_definitions: any[]; //TODO: исправть потом как будет asset_definitions
      category_definitions: any[]; //TODO: исправть потом как будет category_definitions
      color_definitions: ColorDefinitionDTO[];
      font_definitions: FontDefinitionDTO[];
      option_definitions: OptionDefinitionDTO[];
      page_definitions: PageDefinitionDTO[];
      presentation_definitions: PresentationDefinitionDTO[];
      shape_definitions: any[];
      tag_definitions: any[];
    };
  };
}

export interface PageConfigurationDTO {
  filter_type_definitions: {
    key: string;
    default_page_key: string;
    localized_description: string;
  };
  force_pack_color: boolean;
  link_in_content: boolean;
  increment: boolean;
  forced_layouts_filter_type_keys: string[];
  next_filter_type_keys: string[];
}

export interface ColorDefinitionDTO {
  key: string;
  font_colors: FontColorDTO[];
  theme_value: string;
  tint_colors: any[]; //TODO: исправть потом как будет tint colors
  background_value: string;
}
export interface FontColorDTO {
  key: string;
  value: string;
}

export interface FontDefinitionDTO {
  key: string;
  font_tag: string;
  width_per_height_mean_char_ratio: number;
}

export interface OptionDefinitionDTO {
  key: string;
  type: string;
  option_tag: string;
  only_global: boolean;
  icon_asset_key: string;
  option_choices: OptionChoiceDTO[];
  localized_option_title: string;
}
export interface OptionChoiceDTO {
  value: string;
  asset_key: string;
  localized_label: string;
}

export interface PageDefinitionDTO {
  category_key: string;
  filter_type_keys: string[];
  height_dmm: number;
  width_dmm: number;
  key: string;
  type: string;
  color_keys: string[];
  elements: ElementDTO[];
}

export interface ElementDTO {
  key: string;
  type: string;
  order: number;
  x_dmm: number;
  y_dmm: number;
  z_index: number;
  width_dmm: number;
  height_dmm: number;
  anchor_page: string[];
  anchor_self: string[];
  font_keys?: string[];
  text_align?: string[];
  font_size_dmm?: number;
  font_color_key?: string;
  line_height_dmm?: number;
  text_orientation?: number;
  localized_placeholder?: string;
}

export interface PresentationDefinitionDTO {
  key: string;
  asset_key: string;
  width_dmm: number;
  height_dmm: number;
  content_x_dmm: number;
  content_y_dmm: number;
}

// ______Template________

export interface Template {
  id: string;
  definition: {
    pageConfiguration: PageConfiguration;
    definitionVersion: string;
    minDpi: number;
    templateType: string; // "print" | 'photobook' | "smsbook"
    assetDefinitions: any[]; //TODO: исправть потом как будет asset_definitions
    categoryDefinitions: any[]; //TODO: исправть потом как будет category_definitions
    colorDefinitions: ColorDefinition[];
    fontDefinitions: FontDefinition[];
    optionDefinitions: OptionDefinition[];
    pageDefinitions: PageDefinition[];
    presentationDefinitions: PresentationDefinition[];
    shapeDefinitions: any[];
    tagDefinitions: any[];
  };
}

export interface PageConfiguration {
  filterTypeDefinitions: {
    key: string;
    defaultPageKey: string;
    localizedDescription: string;
  };
  forcePackColor: boolean;
  linkInContent: boolean;
  increment: boolean;
  forcedLayoutsFilterTypeKeys: string[];
  nextFilterTypeKeys: string[];
}

export interface ColorDefinition {
  key: string;
  fontColors: FontColor[];
  themeValue: string;
  tintColors: any[]; //TODO: исправть потом как будет tint colors
  backgroundValue: string;
}
export interface FontColor {
  key: string;
  value: string;
}

export interface FontDefinition {
  key: string;
  fontTag: string;
  widthPerHeightMeanCharRatio: number;
}

export interface OptionDefinition {
  key: string;
  type: string;
  optionTag: string;
  onlyGlobal: boolean;
  iconAssetKey: string;
  optionChoices: OptionChoice[];
  localizedOptionTitle: string;
}
export interface OptionChoice {
  value: string;
  assetKey: string;
  localizedLabel: string;
}

export interface PageDefinition {
  categoryKey: any;
  filterTypeKeys: string[];
  heightDmm: number;
  widthDmm: number;
  key: string;
  type: string;
  colorKeys: string[];
  elements: Element[];
}

export interface Element {
  key: string;
  type: string;
  order: number;
  xDmm: number;
  yDmm: number;
  zIndex: number;
  widthDmm: number;
  heightDmm: number;
  anchorPage: string[];
  anchorSelf: string[];
  fontKeys?: string[];
  textAlign?: string[];
  fontSizeDmm?: number;
  fontColorKey?: string;
  lineHeightDmm?: number;
  textOrientation?: number;
  localizedPlaceholder?: string;
}

export interface PresentationDefinition {
  key: string;
  assetKey: string;
  widthDmm: number;
  heightDmm: number;
  contentXdmm: number;
  contentYdmm: number;
}

function mapTemplateDTO(dto: TemplateDTO): Template {
  const definition = dto.response.definition;
  return {
    id: dto.response.id,
    definition: {
      pageConfiguration: mapPageConfigurationDTO(definition.page_configuration),
      definitionVersion: definition.definition_version,
      minDpi: definition.min_dpi,
      templateType: definition.template_type,
      assetDefinitions: definition.asset_definitions, //TODO: исправть потом как будет asset_definitions - сделать map
      categoryDefinitions: definition.category_definitions, //TODO: исправть потом как будет category_definitions - сделать map
      colorDefinitions: definition.color_definitions.map((dto) =>
        mapColorDefinitionDTO(dto)
      ),
      fontDefinitions: definition.font_definitions.map((dto) =>
        mapFontDefinitionDTO(dto)
      ),
      optionDefinitions: definition.option_definitions.map((dto) =>
        mapOptionDefinitionDTO(dto)
      ),
      pageDefinitions: definition.page_definitions.map((dto) =>
        mapPageDefinitionDTO(dto)
      ),
      presentationDefinitions: definition.presentation_definitions.map((dto) =>
        mapPresentationDefinitionDTO(dto)
      ),
      shapeDefinitions: definition.shape_definitions,
      tagDefinitions: definition.tag_definitions,
    },
  };
}

function mapPageConfigurationDTO(dto: PageConfigurationDTO): PageConfiguration {
  return {
    filterTypeDefinitions: {
      key: dto.filter_type_definitions.key,
      defaultPageKey: dto.filter_type_definitions.default_page_key,
      localizedDescription: dto.filter_type_definitions.localized_description,
    },
    forcePackColor: dto.force_pack_color,
    linkInContent: dto.link_in_content,
    increment: dto.increment,
    forcedLayoutsFilterTypeKeys: dto.forced_layouts_filter_type_keys,
    nextFilterTypeKeys: dto.next_filter_type_keys,
  };
}

function mapColorDefinitionDTO(dto: ColorDefinitionDTO): ColorDefinition {
  return {
    key: dto.key,
    fontColors: dto.font_colors,
    themeValue: dto.theme_value,
    tintColors: dto.tint_colors, //TODO: исправть потом как будет tint colors - сделать map
    backgroundValue: dto.background_value,
  };
}

function mapFontDefinitionDTO(dto: FontDefinitionDTO): FontDefinition {
  return {
    key: dto.key,
    fontTag: dto.font_tag,
    widthPerHeightMeanCharRatio: dto.width_per_height_mean_char_ratio,
  };
}

function mapOptionDefinitionDTO(dto: OptionDefinitionDTO): OptionDefinition {
  return {
    key: dto.key,
    type: dto.type,
    optionTag: dto.option_tag,
    onlyGlobal: dto.only_global,
    iconAssetKey: dto.icon_asset_key,
    optionChoices: dto.option_choices.map((dto) => mapOptionChoiceDTO(dto)),
    localizedOptionTitle: dto.localized_option_title,
  };
}
function mapOptionChoiceDTO(dto: OptionChoiceDTO): OptionChoice {
  return {
    value: dto.value,
    assetKey: dto.asset_key,
    localizedLabel: dto.localized_label,
  };
}

function mapPageDefinitionDTO(dto: PageDefinitionDTO): PageDefinition {
  return {
    key: dto.key,
    categoryKey: dto.category_key,
    filterTypeKeys: dto.filter_type_keys,
    heightDmm: dto.height_dmm,
    widthDmm: dto.width_dmm,
    type: dto.type,
    colorKeys: dto.color_keys,
    elements: dto.elements.map((dto) => mapElementDTO(dto)),
  };
}

function mapElementDTO(dto: ElementDTO): Element {
  return {
    key: dto.key,
    type: dto.type,
    order: dto.order,
    xDmm: dto.x_dmm,
    yDmm: dto.y_dmm,
    zIndex: dto.z_index,
    widthDmm: dto.width_dmm,
    heightDmm: dto.height_dmm,
    anchorPage: dto.anchor_page,
    anchorSelf: dto.anchor_self,
    fontKeys: dto.font_keys ?? undefined,
    textAlign: dto.text_align ?? undefined,
    fontSizeDmm: dto.font_size_dmm ?? undefined,
    fontColorKey: dto.font_color_key ?? undefined,
    lineHeightDmm: dto.line_height_dmm ?? undefined,
    textOrientation: dto.text_orientation ?? undefined,
    localizedPlaceholder: dto.localized_placeholder ?? undefined,
  };
}

function mapPresentationDefinitionDTO(
  dto: PresentationDefinitionDTO
): PresentationDefinition {
  return {
    key: dto.key,
    assetKey: dto.asset_key,
    widthDmm: dto.width_dmm,
    heightDmm: dto.height_dmm,
    contentXdmm: dto.content_x_dmm,
    contentYdmm: dto.content_y_dmm,
  };
}

// _____ContentDTO_____________

export interface ContentDTO {
  response: {
    id: string;
    definition: {
      definition_version: string;
      pages: PageDTO[];
      used_photos: UsedPhotoDTO[];
      template_type: string;
      status: string;
      template_id: string;
      print_quantities: PrintQuantityDTO[];
    };
  };
}

export interface PageDTO {
  key: string;
  color_key: string;
  filter_type_key: string;
  page_definition_key: string;
  editable_pictures: EditablePictureDTO[];
  editable_texts: EditableTextDTO[];
  videos: any[];
}

export interface EditablePictureDTO {
  filter_tag: string;
  photo_placement: {
    size: {
      width_dmm: number;
      height_dmm: number;
    };
    offset: {
      x_dmm: number;
      y_dmm: number;
    };
    rotation: number;
    placed_by: string;
    is_default: boolean;
  };
  selection_photo_key: string;
  editable_picture_key: string;
}

export interface EditableTextDTO {
  content: string;
  font_key: string;
  editable_text_key: string;
}

export interface UsedPhotoDTO {
  key: string;
  provider: string;
  width_px: number;
  fotom_key: string;
  height_px: number;
  provider_ref: string;
  creation_date: string;
}

export interface PrintQuantityDTO {
  page_key: string;
  quantity: number;
}

//_____Content___________

export interface Content {
  id: string;
  definition: {
    definitionVersion: string;
    pages: Page[];
    usedPhotos: UsedPhoto[];
    templateType: string;
    status: string;
    templateId: string;
    printQuantities: PrintQuantity[];
  };
}

export interface Page {
  key: string;
  colorKey: string;
  filterTypeKey: string;
  pageDefinitionKey: string;
  editablePictures: EditablePicture[];
  editableTexts: EditableText[];
  //videos: any[]; Не нужно
}

export interface EditablePicture {
  filterTag: string;
  photoPlacement: {
    size: {
      widthDmm: number;
      heightDmm: number;
    };
    offset: {
      xDmm: number;
      yDmm: number;
    };
    rotation: number;
    placedBy: string;
    isDefault: boolean;
  };
  selectionPhotoKey: string;
  editablePictureKey: string;
}

export interface EditableText {
  content: string;
  fontKey: string;
  editableTextKey: string;
}

export interface UsedPhoto {
  key: string;
  provider: string;
  widthPx: number;
  fotomKey: string;
  heightPx: number;
  providerRef: string;
  creationDate: string;
}

export interface PrintQuantity {
  pageKey: string;
  quantity: number;
}

function mapContentDTO(dto: ContentDTO): Content {
  const content = dto.response.definition;
  return {
    id: dto.response.id,
    definition: {
      definitionVersion: content.definition_version,
      pages: content.pages.map((page) => mapPageDTO(page)),
      usedPhotos: content.used_photos.map((usedPhoto) =>
        mapUsedPhotosDTO(usedPhoto)
      ),
      templateType: content.template_type,
      status: content.status,
      templateId: content.template_id,
      printQuantities: content.print_quantities.map((dto) =>
        mapPrintQuantityDTO(dto)
      ),
    },
  };
}

function mapPageDTO(dto: PageDTO): Page {
  return {
    key: dto.key,
    colorKey: dto.color_key,
    filterTypeKey: dto.filter_type_key,
    pageDefinitionKey: dto.page_definition_key,
    editablePictures: dto.editable_pictures.map((editablePicture) =>
      mapEditablePicturesDTO(editablePicture)
    ),
    editableTexts: dto.editable_texts.map((editableText) =>
      mapEditableTextDTO(editableText)
    ),
  };
}
function mapEditablePicturesDTO(dto: EditablePictureDTO): EditablePicture {
  return {
    filterTag: dto.filter_tag,
    photoPlacement: {
      size: {
        widthDmm: dto.photo_placement.size.width_dmm,
        heightDmm: dto.photo_placement.size.height_dmm,
      },
      offset: {
        xDmm: dto.photo_placement.offset.x_dmm,
        yDmm: dto.photo_placement.offset.y_dmm,
      },
      rotation: dto.photo_placement.rotation,
      placedBy: dto.photo_placement.placed_by,
      isDefault: dto.photo_placement.is_default,
    },
    selectionPhotoKey: dto.selection_photo_key,
    editablePictureKey: dto.editable_picture_key,
  };
}
function mapEditableTextDTO(dto: EditableTextDTO): EditableText {
  return {
    content: dto.content,
    fontKey: dto.font_key,
    editableTextKey: dto.editable_text_key,
  };
}

function mapUsedPhotosDTO(dto: UsedPhotoDTO): UsedPhoto {
  return {
    key: dto.key,
    provider: dto.provider,
    widthPx: dto.width_px,
    fotomKey: dto.fotom_key, //TODO зачем??
    heightPx: dto.height_px,
    providerRef: dto.provider_ref,
    creationDate: dto.creation_date,
  };
}

function mapPrintQuantityDTO(dto: PrintQuantityDTO): PrintQuantity {
  return {
    pageKey: dto.page_key,
    quantity: dto.quantity,
  };
}

export function createDefinitionsRepository(appFetch: typeof $fetch) {
  return {
    async getTemplate(projectId: string): Promise<Template> {
      const guestId = useAuthStore().guestId;

      const dto = await appFetch<TemplateDTO>(`/editor/${projectId}/template`, {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });

      return mapTemplateDTO(dto);
    },
    async getContent(projectId: string): Promise<Content> {
      const guestId = useAuthStore().guestId;
      const dto = await appFetch<ContentDTO>(`/editor/${projectId}/content`, {
        method: "GET",
        headers: guestId ? { "x-guest-id": guestId } : undefined,
      });
      return mapContentDTO(dto);
    },
  };
}
