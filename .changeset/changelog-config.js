const { getInfo } = require('@changesets/get-github-info');

async function getReleaseLine(changeset, type, options) {
  if (!options || !options.repo) {
    throw new Error(
      'Please provide a repo to this changelog generator like this:\n"changelog": ["./changelog-config.js", { "repo": "org/repo" }]'
    );
  }

  let prFromSummary;
  let commitFromSummary;
  let usersFromSummary = [];

  const replacedChangeset = changeset.summary
    .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
      let num = Number(pr);
      if (!isNaN(num)) prFromSummary = num;
      return '';
    })
    .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
      commitFromSummary = commit;
      return '';
    })
    .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
      usersFromSummary.push(user);
      return '';
    })
    .trim();

  const [firstLine, ...futureLines] = replacedChangeset
    .split('\n')
    .map((l) => l.trimRight());

  const links = await (async () => {
    if (prFromSummary !== undefined) {
      let { links } = await getInfo({
        repo: options.repo,
        commit: commitFromSummary,
        pull: prFromSummary,
      });
      return links;
    }
    const commitToFetchFrom = commitFromSummary || changeset.commit;
    if (commitToFetchFrom) {
      let { links } = await getInfo({
        repo: options.repo,
        commit: commitToFetchFrom,
      });
      return links;
    }
    return {
      commit: null,
      pull: null,
      user: null,
    };
  })();

  const suffix = links.pull ? ` (${links.pull})` : '';

  return `\n\n- ${firstLine}${suffix}\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
}

async function getDependencyReleaseLine(changesets, dependenciesUpdated) {
  if (dependenciesUpdated.length === 0) return '';

  const changesetLink = `- Updated dependencies [${changesets
    .map((cs) => `\`${cs.commit}\``)
    .join(', ')}]:`;

  const updatedDepenenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  );

  return [changesetLink, ...updatedDepenenciesList].join('\n');
}

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
};
