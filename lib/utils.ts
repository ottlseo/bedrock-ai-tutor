import * as fs from 'fs/promises';

export const updateApiEndpointToWebStack = async (apiUrl: string) => {
    console.log(`=== Updating API URL to ${apiUrl} ===`);
    const indexHtmlPath = 'lib/webStack/fe/index.html';
    try {
        // reading index.html file
        let indexHtml = await fs.readFile(indexHtmlPath, 'utf-8');
        // replace API URL string in index.html
        indexHtml = indexHtml.replace('INSERT_YOUR_API_GW_ENDPOINT', apiUrl);
        // writing file as API URL updated 
        await fs.writeFile(indexHtmlPath, indexHtml);
        console.log("=== API URL successfully updated ===");
    } catch (err) {
        console.error('Error updating API URL:', err);
    }
};