export const extractFileName = (file: string): string => {
  const splitFileName = file.split("\\");
  return splitFileName[splitFileName.length - 1];
};

export const formatBytes = (bytes, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const enterKeyFilter = (e: MouseEvent | KeyboardEvent, func) => {
  if (e instanceof KeyboardEvent) {
    if ((e as KeyboardEvent).key !== "Enter") {
      return;
    }
  }
  func();
}
