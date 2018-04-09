module.exports = class Command {
	constructor(dependenciesFunction, executeFunction) {
		this.dependencies = dependenciesFunction();
		this.execute = executeFunction;
	}
}