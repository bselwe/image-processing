import { Container } from 'inversify';

import { Application } from 'Application';
import { ImageLoader } from 'services/ImageLoader';

const container = new Container();

container.bind<Application>(Application).toSelf().inSingletonScope();
container.bind<ImageLoader>(ImageLoader).toSelf();

export { container };
