import {browser, by, element} from 'protractor';

export class AuctionPagePo {

  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/item/1');
  }

  async getTitleText(): Promise<string> {
    return element(by.css('app-item-detail h2')).getText();
  }
}
