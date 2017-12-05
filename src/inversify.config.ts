import { EventEmitter } from 'eventemitter3';
import { Container, decorate, injectable } from 'inversify';

import { Application } from 'Application';
import { ImageLoader } from 'services/ImageLoader';
import { FilesReader } from 'services/FilesReader';
import { Panel } from 'ui/Panel';

decorate(injectable(), EventEmitter);

const container = new Container();

container.bind<Application>(Application).toSelf().inSingletonScope();
container.bind<ImageLoader>(ImageLoader).toSelf();
container.bind<FilesReader>(FilesReader).toSelf();
container.bind<Panel>(Panel).toSelf().inSingletonScope();

export { container };
