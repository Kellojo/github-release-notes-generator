const core = require('@actions/core');
const github = require('@actions/github');
const {ReleaseNotesGenerator} = require("./release-notes-generator");
const fs = require('fs');

const readPackageJson = function () {
    const sFile = fs.readFileSync('./package.json').toString();

    try {
        return JSON.parse(sFile);
    } catch (error) {

    }

    return null;
}

const sRepo = github.context.repo.repo;
const sOwner = github.context.repo.owner
const sVersion = core.getInput("version") || readPackageJson().version;
const sAuthToken = core.getInput("github-access-token");
const sFilePath = core.getInput("destination");

if (!sRepo) { core.error("no repository specified, aborting"); }
if (!sOwner) { core.error("no owner specified, aborting"); }
if (!sVersion) { core.error("no version specified, aborting"); }
if (!sAuthToken) { core.error("no GitHub access token specified, aborting"); }





const run = async function () {
    new ReleaseNotesGenerator(sAuthToken, sOwner, sRepo, sVersion).createReleaseNotes(sFilePath);
}

try {
    run();
} catch (error) {
    core.setFailed(error.message);
}

