const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:3000');

        // Wait for input fields to be present
        await driver.wait(until.elementLocated(By.id('description')), 10000);
        await driver.wait(until.elementLocated(By.id('priority')), 10000);

        // Interact with elements
        let descriptionInput = await driver.findElement(By.id('description'));
        let priorityInput = await driver.findElement(By.id('priority'));
        let addButton = await driver.findElement(By.css('button.btn-success'));

        await descriptionInput.sendKeys('Test Task');
        await priorityInput.sendKeys('High');
        await addButton.click();

        // Wait for task to appear
        await driver.wait(until.elementLocated(By.xpath("//td[contains(text(),'Test Task')]")), 100000);

        // Verify the task is added
        let taskText = await driver.findElement(By.xpath("//td[contains(text(),'Test Task')]")).getText();
        assert.strictEqual(taskText, 'Test Task', 'Task description does not match');

    } finally {
        await driver.quit();
    }
})();
