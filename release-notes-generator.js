const { Octokit } = require("@octokit/rest");
const fs = require("fs");

module.exports.ReleaseNotesGenerator = class ReleaseNotesGenerator {

    constructor(sAuthToken, sOwner, sRepo, sVersion) {
        this.owner = sOwner;
        this.repo = sRepo;
        this.version = sVersion;

        this.octokit = new Octokit({
            auth: sAuthToken,
        });
    }

    async createReleaseNotes (sFilePath) {
        const oRelease = await this.getReleaseInfos(this.owner, this.repo);
        this.writeInfosToFile(oRelease, sFilePath);
    }

    async getReleaseInfos (sOwner, sRepo) {
        const { data } = await this.octokit.request(`/repos/${sOwner}/${sRepo}/releases`);
        const oCurrentRelease = data.find(oRelease => oRelease.tag_name.includes(this.version));
        return oCurrentRelease;
    }
    writeInfosToFile (oRelease, sFilePath) {
        console.log(`Found ${oRelease.tag_name} ${oRelease.name}`);

        const oReleaseObject = {
            name: oRelease.name,
            url: oRelease.html_url,
            version: oRelease.tag_name,
            creationDate: oRelease.created_at,
            releaseDate: oRelease.published_at || new Date().toISOString(),
            description: oRelease.body,

            author: oRelease.author.login,
            authorAvatar: oRelease.author.avatar_url,
        }

        console.log(`Writing release notes to ${sFilePath}`);
        fs.writeFileSync(sFilePath, JSON.stringify(oReleaseObject, null, "\t"));
        console.log(`Done!`);
    }

}