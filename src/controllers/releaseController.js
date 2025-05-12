class ReleaseController {
    constructor(githubService) {
        this.githubService = githubService;
    }

    async getReleaseBloat(req, res) {
        try {
            const { owner, repo } = req.params;
            const startVersion = req.query.start;
            const endVersion = req.query.end;

            if (!startVersion || !endVersion) {
                return res.status(400).json({ error: 'Both start and end query parameters are required' });
            }

            // Normalize version strings (remove 'v' prefix if present)
            const normalizeVersion = version => version.startsWith('v') ? version.substring(1) : version;
            const startVersionNormalized = normalizeVersion(startVersion);
            const endVersionNormalized = normalizeVersion(endVersion);

            // Fetch all releases for the specified repo
            const releases = await this.githubService.fetchReleases(owner, repo);
            
            // Helper function to compare semver versions
            const compareVersions = (a, b) => {
                const partsA = normalizeVersion(a).split('.').map(Number);
                const partsB = normalizeVersion(b).split('.').map(Number);
                
                for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                    const diff = (partsA[i] || 0) - (partsB[i] || 0);
                    if (diff !== 0) return diff;
                }
                return 0;
            };
            
            // Sort releases by semver
            releases.sort((a, b) => compareVersions(a.tag_name, b.tag_name));
            
            // Find start and end releases
            const startRelease = releases.find(r => r.tag_name === startVersionNormalized);
            const endRelease = releases.find(r => r.tag_name === endVersionNormalized);
            
            if (!startRelease) {
                return res.status(404).json({ error: `Start version ${startVersion} not found` });
            }
            if (!endRelease) {
                return res.status(404).json({ error: `End version ${endVersion} not found` });
            }
            
            const startIndex = releases.indexOf(startRelease);
            const endIndex = releases.indexOf(endRelease);
            
            // Make sure start version comes before end version
            if (compareVersions(startRelease.tag_name, endRelease.tag_name) >= 0) {
                return res.status(400).json({ error: 'Start version must be earlier than end version' });
            }
            
            // Extract the relevant releases between start and end (inclusive)
            const relevantReleases = releases.slice(startIndex, endIndex + 1);
            
            // Calculate size and deltas
            const deltas = relevantReleases.slice(1).map((currentRelease, index) => {
                const previousRelease = relevantReleases[index];
                
                const getAssetsSize = release => release.assets.reduce((total, asset) => total + asset.size, 0);
                const previousSize = getAssetsSize(previousRelease);
                const currentSize = getAssetsSize(currentRelease);
                
                // Calculate ratio (current / previous)
                const delta = previousSize > 0 ? currentSize / previousSize : 1;
                
                return {
                    previous_tag: previousRelease.tag_name,
                    tag: currentRelease.tag_name,
                    delta: Number(delta.toFixed(13))
                };
            });
            
            res.json({ deltas });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while calculating release bloat.' });
        }
    }
}

module.exports = ReleaseController;