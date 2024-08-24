// const { Builder, By, until } = require('selenium-webdriver');
// const assert = require('assert');

// describe('To-Do App', function() {
//   this.timeout(10000); // Increase timeout to 10 seconds
//   let driver;

//   before(async function() {
//     console.log('Initializing WebDriver...');
//     driver = await new Builder().forBrowser('chrome').build();
//   });

//   after(async function() {
//     console.log('Quitting WebDriver...');
//     await driver.quit();
//   });

//   it('should add a task', async function() {
//     console.log('Navigating to URL...');
//     await driver.get('http://localhost:3000'); // URL of your app

//     console.log('Waiting for description input...');
//     const descriptionInput = await driver.wait(until.elementLocated(By.id('description')), 10000);
//     await descriptionInput.sendKeys('Test Task');

//     console.log('Waiting for priority input...');
//     const priorityInput = await driver.wait(until.elementLocated(By.id('priority')), 10000);
//     await priorityInput.sendKeys('High');

//     console.log('Waiting for add button to be clickable...');
//     const addButton = await driver.wait(until.elementLocated(By.css('button')), 10000);
//     await driver.wait(until.elementIsClickable(addButton), 10000);
//     await addButton.click();

//     console.log('Waiting for task to appear in the list...');
//     const taskList = await driver.wait(until.elementLocated(By.id('taskList')), 10000);
//     await driver.wait(until.elementTextContains(taskList, 'Test Task'), 10000);

//     console.log('Checking if task appears in the list...');
//     const tasks = await taskList.getText();
//     console.log('Tasks:', tasks);
//     assert(tasks.includes('Test Task'));
//   });
// });


const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('To-Do App', function() {
  this.timeout(10000); // Increase timeout to 10 seconds
  let driver;

  before(async function() {
    console.log('Initializing WebDriver...');
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    console.log('Quitting WebDriver...');
    await driver.quit();
  });

  it('should add a task', async function() {
    console.log('Navigating to URL...');
    await driver.get('http://localhost:3000'); // URL of your app

    console.log('Waiting for description input...');
    const descriptionInput = await driver.wait(until.elementLocated(By.id('description')), 10000);
    await descriptionInput.sendKeys('Test Tasker');

    console.log('Waiting for priority input...');
    const priorityInput = await driver.wait(until.elementLocated(By.id('priority')), 10000);
    await priorityInput.sendKeys('Higher');

    console.log('Waiting for add button to be visible and clickable...');
    const addButton = await driver.wait(until.elementLocated(By.css('button')), 10000);
    await driver.wait(async function() {
      const isDisplayed = await addButton.isDisplayed();
      const isEnabled = await addButton.isEnabled();
      return isDisplayed && isEnabled;
    }, 10000);
    await addButton.click();

    console.log('Waiting for task to appear in the list...');
    const taskList = await driver.wait(until.elementLocated(By.id('taskList')), 10000);
    await driver.wait(async function() {
      const tasks = await taskList.getText();
      return tasks.includes('Test Tasker');
    }, 10000);

    console.log('Checking if task appears in the list...');
    const tasks = await taskList.getText();
    console.log('Tasks:', tasks);
    assert(tasks.includes('Test Tasker'));
  });
});
