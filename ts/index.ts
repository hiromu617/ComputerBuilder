import { PartsType, PCParts } from './type';
import { constants } from './constants';

const init = () => {
  fetchDataAndAfterProcess('CPU');
  fetchDataAndAfterProcess('GPU');
  fetchDataAndAfterProcess('RAM');

  const HDDSSDSelect = document.getElementById(constants.HDD_SSD_SELECT) as HTMLSelectElement;
  HDDSSDSelect?.addEventListener('change', () => {
    if (HDDSSDSelect.value !== 'SSD' && HDDSSDSelect.value !== 'HDD') return;
    fetchDataAndAfterProcess(HDDSSDSelect.value);
  });

  const AddPcBtton = document.getElementById(constants.ADD_PC_BTN);
  AddPcBtton?.addEventListener('click', () => {
    console.log(constants.slectedModelsMap);
    if (constants.slectedModelsMap.size < 4) {
      alert('全て選択してください');
    }
  });
};

const fetchDataAndAfterProcess = (type: PartsType) => {
  console.log('fetch', type);
  fetch(constants.BASE_URL + `?type=${type.toLowerCase()}`)
    .then((res) => res.json())
    .then((data: PCParts[]) => {
      if (type === 'CPU') {
        const { BrandSet, BrandModelMap } = generateSetAndMap(data);
        const BrandSelect = document.getElementById(constants.CPU_BRAND_SELECT) as HTMLSelectElement;
        const ModelSelect = document.getElementById(constants.CPU_MODEL_SELECT) as HTMLSelectElement;

        setOption(Array.from(BrandSet), constants.CPU_BRAND_SELECT);

        BrandSelect?.addEventListener('change', () => {
          setOption(BrandModelMap.get(BrandSelect.value), constants.CPU_MODEL_SELECT);
        });
        // 選んだModelをMapにセットする
        ModelSelect?.addEventListener('change', () => {
          if (ModelSelect.value === '-') {
            constants.slectedModelsMap.delete(type);
            return;
          }
          const selectedModel = data.find((PCParts) => PCParts.Model === ModelSelect.value);
          if (!selectedModel) return;
          constants.slectedModelsMap.set(type, selectedModel);
        });
      } else if (type === 'GPU') {
        const { BrandSet, BrandModelMap } = generateSetAndMap(data);
        const BrandSelect = document.getElementById(constants.GPU_BRAND_SELECT) as HTMLSelectElement;
        const ModelSelect = document.getElementById(constants.GPU_MODEL_SELECT) as HTMLSelectElement;

        setOption(Array.from(BrandSet), constants.GPU_BRAND_SELECT);

        BrandSelect?.addEventListener('change', () => {
          setOption(BrandModelMap.get(BrandSelect.value), constants.GPU_MODEL_SELECT);
        });
        // 選んだModelをMapにセットする
        ModelSelect?.addEventListener('change', () => {
          if (ModelSelect.value === '-') {
            constants.slectedModelsMap.delete(type);
            return;
          }
          const selectedModel = data.find((PCParts) => PCParts.Model === ModelSelect.value);
          if (!selectedModel) return;
          constants.slectedModelsMap.set(type, selectedModel);
        });
      } else if (type === 'RAM') {
        const { BrandSet, BrandModelMap } = generateSetAndMap(data);
        const BrandSelect = document.getElementById(constants.RAM_BRAND_SELECT) as HTMLSelectElement;
        const ModelSelect = document.getElementById(constants.RAM_MODEL_SELECT) as HTMLSelectElement;
        const NumRamSelect = document.getElementById(constants.NUM_RAM_SELECT) as HTMLSelectElement;

        setOption(Array.from(BrandSet), constants.RAM_BRAND_SELECT);

        BrandSelect?.addEventListener('change', () => {
          if (NumRamSelect.value === '-' || BrandSelect.value === '-') return;
          const filteredRamModels = filterRamModels(BrandModelMap.get(BrandSelect.value), +NumRamSelect.value);
          setOption(filteredRamModels, constants.RAM_MODEL_SELECT);
        });
        NumRamSelect?.addEventListener('change', () => {
          if (NumRamSelect.value === '-' || BrandSelect.value === '-') return;
          const filteredRamModels = filterRamModels(BrandModelMap.get(BrandSelect.value), +NumRamSelect.value);
          setOption(filteredRamModels, constants.RAM_MODEL_SELECT);
        });

        // 選んだModelをMapにセットする
        ModelSelect?.addEventListener('change', () => {
          if (ModelSelect.value === '-') {
            constants.slectedModelsMap.delete(type);
            return;
          }
          const selectedModel = data.find((PCParts) => PCParts.Model === ModelSelect.value);
          if (!selectedModel) return;
          constants.slectedModelsMap.set(type, selectedModel);
        });
      } else if (type === 'HDD' || type === 'SSD') {
        const { BrandSet, BrandModelMap } = generateSetAndMap(data);
        const BrandSelect = document.getElementById(constants.STORAGE_BRAND_SELECT) as HTMLSelectElement;
        const ModelSelect = document.getElementById(constants.STORAGE_MODEL_SELECT) as HTMLSelectElement;
        const StorageSelect = document.getElementById(constants.STORAGE_SELECT) as HTMLSelectElement;
        const StorageSet = generateStorageSet(data);

        setOption(Array.from(StorageSet), constants.STORAGE_SELECT);
        setOption(Array.from(BrandSet), constants.STORAGE_BRAND_SELECT);

        BrandSelect?.addEventListener('change', () => {
          if (StorageSelect.value === '-' || BrandSelect.value === '-') return;
          const filteredStorageModels = filterStorageModels(BrandModelMap.get(BrandSelect.value), StorageSelect.value);
          setOption(filteredStorageModels, constants.STORAGE_MODEL_SELECT);
        });
        StorageSelect?.addEventListener('change', () => {
          if (StorageSelect.value === '-' || BrandSelect.value === '-') return;
          const filteredStorageModels = filterStorageModels(BrandModelMap.get(BrandSelect.value), StorageSelect.value);
          setOption(filteredStorageModels, constants.STORAGE_MODEL_SELECT);
        });

        // 選んだModelをMapにセットする
        ModelSelect?.addEventListener('change', () => {
          if (ModelSelect.value === '-') {
            constants.slectedModelsMap.delete(type);
            return;
          }
          const selectedModel = data.find((PCParts) => PCParts.Model === ModelSelect.value);
          if (!selectedModel) return;
          constants.slectedModelsMap.delete('HDD');
          constants.slectedModelsMap.delete('SSD');
          constants.slectedModelsMap.set(type, selectedModel);
        });
      }
    });
};
init();

