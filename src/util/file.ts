
const AcceptedTypes = {
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'txt': 'text/plain',
  'csv': 'text/csv',
  'ppt': 'application/vnd.ms-powerpoint',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'xml': 'application/xml',
  'pdf': 'application/pdf',
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export class FileUtils {

  /**
   * Returns the correpsonding file type based on the extension
   * or null if the extension is not recognized
   * @param extension
   *
   */
  static getTypeByExtension(extension: string): string|null {
    return AcceptedTypes[extension];
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
