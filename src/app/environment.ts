// Angular 2
import {
  enableDebugTools,
  disableDebugTools
} from '@angular/platform-browser';
import {
  ApplicationRef,
  enableProdMode
} from '@angular/core';
// Environment Providers
let PROVIDERS: any[] = [
  // common env directives
];

import { config } from '../assets/config/common.config';
let ENV_CONFIG = {};

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = <T>(value: T): T => { return value; };

const GITHUB = process.env.GITHUB;

// Set absolute addresses based on environment

ENV_CONFIG['baseUrl'] = config.baseUrl.local;
ENV_CONFIG['multiServerUrl'] = config.multiServerUrl.local;
ENV_CONFIG['root'] = config.root.default;
if (GITHUB) {
  ENV_CONFIG['baseUrl'] = config.baseUrl.github;
  ENV_CONFIG['root'] = config.root.github;
  ENV_CONFIG['multiServerUrl'] = config.multiServerUrl.github;
}
ENV_CONFIG['baseUrlStripped'] = ENV_CONFIG['baseUrlStripped'].replace(/\/\#\/\!/, '').replace(/https?:/, '');

if ('production' === process.env.ENV) {
  enableProdMode();

  // Production
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

  PROVIDERS = [
    ...PROVIDERS,
    // custom providers in production
  ];

} else {

  _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    let _ng = (<any> window).ng;
    enableDebugTools(cmpRef);
    (<any> window).ng.probe = _ng.probe;
    (<any> window).ng.coreTokens = _ng.coreTokens;
    return modRef;
  };

  // Development
  PROVIDERS = [
    ...PROVIDERS,
    // custom providers in development
  ];

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];

export const CONFIG = Object.assign(config, ENV_CONFIG);
