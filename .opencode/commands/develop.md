read $ARGUMENTS and start developing step by step following that breakdown.

# Development process

Each breakdown item should be implemented in the following three steps:

## Steps for every breakdown item

### 1. Development

use the @developer subagent to develop a specific breakdown item only.

### 2. Review

use the @analyst subagent to review the work generated in step 1 as a code review.
Perform design review, classes review, interfaces review. But also check file problems of each modified file (e.g. via `intellij_get_file_problems` tool) to fix warnings and errors (not weak warnings)

### 3. Fix

use the @developer subagent to implement fixes pointed out in step 2.

## After-work

after a specific breakdown item is done, make sure you perform the following:

1. execute `intellij_reformat_file` on every modified file so that we have the styling in-line
2. run all unit tests in the solution
3. commit changes with a short commit message. Messages should start with robot emoji.

## General rules for development

This is a trivial utility application that will be subject to frequent and significant changes.
In order to make those as painless as possible, stick to the following rules.

### Reasonable unit tests coverage

Do not write too many unit tests for stuff related to browsing the webpages as those
might change in the future and those tests will hinder future development.

### Simplicity

Do not write complex, layered, generic stuff unless it allows for noticable simplifaction or de-noising of the codebase.
This is meant to evolve quickly and frequently.