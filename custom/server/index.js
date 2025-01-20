import Express from 'express';
import { PrismaClient } from '@prisma/client';

import SystemCollector from 'zero-system/src/SystemCollector';
import ZeroRoot from 'zero-system/src/ZeroRoot';
import scaffold from 'zero-scaffold';
import Logger from 'zero-system/src/Log/Logger';

const prisma = new PrismaClient();
const app = Express();

app.use(Express.json());

export default {
  path: '/api',
  handler: app,
};

Logger.setDebug(true);
const root = new ZeroRoot(__dirname, '~/custom/server');

SystemCollector.set('prisma', prisma);
SystemCollector.set('app', app);

SystemCollector.unpack(scaffold.getRegistry().all('_collection'));

root.init();