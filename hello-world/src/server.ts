import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import dotenv from 'dotenv';
import { resolve as resolvePath } from 'path';
import App from './app';
process.on('uncaughtException', err => console.log('uncaughtException', err));
process.on('unhandledRejection', reason => console.log('unhandledRejection', reason));
dotenv.config();
function runApp() {
	const server = new MRE.WebHost({
		baseDir: resolvePath(__dirname, '../public'),
		baseUrl: 'http://ec2-3-236-82-18.compute-1.amazonaws.com/',
		port:3000
	});
	server.adapter.onConnection(context => new App(context));
}
const delay = 1000;
const argv = process.execArgv.join();
const isDebug = argv.includes('inspect') || argv.includes('debug');
if (isDebug) {
	setTimeout(runApp, delay);
} else {
	runApp();
}
