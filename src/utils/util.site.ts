import { env } from "./util.env";
export const site = {
  /**
   * @description 更新标题
   * @param {String} title 标题
   */
  title: function (titleText: string) {
    const processTitle = env.TITLE || "Born's site";
    window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ""}`;
  }
};
