const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/rest");
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

if (!sRepo) { core.error("no repository specified, aborting"); }
if (!sOwner) { core.error("no owner specified, aborting"); }
if (!sVersion) { core.error("no version specified, aborting"); }
if (!sAuthToken) { core.error("no GitHub access token specified, aborting"); }

const octokit = new Octokit({
    auth: sAuthToken,
});


const getReleaseInfos = async function (sOwner, sRepo) {
    const { data } = await octokit.request(`/repos/${sOwner}/${sRepo}/releases`);
    const oCurrentRelease = data.find(oRelease => oRelease.tag_name.includes(sVersion));
    return oCurrentRelease;
}
const writeInfosToFile = function(oRelease) {
    console.log(`Found ${oRelease.tag_name} ${oRelease.name}`);

    console.log(oRelease);
}


const run = async function () {
    const oRelease = await getReleaseInfos(sOwner, sRepo);
    writeInfosToFile(oRelease);
}

try {
    run();
} catch (error) {
    core.setFailed(error.message);
}

