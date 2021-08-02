const fs = require("fs").promises;

const archiveDirectory = "./archive";

const writeToLog = async (logName, lines) => {
    /* Get the file descriptor and open it */
    const file = await openLogFile(logName);

    /* Fetch all messages and write them to the file */
    for (const line of lines) {
        await file.write(`${line}\n`);
    }

    /* Close the file descriptor and return the file name */
    await closeLogFile(file);
    return getLogFileName(logName);
};

const getLogFileName = (name) => {
    return `${archiveDirectory}/${name}.log`;
};

const openLogFile = async (name) => {
    await createArchiveDirectory();
    const fileName = getLogFileName(name);
    return fs.open(fileName, "w");
};

const closeLogFile = async (fd) => {
    await fd.close();
};

const createArchiveDirectory = async () => {
    await fs.mkdir(archiveDirectory).catch((err) => {
        if (err.code !== "EEXIST") {
            console.log(`Could not create archive directory: ${archiveDirectory}:\n ${err}`);
        }
    });
};

module.exports = writeToLog;
