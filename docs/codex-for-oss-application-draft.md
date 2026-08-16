# Codex for Open Source application draft

Status: **not ready to submit**. Last official-form review: 2026-08-16. The repository must first satisfy `docs/codex-for-oss-evidence.md` or the maintainer must explicitly decide to apply earlier with the current facts.

Official pages:

- Program: <https://developers.openai.com/community/codex-for-oss>
- Application: <https://openai.com/form/codex-for-oss/>

## Current form fields

The live official form asked for the following on 2026-08-16:

1. First name — required.
2. Last name — required.
3. Email associated with the applicant's ChatGPT account — required.
4. GitHub username with a public profile — required.
5. Public GitHub repository URL — required.
6. Maintainer role — required choice: Primary maintainer or Core maintainer.
7. Why the repository qualifies — required, maximum 500 characters.
8. Interests — Codex Security and/or API credits for the project.
9. OpenAI Organization ID — required by the current form.
10. How API credits will be used — required, maximum 500 characters.
11. Anything else — optional, maximum 500 characters.

Personal fields and the Organization ID must be supplied and fact-checked by the maintainer immediately before submission. Do not copy them from private configuration into this public file.

## Project descriptions

### One sentence

Color Memory Engine is a self-hostable open-source engine for deterministic daily visual color-memory games with tested CIEDE2000 scoring, licensed content packs, shareable challenges, and optional server-verified Redis rankings.

### Short

Color Memory Engine turns the reusable mechanics of a visual color-memory game into an MIT-licensed Next.js application. Its pure core generates repeatable daily rounds and scores guesses with CIEDE2000; validated content packs separate licensed visuals from gameplay; optional Redis adds short challenges and server-verified rankings without becoming a runtime dependency.

### Long

Color Memory Engine is an MIT-licensed, self-hostable application for creating visual color-memory games. A deterministic seeded-round core lets the browser and server reproduce the same daily sequence. Color guesses are measured in CIE Lab with CIEDE2000 and regression-tested against published reference pairs. Content is distributed through validated, versioned packs with explicit licenses, local assets, and checksums. The initial packs contain generated pure colors, an audited public-domain flag pack, and original geometric SVGs. Long challenge links work without a database; an optional Redis adapter adds expiring short links and a daily leaderboard whose scores are recalculated from registry targets on the server. The project deliberately excludes copyrighted character content and does not require OpenAI APIs at runtime.

## English form answers

### Maintainer role

**Primary maintainer** — use only if the public repository ownership and ongoing release/review activity still support this statement at submission time.

### Why does this repository qualify? — 455/500 characters

Color Memory Engine is an MIT-licensed, self-hostable engine for visual color-memory games. It provides deterministic daily rounds, CIEDE2000 scoring tested against published reference pairs, licensed and checksummed content packs, shareable challenges, and optional server-verified Redis rankings. It gives developers a rights-conscious base for building a game without coupling gameplay to a specific brand, content catalog, database, or hosted service.

This version states technical and ecosystem value but no adoption. Before submission, replace one sentence—not the facts above—with verified release, contributor, deployment, and maintenance evidence while staying under 500 characters.

### How will you use API credits? — 481/500 characters

We would use API credits for public maintainer workflows, not game runtime: triaging new issues, summarizing and risk-classifying pull-request diffs, proposing regression tests for color math and seeded rounds, checking content-pack provenance notes for missing evidence, reviewing API-route changes against the threat model, and drafting release notes. A maintainer would review every output; automation would not merge code, publish releases, or make license decisions by itself.

### Anything else — 408/500 characters

The engine does not require OpenAI APIs to run. The initial release intentionally excludes copyrighted character assets, production credentials, private documents, and unsupported adoption claims. Asset checksums and sources are public, leaderboard scores are recomputed on the server, and persistence fails explicitly when Redis is unavailable. We will submit only evidence that can be linked or reproduced.

## 中文校对版

### 项目为何符合条件

Color Memory Engine 是一个采用 MIT 许可证、可自托管的视觉颜色记忆游戏引擎。它提供确定性每日回合、经过公开参考色对测试的 CIEDE2000 评分、带许可证和校验值的内容包、可分享挑战，以及可选的服务端验分 Redis 排行榜。它让开发者可以在不绑定特定品牌、内容目录、数据库或托管服务的情况下搭建此类游戏。

### API credits 用途

API credits 只用于公开项目维护，不用于游戏运行：分类新 Issue、总结并标注 PR diff 风险、为颜色数学和确定性回合补充回归测试建议、检查内容包来源说明是否缺少证据、对照威胁模型审查 API route 变更、起草 Release Notes。所有输出都由维护者复核；自动化不会自行合并代码、发布版本或作出许可证判断。

### 其他说明

引擎运行不依赖 OpenAI API。首个版本明确排除了受版权保护的角色素材、生产密钥、私密文档和无法证实的采用数据。素材来源和校验值公开；排行榜由服务端重算分数；Redis 不可用时持久化功能明确失败。申请只使用可链接或可复现的证据。

## Submission checklist

- Reopen the official form and recheck fields and character limits.
- Confirm the applicant's name, ChatGPT email, public GitHub username, repository URL, and Organization ID.
- Recount each answer after replacing text; the counts above cover the displayed English answer text only.
- Update the evidence log with public links and the exact fact-check date.
- Confirm that requested API-credit workflows still match actual maintenance work.
- Obtain the maintainer's final approval before entering personal data or submitting the form.
