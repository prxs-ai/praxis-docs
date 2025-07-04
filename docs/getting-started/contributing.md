# 🤝 Contributing

We welcome contributions to Praxis! Whether you're fixing bugs, adding features, or improving documentation, your help makes the project better.

## 📚 Repository Structure

Praxis consists of several repositories. Here are the key ones you might contribute to:


**Core Repositories**

Each repository serves a specific purpose in the Praxis ecosystem. Choose the one that matches your contribution goals.



📖 **Documentation**
**[praxis-docs](https://github.com/prxs-ai/praxis-docs)**

- Documentation site (docs.prxs.xyz)
- Getting started guides
- API documentation
- Tutorials and examples
  

🛠️ **Agent Template**
**[praxis-agent-template](https://github.com/your-org/praxis-agent-template)**

- Boilerplate code for new agents
- Development tooling and CI
- Template structure and examples
  

🎯**[praxis-agent-examples](https://github.com/your-org/praxis-agent-examples)**

- Working agent implementations
- Integration examples
- Best practices demonstrations
  


🔧 **[praxis-tool-template](https://github.com/prxs-ai/praxis-tool-template)**

- Boilerplate code for new tools
- Ray integration and CI setup
- Template structure and examples
- Distributed execution patterns
  
  

---

## 🚀 Quick Contribution Guide

### 1. Choose What to Contribute


📝 **Documentation**
**Perfect for:**

- Fix typos or unclear instructions
- Add new guides or tutorials
- Improve existing documentation
- Create video tutorials or demos

**Skills needed:** Writing, Markdown, GitBook


🔧 **Agent Template**
**Perfect for:**

- Improve the template structure
- Add new development tools
- Fix bugs in the boilerplate
- Enhance CI/CD workflows

**Skills needed:** Python, Ray Serve, DevOps


💡 **Examples**
**Perfect for:**

- Create new example agents
- Improve existing examples
- Add integration tutorials
- Showcase advanced use cases

**Skills needed:** Python, AI/ML, Domain expertise



### 2. Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/repo-name
cd repo-name

# Install dependencies  
poetry install  # For Python projects
npm install     # For docs projects (if applicable)

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 3. Making Changes


**Quality Guidelines:**

- Write clear, actionable content
- Include working code examples
- Test all instructions before submitting
- Follow existing patterns and style
  

| Content Type            | Requirements                               |
| ----------------------- | ------------------------------------------ |
| **Documentation** | Clear Markdown, tested links, updated TOC  |
| **Code**          | Tests, linting, type hints, documentation  |
| **Examples**      | README, setup instructions, usage examples |

### 4. Submitting Changes

```bash
# Commit your changes
git add .
git commit -m "feat: add new feature description"

# Push to your fork  
git push origin feature/your-feature-name
```


**Create a Pull Request on GitHub with:**

- Clear title and description
- Reference to related issues
- Screenshots if applicable
- Test results or demo links
  

---

## 🎯 Contribution Guidelines

### 📝 Commit Messages


Use conventional commit format for consistency:


| Type          | Usage            | Example                                     |
| ------------- | ---------------- | ------------------------------------------- |
| `feat:`     | New features     | `feat: add agent memory persistence`      |
| `fix:`      | Bug fixes        | `fix: resolve Redis connection timeout`   |
| `docs:`     | Documentation    | `docs: update quickstart guide`           |
| `refactor:` | Code refactoring | `refactor: simplify agent initialization` |
| `test:`     | Adding tests     | `test: add unit tests for workflows`      |

### 🧪 Code Quality


🔍 **Testing**

```bash
# Run tests before submitting
poetry run pytest

# Check test coverage  
poetry run pytest --cov
```



✨ **Linting**

```bash
# Run code formatting
poetry run ruff format

# Check for issues
poetry run ruff check
```



🏷️ **Type Checking**

```bash
# Verify type hints
poetry run mypy src/
```




### 📖 Documentation Standards


**Great documentation includes:**

- Clear, actionable headings with emojis
- Working code examples you can copy-paste
- Troubleshooting sections for common issues
- Links to related documentation
- Screenshots or diagrams where helpful
  

---

## 📋 Code of Conduct

### Our Commitment


We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.


### Expected Behavior

✅ **Do:**

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

❌ **Don't:**

- Troll, insult, or make derogatory comments
- Harass others publicly or privately
- Publish others' private information
- Engage in other inappropriate conduct

### Reporting Issues


If you experience or witness unacceptable behavior, please report it to the project maintainers. All reports will be handled confidentially.


**For the full Code of Conduct:** [CODE_OF_CONDUCT.md](https://github.com/your-org/praxis-docs/blob/main/CODE_OF_CONDUCT.md)

---

## 🆘 Getting Help

💬 **Community**

- Check existing GitHub Discussions
- Browse through resolved issues
- Attend community calls
  

🐛 **Bug Reports**
**Include:**

- Clear problem description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Relevant logs/errors
  

💡 **Feature Requests**
**Include:**

- Clear use case description
- Value explanation
- Implementation ideas
- Alternative approaches
  
  

---

## 🎉 Recognition


**Contributors are recognized in:**

- Project README files
- Release notes and changelogs
- Community showcases
- Annual contributor reports
- Special contributor badges
  

Thank you for helping make Praxis better! 🚀
