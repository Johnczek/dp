import {AppPage} from './app.po';
import {HeaderPo} from './header.po';
import {LoginPagePo} from './login-page.po';
import {AuctionsPagePo} from './auctions-page.po';
import {GdprPagePo} from './gdpr-page.po';
import {AuctionPagePo} from './auction-page.po';

describe('Homepage', () => {
  let page: AppPage;
  let header: HeaderPo;

  beforeEach(() => {
    page = new AppPage();
    header = new HeaderPo();
  });

  it('Should display homepage welcome message', async () => {
    await page.navigateTo();
    expect(await page.getTitleText()).toEqual('Vítejte na webovém portálu Auctioner!');
  });

  it('Should display login button for not logged person', async () => {
    await page.navigateTo();
    expect(await header.isLoginButtonPresent()).toBe(true);
  });

  it('Should display register button for not logged person', async () => {
    await page.navigateTo();
    expect(await header.isRegisterButtonPresent()).toBe(true);
  });

  it('Should display auction anchor', async () => {
    await page.navigateTo();
    expect(await header.isAuctionsAnchorPresent()).toBe(true);
  });
});

describe('Login page', () => {
  let loginPage: LoginPagePo;
  let header: HeaderPo;
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    loginPage = new LoginPagePo();
    header = new HeaderPo();
  });

  it('Should display login header', async () => {
    await loginPage.navigateTo();
    expect(await loginPage.getTitleText()).toEqual('Přihlášení');
  });

  it('Should stay at login page with incorrect credentials login', async () => {
    await loginPage.navigateTo();
    await loginPage.loginWithInCorrectCredentials();

    expect(await loginPage.getTitleText()).toEqual('Přihlášení');
  });
});

describe('Auctions page', () => {
  let auctionsPage: AuctionsPagePo;

  beforeEach(() => {
    auctionsPage = new AuctionsPagePo();
  });

  it('Should display auctions header', async () => {
    await auctionsPage.navigateTo();
    expect(await auctionsPage.getTitleText()).toEqual('Aktuálně běžící aukce');
  });
});

describe('Auctions page', () => {
  let auctionsPage: AuctionsPagePo;

  beforeEach(() => {
    auctionsPage = new AuctionsPagePo();
  });

  it('Should display auctions', async () => {
    await auctionsPage.navigateTo();
    expect(await auctionsPage.getTitleText()).toEqual('Aktuálně běžící aukce');
  });
});

describe('Auction page', () => {
  let auctionPage: AuctionPagePo;

  beforeEach(() => {
    auctionPage = new AuctionPagePo();
  });

  it('Should display auction', async () => {
    await auctionPage.navigateTo();
    expect(await auctionPage.getTitleText()).toEqual('Nabídka Item 1 od prodejce user u .');
  });
});

describe('GDPR page', () => {
  let gdprPage: GdprPagePo;

  beforeEach(() => {
    gdprPage = new GdprPagePo();
  });

  it('Should display auctions', async () => {
    await gdprPage.navigateTo();
    expect(await gdprPage.getHeadingsTexts()).toEqual('Ochrana osobních údajů');
  });
});
