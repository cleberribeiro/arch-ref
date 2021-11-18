module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    'coverageReporters': ['json', ['lcov', {'projectRoot': './coverage'}], 'text'],
    coverageThreshold: {
      'global': {
        'functions': 90,
        'lines': 90,
        'statements': 90,
        'branch': 90
      }
    },
    moduleDirectories: [
      'node_modules',
    ],

    preset: 'ts-jest',
    roots: [
      'tests'
    ],
    testEnvironment: 'node',
    testMatch: [
      '*/tests//.[jt]s?(x)',
      "**/tests/unit/**/*.[jt]s?(x)",
      '*/?(.)+(spec|test).[tj]s?(x)'
    ],
    reporters: ['default'],
    transform: { '^.+\\.tsx?$': 'ts-jest' },
    verbose: true,
    moduleNameMapper: {
      '^src/(.*)': ['<rootDir>/src/$1']
    }
  };