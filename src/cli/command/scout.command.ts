import fs from 'node:fs/promises';
import path from 'node:path';

import { Parser } from '@json2csv/plainjs';
import { Command as CommanderCommand } from 'commander';

import { ScanResult } from '../../interfaces';
import { GoogleService } from '../../services/google.service';
import { exec } from '../../utils/exec';
import { Command } from './';

export class ScoutCommand implements Command {
	constructor(
		private program: CommanderCommand,
		private googleService: GoogleService,
	) {}

	handle(): void {
		this.program
			.command('scout')
			.description(
				'Scout provided docker image and save result in csv file. If no options provided, result will be saved to scan_results directory',
			)
			.argument('<image>', 'Docker image name')
			.option('-R, --raw', 'If set, show raw result in console')
			.option('-G, --google', 'If set, upload result to Google Drive')
			.action(async (image: string, options: { raw: boolean; google: boolean }) => {
				console.log('Scouting...');
				let res;
				try {
					res = await exec(`docker scout cves --format sarif --output res.json ${image}`);
				} catch (error) {
					console.error('Image not found');
					return;
				}

				if (!res) {
					console.error('Scouting failed');
					return;
				}

				const resFilePath = path.resolve(__dirname, '../../../res.json');

				let result: string;
				try {
					result = await fs.readFile(resFilePath, { encoding: 'utf-8' });
					await fs.unlink(resFilePath);
				} catch (error) {
					console.error(error);
					return;
				}

				const scanResult: ScanResult = JSON.parse(result);
				const formattedResult = scanResult.runs[0].tool.driver.rules.map(rule => {
					return {
						imageName: image,
						CVE: rule.id,
						severity: rule.properties.cvssV3_severity,
					};
				});

				const parser = new Parser();
				const csv = parser.parse(formattedResult);

				if (options.raw) {
					console.log(csv);
					return;
				}

				if (options.google) {
					let res;
					try {
						res = await this.googleService.sendCsv(csv);
					} catch (error) {
						console.error(error);
						return;
					}

					if (!res) {
						console.warn('Upload to Google failed');
						console.warn('Uploading to scan_results directory instead');

						try {
							return await fs.writeFile(
								path.resolve(__dirname, `../../../scan_results/scan_result-${Date.now()}.csv`),
								csv,
								{
									encoding: 'utf-8',
								},
							);
						} catch (error) {
							console.error(error);
						}
					}

					console.log('Your csv file was uploaded to Google Drive');
					console.log(`File id is ${res?.data.id}`);
					return;
				}

				try {
					await fs.writeFile(path.resolve(__dirname, `../../../scan_results/scan_result-${Date.now()}.csv`), csv, {
						encoding: 'utf-8',
					});
				} catch (error) {
					console.error(error);
				}

				console.log('Your csv file was saved to scan_results directory');
			});
	}
}
