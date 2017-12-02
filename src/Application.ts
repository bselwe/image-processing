import { injectable } from 'inversify';
import { ImageLoader } from 'services/ImageLoader';
import { config } from 'Config';

@injectable()
export class Application {
    private readonly imageLoader: ImageLoader;

    constructor(imageLoader: ImageLoader) {
        this.imageLoader = imageLoader;
    }

    public async init() {
        await this.loadImage();
    }

    private async loadImage() {
        let image = await this.imageLoader.loadImage(config.imageUrl);
        console.log(image);
    }
}