import { sRGB, wideGamut } from './utils/Profiles';
import { config } from './Config';
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
        this.sourceProfile = new Image("Source image", sRGB);
        this.targetProfile = new Image("Target image", wideGamut);

        this.loadImage(config.imageUrl);
    }

    public async init() {
        this.panel.addListener('image-loaded', this.loadImage);
        this.panel.addListener('image-generate', this.generateImage);
        this.panel.addListener('image-save', this.saveImage);
    }

    private loadImage = async (url: string) => {
        this.sourceProfile.setImage(url);
    }

    private generateImage = () => {
        this.targetProfile.setImage(this.sourceProfile.getImageSource())
            .then(() => {
                this.targetProfile.convertToProfile(this.sourceProfile.getProfile());
            });
    }

    private saveImage = () => {
        this.targetProfile.downloadImage();
    }
}