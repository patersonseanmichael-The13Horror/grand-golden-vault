import process from "node:process";

const MIN_NODE_MAJOR = 20;
const MIN_NODE_MINOR = 16;
const MIN_NPM_MAJOR = 10;

const parseVersion = (value) => {
  const [major = "0", minor = "0", patch = "0"] = value.replace(/^v/, "").split(".");
  return {
    major: Number.parseInt(major, 10) || 0,
    minor: Number.parseInt(minor, 10) || 0,
    patch: Number.parseInt(patch, 10) || 0,
  };
};

const node = parseVersion(process.versions.node);
const npm = parseVersion(process.env.npm_config_user_agent?.match(/npm\/(\d+\.\d+\.\d+)/)?.[1] || "0.0.0");

const nodeTooLow = node.major < MIN_NODE_MAJOR || (node.major === MIN_NODE_MAJOR && node.minor < MIN_NODE_MINOR);
const npmTooLow = npm.major < MIN_NPM_MAJOR;

if (nodeTooLow || npmTooLow) {
  console.error("Runtime preflight failed.");
  if (nodeTooLow) {
    console.error(`- Node.js ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}+ required. Current: ${process.versions.node}`);
  }
  if (npmTooLow) {
    console.error(`- npm ${MIN_NPM_MAJOR}+ required. Current: ${npm.major}.${npm.minor}.${npm.patch}`);
  }
  console.error("Upgrade runtime first to avoid unstable installs and deployment failures.");
  process.exit(1);
}

console.log(`Runtime preflight passed (Node ${process.versions.node}, npm ${npm.major}.${npm.minor}.${npm.patch}).`);
