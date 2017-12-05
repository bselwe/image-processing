import { injectable } from 'inversify';
import { Panel } from 'ui/Panel';
import { ImageLoader } from 'services/ImageLoader';

@injectable()
export class Application {
    private readonly panel: Panel;
    private readonly imageLoader: ImageLoader;

    constructor(
        panel: Panel,
        imageLoader: ImageLoader
    ) {
        this.panel = panel;
        this.imageLoader = imageLoader;
    }

    public async init() {
        this.panel.addListener("image-loaded", this.loadImage);
    }

    private loadImage = async (url: string) => {
        let image = await this.imageLoader.loadImage(url);
        console.warn(image);
    }
}