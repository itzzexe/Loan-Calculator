# Contributing to Modern Loan Calculator

Thank you for your interest in contributing to the Modern Loan Calculator! We welcome contributions from the community and are pleased to have you join us.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a new branch for your feature or bug fix
5. Make your changes
6. Test your changes thoroughly
7. Submit a pull request

## How to Contribute

### Types of Contributions

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new functionality
- **Code Contributions**: Implement new features or fix bugs
- **Documentation**: Improve or add documentation
- **Translations**: Add support for new languages
- **Currency Support**: Add new currencies or improve existing ones

### Areas for Contribution

- **Financial Calculations**: Improve accuracy or add new calculation methods
- **Currency System**: Add new currencies or improve exchange rate handling
- **User Interface**: Enhance the user experience and design
- **Performance**: Optimize calculations and rendering
- **Testing**: Add or improve test coverage
- **Accessibility**: Make the application more accessible

## Development Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Loan-Calculator.git
cd Loan-Calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## Coding Standards

### JavaScript/React Guidelines

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Follow ESLint configuration
- Use Prettier for code formatting

### File Organization

- Components in `src/components/`
- Utilities in `src/utils/`
- Constants in `src/constants/`
- Styles follow Tailwind CSS conventions

## Submitting Changes

### Pull Request Process

1. **Create a Branch**: Create a feature branch from `master`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Implement your changes following our coding standards

3. **Test**: Ensure all tests pass and add new tests if needed

4. **Commit**: Write clear, descriptive commit messages
   ```bash
   git commit -m "Add: New currency support for EUR"
   ```

5. **Push**: Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Pull Request**: Create a pull request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test results

### Commit Message Guidelines

Use conventional commit format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Browser, OS, device information
- **Screenshots**: If applicable

### Feature Requests

For feature requests, please include:

- **Description**: Clear description of the proposed feature
- **Use Case**: Why this feature would be useful
- **Implementation Ideas**: Any thoughts on implementation
- **Examples**: Similar features in other applications

## Currency Contributions

When adding new currencies:

1. Add currency to `src/constants/currencies.js`
2. Include proper formatting rules
3. Add exchange rate (use 1.0 as placeholder)
4. Test with all calculators
5. Update documentation

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Join our community discussions

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks for major features

Thank you for contributing to Modern Loan Calculator! 🎉