export default class HtmlManager {
  private container: HTMLDivElement;
  private preloader?: HTMLDivElement;
  private progressBar?: HTMLDivElement;
  private progressText?: HTMLDivElement;
  private popup?: HTMLDivElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.className = "html-manager";
    document.body.appendChild(this.container);
  }

  public showPreloader() {
    this.hidePreloader();

    const preloader = document.createElement("div");
    preloader.className = "html-preloader";

    const title = document.createElement("div");
    title.className = "html-preloader__title";
    title.textContent = "Loading...";

    const progressContainer = document.createElement("div");
    progressContainer.className = "html-preloader__progress";

    const progressBar = document.createElement("div");
    progressBar.className = "html-preloader__progress-bar";

    const progressText = document.createElement("div");
    progressText.className = "html-preloader__progress-text";
    progressText.textContent = "0%";

    progressContainer.appendChild(progressBar);
    preloader.appendChild(title);
    preloader.appendChild(progressContainer);
    preloader.appendChild(progressText);
    this.container.appendChild(preloader);

    this.preloader = preloader;
    this.progressBar = progressBar;
    this.progressText = progressText;
  }

  public setLoadingProgress(progress: number) {
    if (!this.preloader || !this.progressBar || !this.progressText) {
      return;
    }

    const value = Math.max(0, Math.min(1, progress));
    const percentage = Math.round(value * 100);

    this.progressBar.style.width = `${percentage}%`;
    this.progressText.textContent = `${percentage}%`;
  }

  public hidePreloader() {
    if (!this.preloader) {
      return;
    }

    this.preloader.remove();
    this.preloader = undefined;
    this.progressBar = undefined;
    this.progressText = undefined;
  }

  private createPopup() {
    const popup = document.createElement("div");
    popup.className = "html-popup";

    const title = document.createElement("h2");
    title.className = "html-popup__title";

    const text = document.createElement("p");
    text.className = "html-popup__text";

    const button = document.createElement("button");
    button.className = "html-popup__button";

    popup.appendChild(title);
    popup.appendChild(text);
    popup.appendChild(button);

    return { popup, title, text, button };
  }

  private showPopup(titleText: string, message: string, buttonText: string, onClick: () => void) {
    this.hidePopup();

    const { popup, title, text, button } = this.createPopup();

    title.textContent = titleText;
    text.textContent = message;
    button.textContent = buttonText;

    button.addEventListener("click", () => {
      this.hidePopup();
      onClick();
    });

    this.container.appendChild(popup);
    this.popup = popup;
  }

  public showStartPopup(onStart: () => void) {
    this.showPopup("Ready?", "Press the button to start the game.", "START GAME", onStart);
  }

  public showThankYouPopup(onClick: () => void, points: number) {
    this.showPopup("Well done!", `Your score is ${points}`, "PLAY AGAIN", onClick);
  }

  public hidePopup() {
    if (!this.popup) {
      return;
    }

    this.popup.remove();
    this.popup = undefined;
  }

  public destroy() {
    this.hidePreloader();
    this.hidePopup();
    this.container.remove();
  }
}