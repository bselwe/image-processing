import { injectable } from 'inversify';
import { EventEmitter } from 'eventemitter3';
import { FilesReader } from './../services/FilesReader';

@injectable()
export class Panel extends EventEmitter {
    private filesReader: FilesReader;

    private loadButton: HTMLInputElement;
    private generateButton: HTMLButtonElement;
    private saveButton: HTMLButtonElement;

    constructor(filesReader: FilesReader) {
        super();

        this.filesReader = filesReader;
        this.initButtons();
        this.configureEvents();
    }

    private initButtons() {
        this.loadButton = <HTMLInputElement> document.getElementById('image-load');
        this.generateButton = <HTMLButtonElement> document.getElementById('image-generate');
        this.saveButton = <HTMLButtonElement> document.getElementById('image-save');
    }

    private configureEvents() {
        this.generateButton.onclick = () => this.emit('image-generate');
        this.saveButton.onclick = () => this.emit('image-save');
        
        this.loadButton.onchange = async (e: Event) => {
            let files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                let url = await this.filesReader.readFile(files[0]);
                this.emit('image-loaded', url);
            }
        }
    }
}