import fs from 'node:fs/promises';
import path from 'node:path';

import { google } from 'googleapis';

export class GoogleService {
	private scopes = ['https://www.googleapis.com/auth/drive.file'];

	public async sendCsv(csv: string) {
		const client = await this.authorize();
		if (!client) {
			console.warn('Authorization failed');
			return;
		}

		const drive = google.drive({ version: 'v3', auth: client });
		try {
			const res = await drive.files.create({
				media: { mimeType: 'text/csv', body: csv },
				fields: 'id',
				requestBody: { name: `scan_result-${Date.now()}.csv`, mimeType: 'text/csv' },
			});
			return res;
		} catch (error) {
			console.error(error);
		}
	}

	private async authorize() {
		const pkey = await this.getPkey();
		if (!pkey) {
			return null;
		}

		const jwtClient = new google.auth.JWT({ email: pkey.client_email, key: pkey.private_key, scopes: this.scopes });
		await jwtClient.authorize();
		return jwtClient;
	}

	private async getPkey() {
		const pkeyPath = path.resolve(__dirname, '../../creds/pk.json');
		let file;
		try {
			file = await fs.readFile(pkeyPath, { encoding: 'utf-8' });
		} catch (error) {
			console.error(error);
			return null;
		}

		return JSON.parse(file);
	}

	public async setPkey() {}
}
