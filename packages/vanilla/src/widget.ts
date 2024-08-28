// Copyright © 2021 Aravinth Manivnanan <realaravinth@batsense.net>.
// SPDX-FileCopyrightText: 2023 Aravinth Manivannan <realaravinth@batsense.net>
//
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import { SiteKey, WidgetConfig, ConfigurationError } from "@mcaptcha/core-glue";
import Receiver from "@mcaptcha/core-glue";

import { ID, INPUT_NAME, INPUT_LABEL_ID } from "./const";

class Widget {
  inputElement: HTMLInputElement;
  receiver: Receiver;

  constructor(config: WidgetConfig) {
    const parentElement = getParentElement();
    if (parentElement === null || parentElement === undefined) {
      throw new Error(`Element ${ID}'s parent element is undefined`);
    }

    this.receiver = new Receiver(
      config,
      (val: string) => {
        this.setToken(val)
        const callback = parentElement.dataset?.callback
        if (callback && typeof (window as any)[callback] === 'function') {
          (window as any)[callback]()
        }
      },
    );
    this.receiver.listen();

    let label = <HTMLLabelElement | null>(
      document.getElementById(INPUT_LABEL_ID)
    );
    if (label !== null) {
      label.style.display = "none";
    }
    this.inputElement =
      <HTMLInputElement>document.getElementById(INPUT_NAME) ?? document.createElement('input');

    this.inputElement.id = INPUT_NAME;
    this.inputElement.name = INPUT_NAME;
    this.inputElement.hidden = true;
    this.inputElement.required = true;
    this.inputElement.style.display = "none";
    parentElement.appendChild(this.inputElement);

    const iframe_id = "mcaptcha-widget__iframe";
    const iframe = document.createElement("iframe");
    iframe.title = "mCaptcha";
    iframe.src = this.receiver.widgetLink.toString();
    iframe.ariaRoleDescription = "presentation";
    iframe.name = iframe_id;
    iframe.id = iframe_id;
    iframe.scrolling = "no";
    try {
      (<any>iframe).sandbox = "allow-same-origin allow-scripts allow-popups";
    } catch {
      try {
        (<any>iframe).sandbox.add("allow-same-origin");
        (<any>iframe).sandbox.add("allow-scripts");
        (<any>iframe).sandbox.add("allow-popups");
      } catch {
        iframe.setAttribute(
          "sandbox",
          "allow-same-origin allow-scripts allow-popups"
        );
      }
    }
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";

    parentElement.appendChild(iframe);
  }

  /*
   * Set token value to a hidden input field in the form
   */
  setToken = (val: string) => (this.inputElement.value = val);
}

const getParentElement = () => {
  let parent: HTMLElement | null = document.getElementById(ID);
  if (!parent) parent = <HTMLElement>document.getElementsByClassName(ID)[0] ?? null;
  return parent;
}

export const run = () => {
  const parentElement = getParentElement();
  if (parentElement) {
    if (parentElement.dataset?.instance_url && parentElement.dataset?.sitekey) {
      new Widget({
        siteKey: {
          instanceUrl: new URL(parentElement.dataset.instance_url),
          key: parentElement.dataset.sitekey,
        }
      });
    } else if (parentElement.dataset.mcaptcha_url) {
      new Widget({
        widgetLink: new URL(parentElement.dataset.mcaptcha_url),
      });
    }
  } else {
    let label = <HTMLElement | null>document.getElementById(INPUT_LABEL_ID);

    if (label !== null && label.dataset.mcaptcha_url) {
      new Widget({
        widgetLink: new URL(label.dataset.mcaptcha_url),
      });
    } else {
      throw new Error(
        `Couldn't find "mcaptcha_url" dataset in element (ID=${INPUT_LABEL_ID})`
      );
    }
  }
};



export default Widget;
