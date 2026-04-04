import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { z } from "npm:zod@3.25.76";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting by IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- Zod schemas for input validation ---

const LeadStateSchema = z.object({
  leadName: z.string().min(1).max(100),
  leadEmail: z.string().email().max(255),
  leadCompany: z.string().max(200).optional().default(""),
  leadPhone: z.string().min(1).max(50),
  leadDescription: z.string().max(2000).optional().default(""),
  leadConsent: z.boolean().optional().default(true),
}).passthrough();

const PriceRangeSchema = z.object({
  low: z.number().min(0).max(10000000).optional(),
  high: z.number().min(0).max(10000000).optional(),
  setupLow: z.number().min(0).max(10000000).optional(),
  setupHigh: z.number().min(0).max(10000000).optional(),
  monthlyLow: z.number().min(0).max(10000000).optional(),
  monthlyHigh: z.number().min(0).max(10000000).optional(),
}).optional();

const LeadSchema = z.object({
  state: LeadStateSchema,
  priceRange: PriceRangeSchema,
  isManualReview: z.boolean().optional().default(false),
  service: z.enum(["web", "paid-ads", "seo"]).optional().default("web"),
  discountCode: z.string().max(20).optional(),
  monthlyPrice: z.number().min(0).max(10000).optional(),
});

const SOLUTION_LABELS: Record<string, string> = {
  website: "Virksomhedshjemmeside",
  webshop: "Webshop",
  "landing-page": "Landing page",
  "ved-ikke": "Ved ikke endnu",
};

const PROCESS_LABELS: Record<string, string> = {
  efficient: "Effektiv",
  balanced: "Balanceret",
  collaborative: "Samarbejdende",
};

const SIZE_LABELS: Record<string, string> = {
  "1-5": "1–5 sider",
  "5-10": "5–10 sider",
  "10+": "10+ sider",
  "up-to-20": "Op til 20 produkter",
  "20-100": "20–100 produkter",
  "100+": "100+ produkter",
};

const FEATURE_LABELS: Record<string, string> = {
  booking: "Bookingsystem",
  integration: "Integration",
  payment: "Betalingsgateway opsætning",
  shipping: "Fragt opsætning",
};

const VISUAL_IDENTITY_LABELS: Record<string, string> = {
  "logo-guidelines": "Har logo + designguide",
  "logo-only": "Har kun logo",
  "no-identity": "Ingen visuel identitet",
};

const CONTENT_LABELS: Record<string, string> = {
  "has-content": "Har indhold klar",
  "needs-content": "Har brug for indholdsproduktion",
};

