import { make } from "./ui";
import {
  IconAddBorder,
  IconStretch,
  IconAddBackground,
} from "@codexteam/icons";

/**
 * Working with Block Tunes
 */
export default class Tunes {
  /**
   * @param {object} tune - video tool Tunes managers
   * @param {object} tune.api - Editor API
   * @param {object} tune.actions - list of user defined tunes
   * @param {Function} tune.onChange - tune toggling callback
   */
  constructor({ api, actions, onChange }) {
    this.api = api;
    this.actions = actions;
    this.onChange = onChange;
    this.buttons = [];
  }

  /**
   * Available Video tunes
   *
   * @returns {{name: string, icon: string, title: string}[]}
   */
  static get tunes() {
    return [
      {
        name: "withBorder",
        icon: IconAddBorder,
        title: "With border",
      },
      {
        name: "stretched",
        icon: IconStretch,
        title: "Stretch video",
      },
      {
        name: "withBackground",
        icon: IconAddBackground,
        title: "With background",
      },
    ];
  }

  /**
   * Styles
   *
   * @returns {{wrapper: string, buttonBase: *, button: string, buttonActive: *}}
   */
  get CSS() {
    return {
      wrapper: "video-tool__wrapper",
      buttonBase: this.api.styles.settingsButton,
      button: "video-tool__tune",
      buttonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch video
   *
   * @param {VideoToolData} toolData - generate Elements of tunes
   * @returns {Element}
   */
  render(toolData) {
    const wrapper = make("div", this.CSS.wrapper, {});

    this.buttons = [];

    const tunes = Tunes.tunes.concat(this.actions);

    tunes.forEach((tune) => {
      const title = this.api.i18n.t(tune.title);
      const innerHTML = `<div class="tunes__icon__wrapper" >${tune.icon}</div><div>${tune.title}</div>`;
      const el = make(
        "div",
        [
          this.CSS.buttonBase,
          this.CSS.button,
          `video__tool__button__${tune.title.toLowerCase().replace(/ /g, "_")}`,
        ],
        {
          innerHTML: innerHTML,
          title,
        }
      );

      el.addEventListener("click", () => {
        this.tuneClicked(tune.name, tune.action);
      });

      el.dataset.tune = tune.name;
      el.classList.toggle(this.CSS.buttonActive, toolData[tune.name]);

      this.buttons.push(el);

      this.api.tooltip.onHover(el, title, {
        placement: "top",
      });

      wrapper.appendChild(el);
    });

    return wrapper;
  }

  /**
   * Clicks to one of the tunes
   *
   * @param {string} tuneName - clicked tune name
   * @param {Function} customFunction - function to execute on click
   */
  tuneClicked(tuneName, customFunction) {
    if (typeof customFunction === "function") {
      if (!customFunction(tuneName)) {
        return false;
      }
    }

    const button = this.buttons.find((el) => el.dataset.tune === tuneName);

    button.classList.toggle(
      this.CSS.buttonActive,
      !button.classList.contains(this.CSS.buttonActive)
    );

    this.onChange(tuneName);
  }
}
