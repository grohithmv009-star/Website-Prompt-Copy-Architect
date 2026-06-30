import { WebsiteCopy, CodeResult } from "../types";

export interface SpreadsheetExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

/**
 * Creates a beautiful multi-tab Google Sheet and populates it with all generated copy and code.
 */
export async function createAndPopulateSpreadsheet(
  accessToken: string,
  businessName: string,
  copyData: WebsiteCopy,
  codeData: CodeResult | null
): Promise<SpreadsheetExportResult> {
  const title = `${businessName || "My Business"} - Website Copy & Code Architect`;

  // 1. Create Spreadsheet with custom tabs
  const sheets = [
    { properties: { title: "Homepage Copy" } },
    { properties: { title: "About Us Copy" } },
    { properties: { title: "Services Copy" } },
    { properties: { title: "Contact Copy" } },
  ];

  if (codeData) {
    sheets.push({ properties: { title: "Developer Layout Code" } });
  }

  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: { title },
      sheets,
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    console.error("Create spreadsheet error details:", errText);
    throw new Error(`Failed to create Google Sheet: ${createRes.statusText}`);
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const spreadsheetUrl = spreadsheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Prepare value datasets
  const batchData: any[] = [];

  // 2a. Homepage Data
  const homepageValues = [
    ["Section", "Element Type", "Copy Text content"],
    ["SEO Spec", "SEO Title Tag", copyData.homepage.seoTitle],
    ["SEO Spec", "SEO Meta Description", copyData.homepage.seoDescription],
    ["Hero Section", "Headline (H1)", copyData.homepage.heroSection.headline],
    ["Hero Section", "Subheadline (Body)", copyData.homepage.heroSection.subheadline],
    ["Hero Section", "Primary CTA Button", copyData.homepage.heroSection.ctaText],
    ["Introduction", "Heading (H2)", copyData.homepage.introduction.heading],
    ["Introduction", "Body Paragraph", copyData.homepage.introduction.bodyText],
    ["Services Grid", "Service 1 Title", copyData.homepage.features[0]?.title || ""],
    ["Services Grid", "Service 1 Description", copyData.homepage.features[0]?.description || ""],
    ["Services Grid", "Service 2 Title", copyData.homepage.features[1]?.title || ""],
    ["Services Grid", "Service 2 Description", copyData.homepage.features[1]?.description || ""],
    ["Services Grid", "Service 3 Title", copyData.homepage.features[2]?.title || ""],
    ["Services Grid", "Service 3 Description", copyData.homepage.features[2]?.description || ""],
    ["CTA Banner", "Heading", copyData.homepage.ctaSection.heading],
    ["CTA Banner", "Body", copyData.homepage.ctaSection.body],
    ["CTA Banner", "Button Text", copyData.homepage.ctaSection.buttonText],
  ];
  batchData.push({
    range: "'Homepage Copy'!A1:C100",
    values: homepageValues,
  });

  // 2b. About Us Data
  const aboutValues = [
    ["Section", "Element Type", "Copy Text content"],
    ["SEO Spec", "SEO Title Tag", copyData.aboutUs.seoTitle],
    ["SEO Spec", "SEO Meta Description", copyData.aboutUs.seoDescription],
    ["Main Header", "H1 Page Heading", copyData.aboutUs.heading],
    ["Company Story", "Background Story (Body)", copyData.aboutUs.backgroundStory],
    ["Mission & Values", "Mission Statement Blockquote", copyData.aboutUs.missionStatement],
  ];
  batchData.push({
    range: "'About Us Copy'!A1:C100",
    values: aboutValues,
  });

  // 2c. Services Data
  const servicesValues = [
    ["Section", "Element Type", "Copy Text content"],
    ["SEO Spec", "SEO Title Tag", copyData.services.seoTitle],
    ["SEO Spec", "SEO Meta Description", copyData.services.seoDescription],
    ["Main Header", "H1 Page Heading", copyData.services.heading],
    ["Intro Description", "Intro Paragraph (Body)", copyData.services.description],
  ];
  copyData.services.offerings.forEach((offering, idx) => {
    servicesValues.push([`Catalog Listing ${idx + 1}`, "Service Title", offering.title]);
    servicesValues.push([`Catalog Listing ${idx + 1}`, "Service Description", offering.description]);
  });
  batchData.push({
    range: "'Services Copy'!A1:C100",
    values: servicesValues,
  });

  // 2d. Contact Data
  const contactValues = [
    ["Section", "Element Type", "Copy Text content"],
    ["SEO Spec", "SEO Title Tag", copyData.contact.seoTitle],
    ["SEO Spec", "SEO Meta Description", copyData.contact.seoDescription],
    ["Main Header", "H1 Page Heading", copyData.contact.heading],
    ["Intro Pitch", "Intro Text (Body)", copyData.contact.introText],
    ["Action CTA", "CTA Button Text", copyData.contact.ctaText],
  ];
  batchData.push({
    range: "'Contact Copy'!A1:C100",
    values: contactValues,
  });

  // 2e. Code Data
  if (codeData) {
    const codeValues = [
      ["Key Element", "Value/Code Content"],
      ["Developer Prompt", codeData.promptForDeveloper],
      ["Semantic HTML Markup", codeData.html],
      ["CSS Override Code", codeData.css],
      ["Vanilla JavaScript Code", codeData.javascript],
      ["Self-Contained Bundle (index.html)", codeData.combinedHtml],
    ];
    batchData.push({
      range: "'Developer Layout Code'!A1:B100",
      values: codeValues,
    });
  }

  // 3. Fire batch update request
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueInputOption: "USER_ENTERED",
        data: batchData,
      }),
    }
  );

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    console.error("Batch update error details:", errText);
    throw new Error(`Failed to populate spreadsheet cells: ${updateRes.statusText}`);
  }

  // 4. Set some basic styling (Auto-resize columns if possible or simple headers styling)
  // We can do autoResizeDimensions via batchUpdate for a premium polished feel!
  try {
    const sheetsMetadata = spreadsheet.sheets || [];
    const requests = sheetsMetadata.map((s: any) => ({
      autoResizeDimensions: {
        dimensions: {
          sheetId: s.properties.sheetId,
          dimension: "COLUMNS",
          startIndex: 0,
          endIndex: 3,
        },
      },
    }));

    if (requests.length > 0) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      });
    }
  } catch (styleErr) {
    console.warn("Could not apply auto-resize styles:", styleErr);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
  };
}
