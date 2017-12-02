import 'index.sass';
import 'normalize.css';
import 'reflect-metadata';

import { Application } from 'Application';
import { container } from 'inversify.config';

window.onload = bootstrap;

function bootstrap() {
    container.get(Application).init();
}