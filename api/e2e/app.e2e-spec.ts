import { MatissesPage } from './app.po';

describe('matisses App', () => {
  let page: MatissesPage;

  beforeEach(() => {
    page = new MatissesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
