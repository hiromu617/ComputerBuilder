import { PartsType, PCParts } from './type';

export const constants = {
  BASE_URL: 'https://api.recursionist.io/builder/computers',
  CPU_BRAND_SELECT: 'cpu-brand-select',
  CPU_MODEL_SELECT: 'cpu-model-select',
  GPU_BRAND_SELECT: 'gpu-brand-select',
  GPU_MODEL_SELECT: 'gpu-model-select',
  NUM_RAM_SELECT: 'num-ram-select',
  RAM_BRAND_SELECT: 'ram-brand-select',
  RAM_MODEL_SELECT: 'ram-model-select',
  HDD_SSD_SELECT: 'hdd-ssd-select',
  STORAGE_SELECT: 'storage-select',
  STORAGE_MODEL_SELECT: 'storage-model-select',
  STORAGE_BRAND_SELECT: 'storage-brand-select',
  ADD_PC_BTN: 'add-pc-button',
  PC_CONTAINER: 'pc-container',
  slectedPartsMap: new Map<PartsType, PCParts>(null),
};
