export interface ScanResult {
	version: string;
	$schema: string;
	runs: Run[];
}

interface Run {
	tool: Tool;
}

interface Tool {
	driver: Driver;
}

interface Driver {
	fullName: string;
	informationUri: string;
	name: string;
	rules: Rule[];
}

interface Rule {
	id: string;
	name: string;
	shortDescription: ShortDescription;
	helpUri: string;
	help: Help;
	properties: Properties;
}

interface ShortDescription {
	text: string;
}

interface Help {
	text: string;
	markdown: string;
}

interface Properties {
	affected_version: string;
	cvssV3_severity: string;
	fixed_version: string;
	purls: string[];
	'security-severity': string;
	tags: string[];
}
