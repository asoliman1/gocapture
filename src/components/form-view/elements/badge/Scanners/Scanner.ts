interface ScannerResponse {
  scannedId?: string;
  isCancelled?: boolean;
}

const enum ScannerType {
  NFC = 'nfc',
  Barcode = 'barcode'
}

interface Scanner {
  readonly name: string;
  scan(): Promise<ScannerResponse>;
  restart();
  statusMessage: string;
}
