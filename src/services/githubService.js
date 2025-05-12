const axios = require('axios');

const GITHUB_API_BASE_URL = 'https://api.github.com';

async function fetchReleases(owner, repo, options = {}) {
    const { perPage = 30, page = 1 } = options;
    
    try {
        const response = await axios.get(`${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/releases`, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            params: {
                per_page: perPage,
                page: page
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching releases for ${owner}/${repo}: ${error.message}`);
    }
}

module.exports = {
    fetchReleases,
};