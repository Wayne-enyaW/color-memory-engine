# Security policy

## Supported versions

Security fixes are provided for the latest tagged release. Older releases may be asked to upgrade.

## Report a vulnerability

Use GitHub's private vulnerability reporting feature on this repository's **Security** tab. Do not open a public issue for an unpatched vulnerability and do not include real credentials or personal data in a report.

Include the affected route or module, reproduction conditions, impact, and a minimal proof of concept when safe. The maintainer will acknowledge a valid report within seven days and coordinate disclosure after a fix is available.

## Security model

- Client-submitted targets and scores are not authoritative.
- Redis is optional; persistence-dependent features fail explicitly when it is absent.
- Production leaderboard writes require a signing secret.
- Inputs have bounded payload, date, enum, name, ID, and hex formats.
- Fork pull requests do not receive deployment or production secrets.

This policy is not a bug-bounty promise.
