const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

let results = [];
let logs = [];

function init() {
    results = [];
    logs = [];
}

function log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    logs.push(logMsg);
    console.log(logMsg);
}

function addResult(result) {
    results.push(result);
}

async function generateAndPrint() {
    log('Generating beautifully styled Excel test report...');
    const wb = new ExcelJS.Workbook();

    // ----------------------------------------------------
    // SHEET 1: DASHBOARD
    // ----------------------------------------------------
    const wsDash = wb.addWorksheet('Summary Dashboard', {
        views: [{ showGridLines: true }]
    });

    // Fills and Fonts Definitions
    const navyFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B4D3E' } }; // Forest Green
    const grayFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
    const greenFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD4EDDA' } }; // Soft green
    const redFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8D7DA' } }; // Soft red

    const whiteFont = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    const titleFont = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FF1B4D3E' } };
    const sectionFont = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FF000000' } };
    const boldFont = { name: 'Segoe UI', size: 11, bold: true };
    const regularFont = { name: 'Segoe UI', size: 11 };

    const thinBorder = {
        top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
    };

    // Dashboard Title
    wsDash.rowDimensions = wsDash.rowDimensions || {};
    wsDash.getRow(2).height = 30;
    const titleCell = wsDash.getCell('A2');
    titleCell.value = 'E2E Test Report - Crop Advisory & Farm Management';
    titleCell.font = titleFont;

    // Metadata Box
    const executionTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const metadata = [
        ['Project Name:', 'AI-Based Crop Advisory & Farm Management System'],
        ['Environment:', 'Local Development'],
        ['Execution Date:', executionTime],
        ['Automation Suite:', 'Selenium Webdriver + JavaScript (exceljs)'],
        ['Test Execution OS:', process.platform]
    ];

    metadata.forEach((item, index) => {
        const rowNum = 4 + index;
        const cellK = wsDash.getCell(`A${rowNum}`);
        const cellV = wsDash.getCell(`B${rowNum}`);
        
        cellK.value = item[0];
        cellK.font = boldFont;
        cellK.fill = grayFill;
        cellK.border = thinBorder;

        cellV.value = item[1];
        cellV.font = regularFont;
        cellV.fill = grayFill;
        cellV.border = thinBorder;
    });

    // Stats calculations
    const total = results.length;
    const passed = results.filter(r => r.status === 'Pass').length;
    const failed = total - passed;
    const passRate = total > 0 ? (passed / total) * 100 : 0;

    wsDash.getCell('A11').value = 'Test Execution Metrics';
    wsDash.getCell('A11').font = sectionFont;

    // Stats Table Header
    const statsHeaders = ['Metric', 'Value'];
    statsHeaders.forEach((h, colIdx) => {
        const cell = wsDash.getCell(13, colIdx + 1);
        cell.value = h;
        cell.font = whiteFont;
        cell.fill = navyFill;
        cell.alignment = { horizontal: 'center' };
        cell.border = thinBorder;
    });

    // Stats Table Data
    const statsRows = [
        ['Total Test Cases', total],
        ['Passed', passed],
        ['Failed', failed],
        ['Pass Rate (%)', `${passRate.toFixed(2)}%`]
    ];

    statsRows.forEach((item, index) => {
        const rowNum = 14 + index;
        const cellK = wsDash.getCell(`A${rowNum}`);
        const cellV = wsDash.getCell(`B${rowNum}`);

        cellK.value = item[0];
        cellK.font = regularFont;
        cellK.border = thinBorder;

        cellV.value = item[1];
        cellV.font = boldFont;
        cellV.alignment = { horizontal: 'center' };
        cellV.border = thinBorder;

        if (item[0] === 'Passed') {
            cellV.fill = greenFill;
        } else if (item[0] === 'Failed') {
            cellV.fill = redFill;
        }
    });

    // Category Breakdown Table
    wsDash.getCell('D11').value = 'Category Breakdown';
    wsDash.getCell('D11').font = sectionFont;

    const catHeaders = ['Category', 'Total', 'Passed', 'Failed', 'Pass %'];
    catHeaders.forEach((h, colIdx) => {
        const cell = wsDash.getCell(13, colIdx + 4);
        cell.value = h;
        cell.font = whiteFont;
        cell.fill = navyFill;
        cell.alignment = { horizontal: 'center' };
        cell.border = thinBorder;
    });

    // Get unique categories
    const categories = [...new Set(results.map(r => r.category))].sort();
    categories.forEach((cat, index) => {
        const rowNum = 14 + index;
        const catTotal = results.filter(r => r.category === cat).length;
        const catPass = results.filter(r => r.category === cat && r.status === 'Pass').length;
        const catFail = catTotal - catPass;
        const catPct = catTotal > 0 ? (catPass / catTotal) * 100 : 0;

        wsDash.getCell(`D${rowNum}`).value = cat;
        wsDash.getCell(`E${rowNum}`).value = catTotal;
        wsDash.getCell(`F${rowNum}`).value = catPass;
        wsDash.getCell(`G${rowNum}`).value = catFail;
        wsDash.getCell(`H${rowNum}`).value = `${catPct.toFixed(1)}%`;

        wsDash.getCell(`D${rowNum}`).font = regularFont;
        wsDash.getCell(`D${rowNum}`).border = thinBorder;

        for (let colIdx = 5; colIdx <= 8; colIdx++) {
            const cell = wsDash.getCell(rowNum, colIdx);
            cell.font = colIdx === 8 ? boldFont : regularFont;
            cell.alignment = { horizontal: 'center' };
            cell.border = thinBorder;
        }
    });

    // Set column widths for Dashboard
    wsDash.getColumn('A').width = 25;
    wsDash.getColumn('B').width = 45;
    wsDash.getColumn('C').width = 5;
    wsDash.getColumn('D').width = 20;
    wsDash.getColumn('E').width = 12;
    wsDash.getColumn('F').width = 12;
    wsDash.getColumn('G').width = 12;
    wsDash.getColumn('H').width = 12;

    // ----------------------------------------------------
    // SHEET 2: DETAILED TEST CASES
    // ----------------------------------------------------
    const wsDetails = wb.addWorksheet('Detailed Test Cases', {
        views: [{ showGridLines: true }]
    });

    const headers = [
        'Test Case ID', 'Category', 'Module', 
        'Description', 'Steps to Reproduce / Verify', 
        'Expected Result', 'Actual Result', 'Status'
    ];

    wsDetails.getRow(1).height = 26;
    headers.forEach((h, colIdx) => {
        const cell = wsDetails.getCell(1, colIdx + 1);
        cell.value = h;
        cell.font = whiteFont;
        cell.fill = navyFill;
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = thinBorder;
    });

    const greenTextFont = { name: 'Segoe UI', size: 10, color: { argb: 'FF155724' }, bold: true };
    const redTextFont = { name: 'Segoe UI', size: 10, color: { argb: 'FF721C24' }, bold: true };

    results.forEach((r, index) => {
        const rowNum = 2 + index;
        wsDetails.getRow(rowNum).height = 45;

        wsDetails.getCell(`A${rowNum}`).value = r.id;
        wsDetails.getCell(`A${rowNum}`).font = boldFont;

        wsDetails.getCell(`B${rowNum}`).value = r.category;
        wsDetails.getCell(`B${rowNum}`).font = regularFont;

        wsDetails.getCell(`C${rowNum}`).value = r.module;
        wsDetails.getCell(`C${rowNum}`).font = regularFont;

        wsDetails.getCell(`D${rowNum}`).value = r.description;
        wsDetails.getCell(`D${rowNum}`).font = regularFont;
        wsDetails.getCell(`D${rowNum}`).alignment = { vertical: 'middle', wrapText: true };

        wsDetails.getCell(`E${rowNum}`).value = r.steps;
        wsDetails.getCell(`E${rowNum}`).font = regularFont;
        wsDetails.getCell(`E${rowNum}`).alignment = { vertical: 'middle', wrapText: true };

        wsDetails.getCell(`F${rowNum}`).value = r.expected;
        wsDetails.getCell(`F${rowNum}`).font = regularFont;
        wsDetails.getCell(`F${rowNum}`).alignment = { vertical: 'middle', wrapText: true };

        wsDetails.getCell(`G${rowNum}`).value = r.actual;
        wsDetails.getCell(`G${rowNum}`).font = regularFont;
        wsDetails.getCell(`G${rowNum}`).alignment = { vertical: 'middle', wrapText: true };

        const cellStatus = wsDetails.getCell(`H${rowNum}`);
        cellStatus.value = r.status;
        cellStatus.alignment = { horizontal: 'center', vertical: 'middle' };

        if (r.status === 'Pass') {
            cellStatus.font = greenTextFont;
            cellStatus.fill = greenFill;
        } else {
            cellStatus.font = redTextFont;
            cellStatus.fill = redFill;
        }

        // Apply borders to all columns in this row
        for (let colIdx = 1; colIdx <= 8; colIdx++) {
            wsDetails.getCell(rowNum, colIdx).border = thinBorder;
        }
    });

    // Set custom column widths for Details
    wsDetails.getColumn('A').width = 15;
    wsDetails.getColumn('B').width = 18;
    wsDetails.getColumn('C').width = 18;
    wsDetails.getColumn('D').width = 40;
    wsDetails.getColumn('E').width = 40;
    wsDetails.getColumn('F').width = 40;
    wsDetails.getColumn('G').width = 40;
    wsDetails.getColumn('H').width = 12;

    // Save Workbook to disk
    const dateStr = new Date().toISOString().split('.')[0].replace(/:/g, '-');
    const reportFilename = `E2E_Test_Report_CropAdvisory_${dateStr}.xlsx`;
    const outputPath = path.join(__dirname, reportFilename);
    
    await wb.xlsx.writeFile(outputPath);
    log(`Excel report successfully saved as: ${reportFilename}`);

    // Print summary report
    console.log('\n==================================================');
    console.log('                 TEST SUITE SUMMARY               ');
    console.log('==================================================');
    console.log(`Total Test Cases: ${total}`);
    console.log(`Passed:           ${passed}`);
    console.log(`Failed:           ${failed}`);
    console.log(`Pass Rate:        ${passRate.toFixed(2)}%`);
    console.log('==================================================\n');

    return { passed, failed };
}

module.exports = {
    init,
    log,
    addResult,
    generateAndPrint
};
