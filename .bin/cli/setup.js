/* eslint-disable no-param-reassign */
const inquirer = require('inquirer');
const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const exec = require('../helpers/exec');
const paths = require('../helpers/paths');
const pkg = require('../../package.json');

const oldValues = {
  name: pkg.name,
  description: pkg.description,
  authorName: pkg.author.name,
  authorEmail: pkg.author.email,
  githubUser: 'nielse63',
};

const getGithubUser = async () => {
  if (!fs.existsSync(path.join(paths.ROOT, '.git'))) {
    return '';
  }
  const output = await exec('git config --get remote.origin.url');
  return output
    .trim()
    .replace('git@github.com:', '')
    .replace('https://github.com/', '')
    .replace('.git', '')
    .split('/')[0];
};

const prompt = async (options) => {
  const defaultAuthorName = await exec('git config --get user.name');
  const defaultAuthorEmail = await exec('git config --get user.email');
  const defaultGithubUser = await getGithubUser();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'App name',
      default() {
        return path.basename(options.root);
      },
      when: !options.name,
    },
    {
      type: 'input',
      name: 'description',
      message: 'App description',
      default() {
        return 'My awesome node app!';
      },
      when: !options.description,
    },
    {
      type: 'input',
      name: 'authorName',
      message: 'Author Name',
      default() {
        return defaultAuthorName;
      },
      when: !options.authorName,
    },
    {
      type: 'input',
      name: 'authorEmail',
      message: 'Author Email',
      default() {
        return defaultAuthorEmail;
      },
      when: !options.authorEmail,
    },
    {
      type: 'input',
      name: 'githubUser',
      message: 'Github Username',
      default() {
        return defaultGithubUser;
      },
      when: !options.githubUser,
    },
  ]);

  return { ...options, ...answers };
};

const findAndReplaceInFile = (find, replace, file) => {
  if (!fs.existsSync(file)) {
    console.warn(`${file} does not exist`);
    return;
  }
  if (find === replace) return;
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes(find)) return;
  if (fs.existsSync(file)) {
    cp.execSync(`sed -i '' -e 's/${find}/${replace}/g' ${file}`);
  }
};

const findAndReplace = async (appRoot, answers) => {
  const matchingFiles = Object.keys(answers)
    .filter((key) => key !== 'root' && oldValues[key] !== answers[key])
    .map((key) => {
      const oldValue = oldValues[key];
      try {
        const grep = cp.execSync(
          `grep -e '${oldValue}' --recursive --exclude-dir='node_modules' --files-with-matches ${appRoot}`
        );
        return grep.toString().trim().split('\n');
      } catch (error) {} // eslint-disable-line no-empty
      return [];
    })
    .flat();
  const files = [...new Set(matchingFiles)];
  const answersArray = Object.entries(answers).map(([key, value]) => {
    const oldValue = oldValues[key];
    return {
      key,
      oldValue,
      newValue: value,
    };
  });
  files.forEach((file) => {
    answersArray.forEach(({ oldValue, newValue }) => {
      if (!oldValue || !newValue) return;
      findAndReplaceInFile(oldValue, newValue, file);
    });
  });
};

const main = async (options = {}) => {
  options.root = options.root || process.cwd();
  const answers = await prompt(options);
  await findAndReplace(options.root, answers);
};

program
  .option('--name <value>', 'App name')
  .option('--description <value>', 'App description')
  .option('--author-name <value>', 'Author name')
  .option('--author-email <value>', 'Author email')
  .option('--github-user <value>', 'GitHub username')
  .option('--root <value>', 'Root directory of app', process.cwd());

program.parse(process.argv);
program.version(pkg.version);

if (!module.parent) {
  const options = program.opts();
  main(options).catch(console.error);
}

module.exports = main;
