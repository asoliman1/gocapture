export interface ScannerResponse {
  scannedId?: string;
  isCancelled?: boolean;
}

export const enum ScannerType {
  NFC = 'nfc',
  Barcode = 'barcode'
}

export interface Scanner {
  readonly name: string;
  scan(): Promise<ScannerResponse>;
  restart();
  statusMessage: string;
}