// optionタグをarrayから生成,targetのHTMLに入れる
const setOption = (array: string[], target: string) => {
  const select = document.getElementById(target);
  if (!select) return;

  let html = `<option>-</option>`;
  array.map((v) => (html += `<option>${v}</option>`));
  select.innerHTML = html;
};

// 正規表現でRAMの本数を取り出し、絞り込む
const filterRamModels = (models: string[], num: number) => {
  return models.filter((model) => {
    const amount = model.match(/\dx/g);
    if (!amount) return;
    return +amount.toString().substring(0, 1) === num;
  });
};

// 正規表現でStorageを取り出し、絞り込む
const filterStorageModels = (models: string[], storage: string) => {
  return models.filter((model) => {
    const storageVal = model.match(/\d*[TG]B/g);
    if (!storageVal) return;
    return storageVal.toString() === storage;
  });
};

// PCParts[]からBrandのsetとBrandをkey、Modelをvalueのmapを返す
const generateSetAndMap = (data: PCParts[]) => {
  const BrandSet = new Set<string>(data.map((v) => v.Brand));
  const BrandModelMap = new Map();

  BrandSet.forEach((brand) => {
    const models = data.filter((v) => v.Brand === brand).map((v) => v.Model);
    BrandModelMap.set(brand, models);
  });

  return { BrandSet, BrandModelMap };
};

// PCPartsからStorageのsetを作成
const generateStorageSet = (data: PCParts[]) => {
  return new Set(
    data.map((v) => {
      const amount = v.Model.match(/\d*[TG]B/g);
      if (!amount) return;
      return amount.toString();
    })
  ) as Set<string>;
};
