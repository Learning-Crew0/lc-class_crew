const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testCoalitionAPI() {
    const formData = new FormData();

    // Add test data
    formData.append('name', 'Test User');
    formData.append('affiliation', 'Test Organization');
    formData.append('field', 'Test Field');
    formData.append('contact', '01012345678');
    formData.append('email', 'test@example.com');

    // Create a dummy file for testing
    const testFile = Buffer.from('test file content');
    formData.append('file', testFile, {
        filename: 'test.txt',
        contentType: 'text/plain'
    });

    try {
        console.log('Testing Coalition API...');

        const response = await fetch('https://classcrew.onrender.com/api/coalitions', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });

        const result = await response.json();

        console.log('Response Status:', response.status);
        console.log('Response:', JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testCoalitionAPI();