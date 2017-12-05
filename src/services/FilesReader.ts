import { injectable } from 'inversify';

@injectable()
export class FilesReader {
    public readFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (file) {
                var reader = new FileReader();
                
                reader.onload = (e: any) => resolve(e.target.result);
                reader.onerror = reject;

                reader.readAsDataURL(file);
            } else {
                reject();
            }
        });
    }
}