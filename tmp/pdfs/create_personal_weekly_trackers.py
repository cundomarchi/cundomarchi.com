from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle


OUT = Path("output/pdf/agrilabour_personal_trackers")
OUT.mkdir(parents=True, exist_ok=True)

BASE = {
    "hours": 480.4996,
    "days": 45,
    "ordinary_ytd": 16971.73,
    "night_ytd": 226.00,
    "gross_ytd": 17197.73,
    "tax_ytd": 2580.00,
    "super_ytd": 2063.73,
}

WEEK_HOURS = 58.5833
WEEK_DAYS = 5
RATE = 35.73
GROSS = 2093.18
TAX = 314.00
NET = 1779.18
SUPER = 251.18

weeks = [
    ("21 Sep 2026", "27 Sep 2026", "29 Sep 2026"),
    ("28 Sep 2026", "04 Oct 2026", "06 Oct 2026"),
]

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="SmallMuted", parent=styles["BodyText"], fontSize=8.5, leading=11, textColor=colors.HexColor("#5B6573")))
styles.add(ParagraphStyle(name="Section", parent=styles["Heading2"], fontSize=11, leading=14, textColor=colors.HexColor("#17324D"), spaceBefore=8, spaceAfter=6))


def money(v):
    return f"${v:,.2f}"


def make_pdf(index, start, end, projected_pay_date):
    cumulative_hours = BASE["hours"] + WEEK_HOURS * index
    cumulative_days = BASE["days"] + WEEK_DAYS * index
    ordinary_ytd = BASE["ordinary_ytd"] + GROSS * index
    gross_ytd = BASE["gross_ytd"] + GROSS * index
    tax_ytd = BASE["tax_ytd"] + TAX * index
    super_ytd = BASE["super_ytd"] + SUPER * index

    path = OUT / f"Personal_Earnings_Estimate_{start.replace(' ', '-')}_to_{end.replace(' ', '-')}.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=16*mm, leftMargin=16*mm, topMargin=10*mm, bottomMargin=10*mm)
    story = []
    story.append(Paragraph("Personal hours and earnings estimate", styles["Title"]))
    story.append(Paragraph("NOT A PAYSLIP - NOT ISSUED BY THE EMPLOYER - DO NOT SUBMIT AS OFFICIAL EVIDENCE", ParagraphStyle(
        name=f"Warning{index}", parent=styles["BodyText"], fontSize=8, leading=10, textColor=colors.HexColor("#8A2C20"),
        backColor=colors.HexColor("#FFF1EE"), borderColor=colors.HexColor("#E3A096"), borderWidth=0.7,
        borderPadding=5, spaceBefore=5, spaceAfter=7,
    )))

    summary = [
        ["Worker", "Facundo Leon Marchi"],
        ["Employer used for tracking", "Agri-Labour Australia Pty Ltd"],
        ["Employer ABN", "23 142 526 216"],
        ["Worksite / client", "Olam Orchards Australia Pty Ltd - Stockpad Drier"],
        ["Work location", "Carwarp, Victoria 3494"],
        ["Tracked role", "Almond processing / stockpad drier worker"],
        ["Projected work period", f"{start} to {end}"],
        ["Projected pay date", projected_pay_date],
        ["Assumption", "Same hours and rate as week ending 20 Sep 2026"],
    ]
    t = Table(summary, colWidths=[52*mm, 103*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#EAF0F6")),
        ("TEXTCOLOR", (0,0), (0,-1), colors.HexColor("#17324D")),
        ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTNAME", (1,0), (1,-1), "Helvetica"),
        ("FONTSIZE", (0,0), (-1,-1), 8),
        ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#C8D2DC")),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    story.extend([t, Spacer(1, 3), Paragraph("Projected weekly figures", styles["Section"])])

    weekly = [
        ["Item", "Quantity / rate", "Projected amount"],
        ["Days worked", f"{WEEK_DAYS}", "-"],
        ["Ordinary hours", f"{WEEK_HOURS:.4f} h at {money(RATE)}/h", money(GROSS)],
        ["Gross earnings", "", money(GROSS)],
        ["PAYG withholding", "Estimate based on prior week", f"-{money(TAX)}"],
        ["Net earnings", "", money(NET)],
        ["Super contribution", "12% estimate", money(SUPER)],
    ]
    wt = Table(weekly, colWidths=[51*mm, 63*mm, 41*mm])
    wt.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#17324D")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
        ("ALIGN", (2,1), (2,-1), "RIGHT"),
        ("FONTSIZE", (0,0), (-1,-1), 8),
        ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#C8D2DC")),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#F7F9FB")]),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    story.extend([wt, Spacer(1, 3), Paragraph("Projected cumulative totals", styles["Section"])])

    cumulative = [
        ["Metric", "Projected cumulative total"],
        ["Actual workdays tracked", f"{cumulative_days}"],
        ["Hours tracked", f"{cumulative_hours:.4f} h"],
        ["Ordinary earnings YTD", money(ordinary_ytd)],
        ["Night-shift earnings YTD", money(BASE["night_ytd"])],
        ["Gross earnings YTD", money(gross_ytd)],
        ["PAYG withholding YTD", money(tax_ytd)],
        ["Super contributions YTD", money(super_ytd)],
    ]
    ct = Table(cumulative, colWidths=[92*mm, 63*mm])
    ct.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#DCE8F2")),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("ALIGN", (1,1), (1,-1), "RIGHT"),
        ("FONTSIZE", (0,0), (-1,-1), 8),
        ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#C8D2DC")),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    story.extend([ct, Spacer(1, 6), Paragraph(
        "These figures are projections for personal planning. Actual hours, PAYG withholding, superannuation, net pay and year-to-date balances must be taken from records issued by the employer.",
        styles["SmallMuted"],
    )])
    doc.build(story)
    return path


for i, data in enumerate(weeks, start=1):
    make_pdf(i, *data)
