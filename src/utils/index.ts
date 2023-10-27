import * as envs from "./util.env";
import * as commonEnvs from "./util.common.env";
import * as sites from "./util.site";
import * as storages from "./util.storage";
import * as commons from "./util.common";
import * as mitt from "./util.mitt";
export const util = {
  ...envs,
  ...commonEnvs,
  ...sites,
  ...storages,
  ...commons,
  ...mitt
};
