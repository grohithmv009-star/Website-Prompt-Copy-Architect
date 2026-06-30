export interface FeatureItem {
  title: string;
  description: string;
}

export interface HomepageCopy {
  seoTitle: string;
  seoDescription: string;
  heroSection: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  introduction: {
    heading: string;
    bodyText: string;
  };
  features: FeatureItem[];
  ctaSection: {
    heading: string;
    body: string;
    buttonText: string;
  };
}

export interface AboutUsCopy {
  seoTitle: string;
  seoDescription: string;
  heading: string;
  backgroundStory: string;
  missionStatement: string;
}

export interface ServicesCopy {
  seoTitle: string;
  seoDescription: string;
  heading: string;
  description: string;
  offerings: FeatureItem[];
}

export interface ContactCopy {
  seoTitle: string;
  seoDescription: string;
  heading: string;
  introText: string;
  ctaText: string;
}

export interface WebsiteCopy {
  homepage: HomepageCopy;
  aboutUs: AboutUsCopy;
  services: ServicesCopy;
  contact: ContactCopy;
  promptForFreelancer: string;
}

export interface CodeResult {
  html: string;
  css: string;
  javascript: string;
  combinedHtml: string;
  promptForDeveloper: string;
}

export interface ProjectParams {
  businessName: string;
  industry: string;
  targetAudience: string;
  goal: string;
  tone: string;
  mainOfferings: string;
  accentColor: string;
  visualStyle: string;
}
