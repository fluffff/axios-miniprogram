import { isUndefined, isPlainObject } from '../helpers/isTypes';
import { deepMerge } from '../helpers/deepMerge';
import { AxiosRequestConfig } from './Axios';

const fromConfig2Map: Record<string, boolean> = {
  url: true,
  method: true,
  data: true,
  upload: true,
  download: true,
};
const deepMergeConfigMap: Record<string, boolean> = {
  headers: true,
  params: true,
};

export function mergeConfig(
  config1: AxiosRequestConfig = {},
  config2: AxiosRequestConfig = {},
): AxiosRequestConfig {
  const config: AxiosRequestConfig = {};

  // 所有已知键名
  const keysSet = Array.from(
    new Set([...Object.keys(config1), ...Object.keys(config2)]),
  );

  for (const key of keysSet) {
    const val1 = config1[key] as any;
    const val2 = config2[key] as any;

    // 只从 config2 中取值
    if (fromConfig2Map[key]) {
      if (!isUndefined(val2)) config[key] = val2;
    }
    // 深度合并 config1 和 config2 中的对象
    else if (deepMergeConfigMap[key]) {
      if (isPlainObject(val1) && isPlainObject(val2)) {
        config[key] = deepMerge(val1, val2);
      } else if (isPlainObject(val1)) {
        config[key] = deepMerge(val1);
      } else if (isPlainObject(val2)) {
        config[key] = deepMerge(val2);
      }
    }
    // 优先从 config2 中取值，如果没有值就从 config1 中取值
    else {
      if (!isUndefined(val2)) {
        config[key] = val2;
      } else if (!isUndefined(val1)) {
        config[key] = val1;
      }
    }
  }

  return config;
}
