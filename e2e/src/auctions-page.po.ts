import {browser, by, element} from 'protractor';

export class AuctionsPagePo {

  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/item');
  }

  async getTitleText(): Promise<string> {
    return element(by.css('app-item-list .h1')).getText();
  }
}
