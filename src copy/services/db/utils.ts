export class Utils{
	public static makeCreateTableQuery(table) {
		var columns = [];
		table.columns.forEach((col) => {
			columns.push(col.name + ' ' + col.type);
		});
		let query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
		return query;
	}
}