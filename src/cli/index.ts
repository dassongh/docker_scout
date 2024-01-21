import { Command as CommanderCommand } from 'commander';
import { GoogleService } from '../services/google.service';
import { Command, ScoutCommand } from './command';

export class Cli {
	private program: CommanderCommand;
	private commands: Command[];

	constructor() {
		this.program = new CommanderCommand();
		this.program.name('Docker Scout').version('1.0.0');

		this.commands = [new ScoutCommand(this.program, new GoogleService())];
	}

	public run() {
		for (const command of this.commands) {
			command.handle();
		}

		this.program.parse();
		this.program.on('error', console.error);
	}
}
