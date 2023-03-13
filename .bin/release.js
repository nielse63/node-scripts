#!/usr/bin/env node
// const npm = require('npm');
// const fs = require('fs');
// const path = require('path');
const cp = require('child_process');
const exec = require('@nielse63/exec');
const readline = require('readline');

// vars
const dryRun = process.argv.includes('--dry-run');

const getBranch = async () => {
  return exec('git rev-parse --abbrev-ref HEAD');
};

const getIsWorkingDirectoryClean = async () => {
  const output = await exec('git status --porcelain');
  return !!output.split('\n').length;
};

const spawn = (cmd) => {
  return new Promise((resolve, reject) => {
    const [executable, ...args] = cmd.split(' ');
    const proc = cp.spawn(executable, [...args]);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      const string = `${data}`;
      stdout += string;
      console.log(string);
    });

    proc.stderr.on('data', (data) => {
      const string = `${data}`;
      stderr += string;
      console.log(string);
    });

    proc.on('close', (code) => {
      if (code) {
        return reject(new Error(stderr));
      }
      resolve(stdout);
    });
  });
};

const getTag = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Tag: ', (answer) => {
      console.log(`Thank you for your valuable feedback: ${answer}`);
      rl.close();
      resolve(answer);
    });
  });
};

const main = async () => {
  const branch = await getBranch();
  if (!dryRun && branch !== 'main') {
    console.error('Can only release on branch `main`');
    return;
  }
  const isWorkingDirectoryClean = await getIsWorkingDirectoryClean();
  if (!dryRun && !isWorkingDirectoryClean) {
    console.error('Working directory is not clean');
    return;
  }
  if (!dryRun) {
    await spawn('npm run build');
    await spawn('npx eslint .');
    await spawn('npm test');
  }
  const tag = await getTag();
  await spawn(
    `npm version "${tag}" --workspaces --no-git-tag-version --include-workspace-root`
  );
  await spawn('npx generate-changelog --allow-unknown');
  await spawn('git add .');
  await spawn(`git commit -m 'release: v${tag}'`);
  await spawn('git push --follow-tags');
  await spawn('npm publish --workspaces');
  await spawn('gh release create ${tag} --generate-notes');
};

main().catch(console.error);
