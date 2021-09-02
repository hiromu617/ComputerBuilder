export type PartsType = 'CPU' | 'GPU' | 'RAM' | 'HDD' | 'SSD';

export type PCParts = {
  Type: PartsType;
  'Part Number': string;
  Brand: string;
  Model: string;
  Rank: number;
  Benchmark: number;
};
