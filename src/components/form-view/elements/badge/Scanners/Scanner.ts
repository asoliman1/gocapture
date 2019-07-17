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
  scan(isRapidScan: boolean, id?: string): Promise<ScannerResponse>;
  restart();
  statusMessage: string;
}
