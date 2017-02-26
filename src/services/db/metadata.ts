export class Table{
	name: string;
	master: boolean;
	columns: Column[];
	queries: {[key: string]: string};
}

export class Column{
	name: string;
	type: string;
}