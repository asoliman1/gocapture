import * as mimeTypes from 'mime-types';

export class FileUtils {

  /**
   * Returns the corresponding file type based on the extension
   * or null if the extension is not recognized
   * @param extension
   *
   */
  static getTypeByExtension(extension: string): string|null {
    return mimeTypes.lookup(extension);
  }

  static getExtensionByType(type: string): string|null {
    return mimeTypes.extension(type);
  }

  /**
   * Returns the file extension
   * @param filename
   */
  static getFileExtension(filename: string): string|null {
    if (!filename) {
      return null;
    }

    return filename.split('.').pop().toLowerCase();
  }
}
