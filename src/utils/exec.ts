import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

export function exec(command: string) {
	return promisify(execCallback)(command);
}
