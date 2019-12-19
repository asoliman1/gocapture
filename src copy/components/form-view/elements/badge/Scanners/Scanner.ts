export interface ScannerResponse {
  scannedId?: string;
  isCancelled?: boolean;
  barcodes?: string[];
}

export const enum ScannerType {
  Nfc = 'nfc',
  Barcode = 'barcode'
}

export interface Scanner {
  readonly name: string;
  scan(isRapidScan: boolean, id?: string): Promise<ScannerResponse>;
  testScanner(): Promise<ScannerResponse>; // A.S GOC-300
  restart();
  statusMessage: string;
}
