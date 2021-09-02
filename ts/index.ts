const config = {
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
  slectedModels: new Map<string, string>(null),
};

type PartsType = 'CPU' | 'GPU' | 'RAM' | 'HDD' | 'SSD';

type PCParts = {
  Type: PartsType;
  'Part Number': string;
  Brand: string;
  Model: string;
  Rank: number;
  Benchmark: number;
};

const init = () => {
  fetchDataAndAfterProcess('CPU');
  fetchDataAndAfterProcess('GPU');
  fetchDataAndAfterProcess('RAM');

  const HDDSSDSelect = document.getElementById(config.HDD_SSD_SELECT) as HTMLSelectElement;
  HDDSSDSelect?.addEventListener('change', () => {
    if (HDDSSDSelect.value !== 'SSD' && HDDSSDSelect.value !== 'HDD') return;
    fetchDataAndAfterProcess(HDDSSDSelect.value);
  });
};

const fetchDataAndAfterProcess = (type: PartsType) => {
  console.log('fetch', type);
  fetch(config.BASE_URL + `?type=${type.toLowerCase()}`)
    .then((res) => res.json())
    .then((data: PCParts[]) => {
      if (type === 'CPU') {
        const { BrandSet, BrandModelMap } = generateSetAndMap(data);
        const BrandSelect = document.getElementById(config.CPU_BRAND_SELECT) as HTMLSelectElement;

        setOption(Array.from(BrandSet), config.CPU_BRAND_SELECT);

        BrandSelect?.addEventListener('change', () => {
          setOption(BrandModelMap.get(BrandSelect.value), config.CPU_MODEL_SELECT);
        });
      } else if (type === 'GPU') {
        const { BrandSet, BrandModelMap } = generateSetAndMap(data);
        const BrandSelect = document.getElementById(config.GPU_BRAND_SELECT) as HTMLSelectElement;

        setOption(Array.from(BrandSet), config.GPU_BRAND_SELECT);

        BrandSelect?.addEventListener('change', () => {
          setOption(BrandModelMap.get(BrandSelect.value), config.GPU_MODEL_SELECT);
        });
      } else if (type === 'RAM') {
        const { BrandSet, BrandModelMap } = generateSetAndMap(data);
        const BrandSelect = document.getElementById(config.RAM_BRAND_SELECT) as HTMLSelectElement;
        const NumRamSelect = document.getElementById(config.NUM_RAM_SELECT) as HTMLSelectElement;

        setOption(Array.from(BrandSet), config.RAM_BRAND_SELECT);

        BrandSelect?.addEventListener('change', () => {
          if (NumRamSelect.value === '-' || BrandSelect.value === '-') return;
          const filteredRamModels = filterRamModels(BrandModelMap.get(BrandSelect.value), +NumRamSelect.value);
          setOption(filteredRamModels, config.RAM_MODEL_SELECT);
        });
        NumRamSelect?.addEventListener('change', () => {
          if (NumRamSelect.value === '-' || BrandSelect.value === '-') return;
          const filteredRamModels = filterRamModels(BrandModelMap.get(BrandSelect.value), +NumRamSelect.value);
          setOption(filteredRamModels, config.RAM_MODEL_SELECT);
        });
      } else if (type === 'HDD' || type === 'SSD') {
        const { BrandSet, BrandModelMap } = generateSetAndMap(data);
        const BrandSelect = document.getElementById(config.STORAGE_BRAND_SELECT) as HTMLSelectElement;
        const ModelSelect = document.getElementById(config.STORAGE_MODEL_SELECT) as HTMLSelectElement;
        const StorageSelect = document.getElementById(config.STORAGE_SELECT) as HTMLSelectElement;
        const StorageSet = generateStorageSet(data);

        setOption(Array.from(StorageSet), config.STORAGE_SELECT);
        setOption(Array.from(BrandSet), config.STORAGE_BRAND_SELECT);

        BrandSelect?.addEventListener('change', () => {
          if (StorageSelect.value === '-' || BrandSelect.value === '-') return;
          const filteredStorageModels = filterStorageModels(BrandModelMap.get(BrandSelect.value), StorageSelect.value);
          setOption(filteredStorageModels, config.STORAGE_MODEL_SELECT);
        });
        StorageSelect?.addEventListener('change', () => {
          if (StorageSelect.value === '-' || BrandSelect.value === '-') return;
          const filteredStorageModels = filterStorageModels(BrandModelMap.get(BrandSelect.value), StorageSelect.value);
          setOption(filteredStorageModels, config.STORAGE_MODEL_SELECT);
        });

        ModelSelect?.addEventListener('change', () => {
          const selectedModel = data.filter((PCParts) => PCParts.Model === ModelSelect.value);
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
  console.log(models, storage);
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
