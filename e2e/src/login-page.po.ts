import {browser, by, element} from 'protractor';

export class LoginPagePo {

  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/login');
  }

  async getTitleText(): Promise<string> {
    return element(by.css('app-login h1')).getText();
  }

  async loginWithCorrectCredentials(): Promise<void> {

    const credentials: {} = {
      email: 'admin@admin.com',
      password: 'admin',
    };

    this.loginWithCredentials(credentials);
  }

  async loginWithInCorrectCredentials(): Promise<void> {

    const credentials: {} = {
      email: 'admin@admin.comaaa',
      password: 'admin',
    };

    this.loginWithCredentials(credentials);
  }

  private loginWithCredentials(credentias: any): void {
    element(by.css('app-login #login-email')).clear();
    element(by.css('app-login #login-email')).sendKeys(credentias.email);
    element(by.css('app-login #login-password')).clear();
    element(by.css('app-login #login-password')).sendKeys(credentias.password);
    element(by.xpath('//button[@type=\'submit\']')).click();
  }
}
