import { container } from 'inversify.config';
import { injectable } from 'inversify';
import { Panel } from 'ui/Panel';
import { Image } from './ui/Image';

@injectable()
export class Application {
    private readonly panel: Panel;
    private readonly sourceProfile: Image;
    private readonly targetProfile: Image;

    constructor(
        panel: Panel
    ) {
        this.panel = panel;
        this.sourceProfile = new Image("Source image");
        this.targetProfile = new Image("Target image");
    }

    public async init() {
        this.panel.addListener('image-loaded', this.loadImage);
    }

    private loadImage = async (url: string) => {
        this.sourceProfile.setImage(url);
    }
}