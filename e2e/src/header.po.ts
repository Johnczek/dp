import {by, element} from 'protractor';

export class HeaderPo {

  async isLoginButtonPresent(): Promise<boolean> {
    return element(by.css('app-header #header-login-button')).isPresent();
  }

  async isRegisterButtonPresent(): Promise<boolean> {
    return element(by.css('app-header #header-register-button')).isPresent();
  }

  async isAuctionsAnchorPresent(): Promise<boolean> {
    return element(by.css('app-header #header-auctions')).isPresent();
  }
}
