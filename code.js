// Figma Sandbox Thread (code.ts)
// Compiles to /code.js in the root
figma.showUI(__html__, { width: 420, height: 600, themeColors: true });
// Helper to convert HEX to Figma RGB [0, 1]
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 1, b: 1 };
}
// Helper to load standard fonts dynamically
async function loadFont(isBold = false) {
    const font = { family: "Inter", style: isBold ? "Bold" : "Regular" };
    await figma.loadFontAsync(font);
    return font;
}
// Helper to create and style text nodes
async function createTextNode(parent, characters, fontSize, isBold, colorHex, align = "LEFT") {
    const text = figma.createText();
    const font = await loadFont(isBold);
    text.fontName = font;
    text.fontSize = fontSize;
    text.characters = characters;
    text.fills = [{ type: 'SOLID', color: hexToRgb(colorHex) }];
    text.textAlignHorizontal = align;
    parent.appendChild(text);
    return text;
}
// Helper function to build a complete Match Card Frame node
async function createMatchCardNode(match, competitionName, turnName, updatedLabel, weekday, time, date, penaltiesText) {
    // 1. Create main container frame
    const cardFrame = figma.createFrame();
    cardFrame.name = `MatchCard - ${match.homeTeam.shortName || match.homeTeam.name} vs ${match.awayTeam.shortName || match.awayTeam.name}`;
    cardFrame.resize(360, 260);
    cardFrame.cornerRadius = 20;
    // Auto Layout settings
    cardFrame.layoutMode = "VERTICAL";
    cardFrame.primaryAxisSizingMode = "AUTO"; // height hugs content
    cardFrame.counterAxisSizingMode = "FIXED"; // fixed width
    cardFrame.paddingLeft = 24;
    cardFrame.paddingRight = 24;
    cardFrame.paddingTop = 20;
    cardFrame.paddingBottom = 20;
    cardFrame.itemSpacing = 16;
    // Dark card styling
    cardFrame.fills = [{
            type: 'SOLID',
            color: hexToRgb('#16161A')
        }];
    cardFrame.strokes = [{
            type: 'SOLID',
            color: hexToRgb('#2D2D35')
        }];
    cardFrame.strokeWeight = 1;
    // Add a shadow effect
    cardFrame.effects = [{
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.4 },
            offset: { x: 0, y: 12 },
            radius: 24,
            visible: true,
            blendMode: 'NORMAL'
        }];
    // 2. Header Row (Competition Brand & Turn Name)
    const headerFrame = figma.createFrame();
    headerFrame.name = "Header";
    headerFrame.layoutMode = "HORIZONTAL";
    headerFrame.primaryAxisSizingMode = "AUTO";
    headerFrame.counterAxisSizingMode = "AUTO";
    headerFrame.layoutAlign = "STRETCH";
    headerFrame.itemSpacing = 8;
    headerFrame.fills = []; // transparent
    headerFrame.backgrounds = [];
    // Logo Badge
    const badgeFrame = figma.createFrame();
    badgeFrame.name = "Badge";
    badgeFrame.layoutMode = "HORIZONTAL";
    badgeFrame.primaryAxisSizingMode = "AUTO";
    badgeFrame.counterAxisSizingMode = "AUTO";
    badgeFrame.paddingLeft = 8;
    badgeFrame.paddingRight = 8;
    badgeFrame.paddingTop = 4;
    badgeFrame.paddingBottom = 4;
    badgeFrame.cornerRadius = 6;
    badgeFrame.fills = [{ type: 'SOLID', color: hexToRgb('#FBB800') }]; // Kings Yellow
    const badgeText = figma.createText();
    const boldFont = await loadFont(true);
    badgeText.fontName = boldFont;
    badgeText.fontSize = 9;
    badgeText.characters = (competitionName || "KINGS LEAGUE").toUpperCase();
    badgeText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    badgeFrame.appendChild(badgeText);
    headerFrame.appendChild(badgeFrame);
    // Turn Info Text
    await createTextNode(headerFrame, turnName.toUpperCase(), 11, true, '#FFFFFF');
    // Spacer to push elements to both sides
    const spacer = figma.createFrame();
    spacer.name = "Spacer";
    spacer.fills = [];
    headerFrame.appendChild(spacer);
    // Update/Import timestamp
    await createTextNode(headerFrame, updatedLabel, 9, false, '#8E8E9C', 'RIGHT');
    cardFrame.appendChild(headerFrame);
    // 3. Separator Line
    const sep = figma.createFrame();
    sep.name = "Separator";
    sep.layoutAlign = "STRETCH";
    sep.resize(sep.width, 1);
    sep.fills = [{ type: 'SOLID', color: hexToRgb('#2D2D35') }];
    cardFrame.appendChild(sep);
    // 4. Scoreboard Row (Home vs Away)
    const scoreFrame = figma.createFrame();
    scoreFrame.name = "Scoreboard";
    scoreFrame.layoutMode = "HORIZONTAL";
    scoreFrame.primaryAxisSizingMode = "AUTO";
    scoreFrame.counterAxisSizingMode = "AUTO";
    scoreFrame.layoutAlign = "STRETCH";
    scoreFrame.itemSpacing = 12;
    scoreFrame.fills = [];
    // A. Home Team Block
    const homeBlock = figma.createFrame();
    homeBlock.name = "HomeTeam";
    homeBlock.layoutMode = "VERTICAL";
    homeBlock.primaryAxisSizingMode = "AUTO";
    homeBlock.counterAxisSizingMode = "FIXED";
    homeBlock.resize(100, homeBlock.height);
    homeBlock.itemSpacing = 8;
    homeBlock.fills = [];
    // Home Logo Node
    const homeLogoNode = figma.createEllipse();
    homeLogoNode.name = "Logo";
    homeLogoNode.resize(48, 48);
    homeLogoNode.fills = [{ type: 'SOLID', color: hexToRgb(match.homeTeam.colorHex) }];
    if (match.homeTeam.logoUrl) {
        try {
            const img = await figma.createImageAsync(match.homeTeam.logoUrl);
            homeLogoNode.fills = [{
                    type: 'IMAGE',
                    imageHash: img.hash,
                    scaleMode: 'FILL'
                }];
        }
        catch (e) {
            console.log("Could not load home logo image directly, falling back to brand color background");
        }
    }
    homeBlock.appendChild(homeLogoNode);
    // Home Name
    const homeName = await createTextNode(homeBlock, match.homeTeam.shortName || match.homeTeam.name, 12, true, '#FFFFFF', 'CENTER');
    homeName.layoutAlign = "STRETCH";
    scoreFrame.appendChild(homeBlock);
    // B. VS / Score Info Block
    const vsBlock = figma.createFrame();
    vsBlock.name = "VS_Block";
    vsBlock.layoutMode = "VERTICAL";
    vsBlock.primaryAxisSizingMode = "AUTO";
    vsBlock.counterAxisSizingMode = "FIXED";
    vsBlock.resize(100, vsBlock.height);
    vsBlock.itemSpacing = 4;
    vsBlock.fills = [];
    const hasScore = match.scores.homeScore !== null && match.scores.awayScore !== null;
    if (hasScore) {
        // Render score numbers
        const scoreRow = figma.createFrame();
        scoreRow.name = "Score";
        scoreRow.layoutMode = "HORIZONTAL";
        scoreRow.primaryAxisSizingMode = "AUTO";
        scoreRow.counterAxisSizingMode = "AUTO";
        scoreRow.itemSpacing = 8;
        scoreRow.fills = [];
        await createTextNode(scoreRow, String(match.scores.homeScore), 24, true, '#FFFFFF', 'RIGHT');
        await createTextNode(scoreRow, "-", 18, true, '#4E4E5A', 'CENTER');
        await createTextNode(scoreRow, String(match.scores.awayScore), 24, true, '#FFFFFF', 'LEFT');
        vsBlock.appendChild(scoreRow);
        // Penalties if present
        if (penaltiesText) {
            await createTextNode(vsBlock, penaltiesText, 9, true, '#FBB800', 'CENTER');
        }
    }
    else {
        // Render simple VS
        const vsBadge = figma.createFrame();
        vsBadge.name = "VS";
        vsBadge.layoutMode = "HORIZONTAL";
        vsBadge.primaryAxisSizingMode = "AUTO";
        vsBadge.counterAxisSizingMode = "AUTO";
        vsBadge.paddingLeft = 10;
        vsBadge.paddingRight = 10;
        vsBadge.paddingTop = 4;
        vsBadge.paddingBottom = 4;
        vsBadge.cornerRadius = 20;
        vsBadge.fills = [{ type: 'SOLID', color: hexToRgb('#2D2D35') }];
        const vsTextNode = figma.createText();
        vsTextNode.fontName = boldFont;
        vsTextNode.fontSize = 11;
        vsTextNode.characters = "VS";
        vsTextNode.fills = [{ type: 'SOLID', color: hexToRgb('#8E8E9C') }];
        vsBadge.appendChild(vsTextNode);
        vsBlock.appendChild(vsBadge);
    }
    // Add time indicator
    const weekdayStr = weekday || "TBD";
    const timeStr = time || "TBD";
    await createTextNode(vsBlock, `${weekdayStr} ${timeStr}`, 9, false, '#8E8E9C', 'CENTER');
    scoreFrame.appendChild(vsBlock);
    // C. Away Team Block
    const awayBlock = figma.createFrame();
    awayBlock.name = "AwayTeam";
    awayBlock.layoutMode = "VERTICAL";
    awayBlock.primaryAxisSizingMode = "AUTO";
    awayBlock.counterAxisSizingMode = "FIXED";
    awayBlock.resize(100, awayBlock.height);
    awayBlock.itemSpacing = 8;
    awayBlock.fills = [];
    // Away Logo Node
    const awayLogoNode = figma.createEllipse();
    awayLogoNode.name = "Logo";
    awayLogoNode.resize(48, 48);
    awayLogoNode.fills = [{ type: 'SOLID', color: hexToRgb(match.awayTeam.colorHex) }];
    if (match.awayTeam.logoUrl) {
        try {
            const img = await figma.createImageAsync(match.awayTeam.logoUrl);
            awayLogoNode.fills = [{
                    type: 'IMAGE',
                    imageHash: img.hash,
                    scaleMode: 'FILL'
                }];
        }
        catch (e) {
            console.log("Could not load away logo image directly, falling back to brand color background");
        }
    }
    awayBlock.appendChild(awayLogoNode);
    // Away Name
    const awayName = await createTextNode(awayBlock, match.awayTeam.shortName || match.awayTeam.name, 12, true, '#FFFFFF', 'CENTER');
    awayName.layoutAlign = "STRETCH";
    scoreFrame.appendChild(awayBlock);
    cardFrame.appendChild(scoreFrame);
    return cardFrame;
}
// Receive messages from Figma UI thread
figma.ui.onmessage = async (msg) => {
    try {
        if (msg.type === 'get-credentials') {
            let username = await figma.clientStorage.getAsync('kama_username');
            let password = await figma.clientStorage.getAsync('kama_password');
            const language = await figma.clientStorage.getAsync('kama_language') || 'es';
            const loggedOut = await figma.clientStorage.getAsync('kama_logged_out');
            // If credentials have never been set, or if they are empty and user hasn't explicitly logged out
            if (username === undefined || password === undefined || (!username && !password && !loggedOut)) {
                username = 'kosmos.design';
                password = 'zbi3WFxW!F2BW#oi';
                await figma.clientStorage.setAsync('kama_username', username);
                await figma.clientStorage.setAsync('kama_password', password);
            }
            figma.ui.postMessage({ type: 'credentials', username: username || '', password: password || '', language });
        }
        else if (msg.type === 'set-credentials') {
            await figma.clientStorage.setAsync('kama_username', msg.username);
            await figma.clientStorage.setAsync('kama_password', msg.password);
            await figma.clientStorage.deleteAsync('kama_logged_out');
            figma.ui.postMessage({ type: 'credentials-saved' });
        }
        else if (msg.type === 'clear-credentials') {
            await figma.clientStorage.deleteAsync('kama_username');
            await figma.clientStorage.deleteAsync('kama_password');
            await figma.clientStorage.setAsync('kama_logged_out', true);
            figma.ui.postMessage({ type: 'credentials-cleared' });
        }
        else if (msg.type === 'set-language') {
            await figma.clientStorage.setAsync('kama_language', msg.language);
        }
        else if (msg.type === 'import-match-card') {
            const { match, competitionName, turnName, updatedLabel, weekday, time, date, penaltiesText, notificationText } = msg;
            const cardFrame = await createMatchCardNode(match, competitionName, turnName, updatedLabel, weekday, time, date, penaltiesText);
            figma.currentPage.appendChild(cardFrame);
            figma.currentPage.selection = [cardFrame];
            figma.viewport.scrollAndZoomIntoView([cardFrame]);
            figma.notify(notificationText || `¡Partido importado al lienzo!`);
        }
        else if (msg.type === 'import-schedule') {
            const { matches, competitionName, turnName, updatedLabel, notificationText } = msg;
            // Create a vertical stack for the entire schedule
            const containerFrame = figma.createFrame();
            containerFrame.name = `Schedule - ${competitionName} - ${turnName}`;
            containerFrame.layoutMode = "VERTICAL";
            containerFrame.primaryAxisSizingMode = "AUTO"; // hugs content height
            containerFrame.counterAxisSizingMode = "AUTO"; // hugs content width
            containerFrame.itemSpacing = 20; // spacing between cards
            containerFrame.fills = []; // transparent
            containerFrame.backgrounds = [];
            for (const m of matches) {
                const cardFrame = await createMatchCardNode(m.match, competitionName, turnName, updatedLabel, m.weekday, m.time, m.date, m.penaltiesText);
                containerFrame.appendChild(cardFrame);
            }
            figma.currentPage.appendChild(containerFrame);
            figma.currentPage.selection = [containerFrame];
            figma.viewport.scrollAndZoomIntoView([containerFrame]);
            figma.notify(notificationText || `¡Jornada importada al lienzo!`);
        }
    }
    catch (err) {
        const error = err;
        console.error("Figma Sandbox import error:", error);
        figma.notify(`Error al importar partido: ${error.message || String(error)}`);
    }
};