const HOSTING_LABELS: Record<string, string> = {
  "yes-both": "Har hosting + domæne",
  "domain-only": "Har kun domæne",
  "no": "Har ingen af delene",
  "not-sure": "Ikke sikker",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const rawBody = await req.json();

    // Validate input with Zod
    const parseResult = LeadSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input data." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = parseResult.data;
    const s = body.state;
    const priceRange = body.priceRange;
    const isManualReview = body.isManualReview;
    const service = body.service;
    const discountCode = body.discountCode ? escapeHtml(body.discountCode) : null;
    const monthlyPrice = body.monthlyPrice;

    // Features extracted per-service below

    let priceText: string;
    if (isManualReview) {
      priceText = "Kræver individuel vurdering";
    } else if (service === "paid-ads") {
      const setupLow = priceRange?.setupLow ?? 0;
      const setupHigh = priceRange?.setupHigh ?? 0;
      const monthlyLow = priceRange?.monthlyLow ?? 0;
      const monthlyHigh = priceRange?.monthlyHigh ?? 0;
      priceText = `Setup: ${setupLow.toLocaleString("da-DK")} – ${setupHigh.toLocaleString("da-DK")} DKK`;
      if (monthlyLow > 0 || monthlyHigh > 0) {
        priceText += ` | Månedlig: ${monthlyLow.toLocaleString("da-DK")} – ${monthlyHigh.toLocaleString("da-DK")} DKK`;
      }
    } else if (priceRange?.low === priceRange?.high) {
      priceText = `${(priceRange?.low ?? 0).toLocaleString("da-DK")} DKK (engangspris)`;
      if (monthlyPrice) {
        priceText += ` + ${monthlyPrice.toLocaleString("da-DK")} DKK/md. (hosting & drift)`;
      }
    } else {
      priceText = `${(priceRange?.low ?? 0).toLocaleString("da-DK")} – ${(priceRange?.high ?? 0).toLocaleString("da-DK")} DKK`;
    }

    // Escape all user-provided strings before inserting into HTML
    const safeName = escapeHtml(s.leadName);
    const safeEmail = escapeHtml(s.leadEmail);
    const safeCompany = escapeHtml(s.leadCompany || "");
    const safePhone = escapeHtml(s.leadPhone);
    const safeDescription = escapeHtml(s.leadDescription);
    const safeExistingUrl = escapeHtml(s.existingUrl || "");
    const safeSpecialDesc = escapeHtml(s.specialFeaturesDescription || "");

    let criteriaHtml = "";
    let emailSubject = `Ny forespørgsel: ${safeName}`;

    if (service === "web") {
      const features = (s.additionalFeatures || [])
        .map((f: string) => FEATURE_LABELS[f] || escapeHtml(f))
        .join(", ") || "Ingen";
      emailSubject += ` – ${SOLUTION_LABELS[s.solutionType || ""] || escapeHtml(s.solutionType || "")}`;
      criteriaHtml = `
        <tr><td style="padding: 6px 0; font-weight: bold; width: 180px;">Eksisterende side:</td><td>${s.hasExistingWebsite ? "Ja" : "Nej"}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Løsningstype:</td><td>${SOLUTION_LABELS[s.solutionType || ""] || escapeHtml(s.solutionType || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Procestype:</td><td>${PROCESS_LABELS[s.processType || ""] || escapeHtml(s.processType || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Størrelse:</td><td>${SIZE_LABELS[s.size || ""] || escapeHtml(s.size || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Tilvalg:</td><td>${features}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Specialfunktioner:</td><td>${s.hasSpecialFeatures ? "Ja" : "Nej"}</td></tr>
        ${s.hasSpecialFeatures && safeSpecialDesc ? `<tr><td style="padding: 6px 0; font-weight: bold;">Beskrivelse:</td><td>${safeSpecialDesc}</td></tr>` : ""}
        ${s.processType === "efficient" ? `<tr><td style="padding: 6px 0; font-weight: bold;">Logo & farver:</td><td>${s.hasLogoAndColors ? "Ja" : "Nej"}</td></tr>` : `<tr><td style="padding: 6px 0; font-weight: bold;">Visuel identitet:</td><td>${VISUAL_IDENTITY_LABELS[s.visualIdentityLevel || ""] || escapeHtml(s.visualIdentityLevel || "")}</td></tr>`}
        <tr><td style="padding: 6px 0; font-weight: bold;">Indhold:</td><td>${CONTENT_LABELS[s.contentStatus || ""] || escapeHtml(s.contentStatus || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Hosting:</td><td>${HOSTING_LABELS[s.hostingStatus || ""] || escapeHtml(s.hostingStatus || "")}</td></tr>
        ${(s.hostingStatus === "domain-only" || s.hostingStatus === "no") ? `<tr><td style="padding: 6px 0; font-weight: bold;">Ønsker hosting-setup:</td><td>${s.wantsHostingSetup ? "Ja" : "Nej"}</td></tr>` : ""}
        ${s.consideredBudgetShortcut ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #d97706;">⚠️ Overvejede billig løsning:</td><td style="color: #d97706; font-weight: bold;">Ja – klikkede på den billigste løsning, men valgte at gå tilbage og tilpasse selv</td></tr>` : ""}
      `;
    } else if (service === "paid-ads") {
      emailSubject += " – Paid Ads";
      criteriaHtml = `<tr><td style="padding: 6px 0; font-weight: bold;">Service:</td><td>Paid Ads</td></tr>`;
    } else if (service === "seo") {
      emailSubject += " – SEO";
      criteriaHtml = `
        <tr><td style="padding: 6px 0; font-weight: bold; width: 180px;">SEO-erfaring:</td><td>${escapeHtml(s.seoExperience || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Primært mål:</td><td>${escapeHtml(s.primaryGoal || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Website-størrelse:</td><td>${escapeHtml(s.websiteSize || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Konkurrence:</td><td>${escapeHtml(s.competition || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Søgeordsanalyse:</td><td>${escapeHtml(s.keywordResearch || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Teknisk status:</td><td>${escapeHtml((s.technicalStatus || []).join(", "))}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Behov:</td><td>${escapeHtml((s.needs || []).join(", "))}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Indholdsproduktion:</td><td>${escapeHtml(s.contentProduction || "")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Tidsramme:</td><td>${escapeHtml(s.timeline || "")}</td></tr>
      `;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 12px;">Ny forespørgsel fra prisberegneren</h1>

        <h2 style="color: #1a1a2e; margin-top: 24px;">Kontaktoplysninger</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 180px;">Navn:</td><td>${safeName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">E-mail:</td><td>${safeEmail}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Virksomhed:</td><td>${safeCompany}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Telefon:</td><td>${safePhone}</td></tr>
          ${safeExistingUrl ? `<tr><td style="padding: 6px 0; font-weight: bold;">Eksisterende URL:</td><td>${safeExistingUrl}</td></tr>` : ""}
        </table>

        <h2 style="color: #1a1a2e; margin-top: 24px;">Projektbeskrivelse</h2>
        <p style="background: #f5f5f5; padding: 12px; border-radius: 6px;">${safeDescription}</p>

        <h2 style="color: #1a1a2e; margin-top: 24px;">Valgte kriterier</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${criteriaHtml}
        </table>

        <h2 style="color: #1a1a2e; margin-top: 24px;">Estimeret pris</h2>
        <p style="font-size: 20px; font-weight: bold; color: #1a1a2e;">${priceText}</p>

        ${discountCode ? `
        <h2 style="color: #d97706; margin-top: 24px;">🏷️ Rabatkode</h2>
        <p style="font-size: 22px; font-weight: bold; color: #d97706; letter-spacing: 3px; background: #fef3c7; padding: 12px 20px; border-radius: 8px; display: inline-block;">${discountCode}</p>
        <p style="font-size: 13px; color: #666; margin-top: 6px;">Kunden har fået vist denne rabatkode (50% førstegangstilbud)</p>
        ` : ""}
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Prisberegner <onboarding@resend.dev>",
      to: ["ajg@horizen.dk"],
      subject: emailSubject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-lead:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
