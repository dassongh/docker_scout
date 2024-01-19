import { Command as CommanderCommand } from 'commander';
import { Command } from './';

export class ScoutCommand implements Command {
	constructor(private program: CommanderCommand) {}

	public handle(): void {
		this.program.command('scout').action(() => {
			console.log('Scouting...');
		});
	}
}
