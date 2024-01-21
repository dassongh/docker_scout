import fs from 'node:fs/promises';

import { Command as CommanderCommand } from 'commander';

import { Command } from '.';
import { GoogleService } from '../../services/google.service';

export class PkeyCommand implements Command {
	constructor(
		private program: CommanderCommand,
		private googleService: GoogleService,
	) {}

	handle(): void {
		this.program
			.command('pkey')
			.description('Set pkey')
			.argument('<path>', 'Absolute path to pkey')
			.action(async (path: string) => {
				let pkey;
				try {
					pkey = await fs.readFile(path, { encoding: 'utf-8' });
				} catch (error) {
					console.error('No such file or directory');
					return;
				}

				await this.googleService.setPkey(pkey);
				console.log('Pkey set');
			});
	}
}
