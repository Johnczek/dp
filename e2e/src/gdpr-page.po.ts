import {browser, by, element} from 'protractor';

export class GdprPagePo {

  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/gdpr');
  }

  async getHeadingsTexts(): Promise<string> {
    return element(by.css('app-root h2')).getText();
  }
}
