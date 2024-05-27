# ADR: Styling of Our Code

## Context and Problem Statement

Many of us may have a specific choice of styling our code when programming, but when working in a group setting, we would want all of our code to be consistent throughout the program.

## Considered Options

* ESLint
  
## Decision Outcome

Chosen option: We chose to use ESLint because it works with other tools like Prettier. ESLint checks through our code to see whether there are any errors like syntax or bracket errors and it will nofitfy us. It can be closely related to the W3C HTML/CSS Validator and instead of pushing our code directly and chacking throught the website, ESLint will automatically check it for us during our merging process.

## Conclusion

By using ESLint, we will have consistent styling throughout our program and alerts us for any syntax errors. It is implemented as part of our CI/CD pipeline so it can automatically check our code when we try to merge. Additionally, many of us will not have the time to go through every file that other people wrote and check for styling or errors.
