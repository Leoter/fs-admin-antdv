import _ from "lodash-es";
export function getEnvValue(key: string) {
  // @ts-ignore
  return import.meta.env["VITE_COMMON_" + key];
}

export class CommonEnvConfig {
  PWD_RSA_PRIVATE_KEY: string;
  SERVICE_UAA: string;
  constructor() {
    this.init();
  }

  init() {
    // @ts-ignore
    _.forEach(import.meta.env, (value, key) => {
      if (key.startsWith("VITE_COMMON_")) {
        key = key.replace("VITE_COMMON_", "");
        // @ts-ignore
        this[key] = value;
      }
    });
  }

  get(key: string, defaultValue: string) {
    // @ts-ignore
    return this[key] ?? defaultValue;
  }
}

export const commonEnv = new CommonEnvConfig();
