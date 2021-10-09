import Browser from "webextension-polyfill";
import { enterKeyFilter, formatBytes, extractFileName } from "@src/utils";

let popup: HTMLElement;
let downloadList: HTMLElement;

const init = async () => {
  popup = document.getElementById("root");
  downloadList = document.getElementById("downloads");

  // Add event handlers to clear all button.
  const clearAllButton = document.getElementById("clr-button");
  clearAllButton.onclick = (e) => enterKeyFilter(e, () => removeAllDownloads());
  clearAllButton.onkeypress = (e) => enterKeyFilter(e, () => removeAllDownloads());

  await prepareDownloadList();
}

/**
 * Loads the download list
 */
const prepareDownloadList = async () => {

  const downloadsInBrowser = await Browser.downloads.search({
    state: "complete",
    orderBy: ["-startTime"],
    exists: true
  });

  if (!downloadsInBrowser.length) {
    showEmptyMessage(true);
    showClearAllButton(false);
  }

  const downloadElements: Array<HTMLElement> = downloadsInBrowser.map((download, i) => {
    const dl = document.createElement("div");
    dl.id = `download${download.id}`;
    dl.classList.add("download");
    /*dl.onclick = (e) => enterKeyFilter(e, () => openDownload(download.id));
    dl.onkeypress = (e) => enterKeyFilter(e, () => openDownload(download.id));*/

    const firstColumn = document.createElement("div");
    firstColumn.classList.add("icon");
    const secondColumn = document.createElement("div");
    secondColumn.classList.add("info");
    const thirdColumn = document.createElement("div");
    thirdColumn.classList.add("actions");

    const filename = document.createElement("div");
    filename.classList.add("filename");
    filename.classList.add("truncate");
    const link = document.createElement("a");
    link.classList.add("truncate");
    link.href = download.url;
    link.textContent = extractFileName(download.filename);
    link.onclick = (e) => enterKeyFilter(e, () => openDownload(download.id));
    link.onkeypress = (e) => enterKeyFilter(e, () => openDownload(download.id));
    filename.appendChild(link);

    const fileAddr = document.createElement("div");
    fileAddr.classList.add("file-address");
    fileAddr.classList.add("truncate");
    fileAddr.textContent = download.filename;

    const fileSize = document.createElement("div");
    fileSize.classList.add("file-size");
    fileSize.textContent = formatBytes(download.fileSize);

    secondColumn.appendChild(filename);
    secondColumn.appendChild(fileAddr);
    secondColumn.appendChild(fileSize);

    Browser.downloads.getFileIcon(download.id, { size: 32 })
      .then((icon) => {
        const fileIconImage = document.createElement("img");
        fileIconImage.src = icon;
        fileIconImage.title = "file-icon";
        fileIconImage.alt = "file-icon";
        firstColumn.appendChild(fileIconImage);
      });

    const showButton = document.createElement("button");
    showButton.onclick = (e) => enterKeyFilter(e, () => showDownload(download.id));
    showButton.onkeypress = (e) => enterKeyFilter(e, () => showDownload(download.id));
    showButton.textContent = "S";

    const removeButton = document.createElement("button");
    removeButton.onclick = (e) => enterKeyFilter(e, () => removeDownload(download.id));
    removeButton.onkeypress = (e) => enterKeyFilter(e, () => removeDownload(download.id));
    removeButton.textContent = "R";

    thirdColumn.appendChild(showButton);
    thirdColumn.appendChild(removeButton);

    dl.appendChild(firstColumn);
    dl.appendChild(secondColumn);
    dl.appendChild(thirdColumn);

    return dl;
  });

  if (downloadElements) {
    for (let i = 0; i < downloadElements.length; i++) {
      downloadList.appendChild(downloadElements[i]);
    }
  }
}

const openDownload = (id: number) => {
  Browser.downloads.open(id);
}

const showDownload = (id: number) => {
  Browser.downloads.show(id);
}

const removeDownload = (id: number, func?) => {
  Browser.downloads.erase({ id: id })
    .then(() => removeDownloadFromList(id));
}

const removeAllDownloads = () => {
  Browser.downloads.erase({ state: "complete"})
  .then(() => {
    let childrenCount = downloadList.children.length;

    for (let i = childrenCount - 1; i >= 0; i--) {
      downloadList.removeChild(downloadList.childNodes[i]);
    }

    if (downloadList.children.length === 0) {
      showEmptyMessage(true);
      showClearAllButton(false);
    }
  });
}

const removeDownloadFromList = (id: number) => {
  const el = document.getElementById(`download${id}`);
  el.parentNode.removeChild(el);

  if (downloadList.children.length === 0) {
    showEmptyMessage(true);
    showClearAllButton(false);
  }
}

const showEmptyMessage = (showMessage: boolean) => {
  const emptyMsg = document.getElementById("empty");
  show(emptyMsg, showMessage);
}

const showClearAllButton = (showButton: boolean) => {
  const clrButton = document.getElementById("clr-button");
  show(clrButton, showButton);
}

const show = (el: HTMLElement, show: boolean) => {
  show ? el.classList.remove("hidden") : el.classList.add("hidden");
}

init();
