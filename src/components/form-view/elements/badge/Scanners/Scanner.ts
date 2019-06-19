export interface ScannerResponse {
  scannedId?: string;
  isCancelled?: boolean;
  barcodes?: string[];
}

export const enum ScannerType {
  NFC = 'nfc',
  Barcode = 'barcode'
}

export interface Scanner {
  readonly name: string;
  scan(isRapidScan: boolean): Promise<ScannerResponse>;
  restart();
  statusMessage: string;
}
