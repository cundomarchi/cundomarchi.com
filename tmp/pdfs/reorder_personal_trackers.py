from pathlib import Path
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

OUT = Path("output/pdf/agrilabour_personal_trackers")
BASE = dict(hours=480.4996, days=45, ordinary=16971.73, night=226.00,
            gross=17197.73, tax=2580.00, super=2063.73)
HOURS, DAYS, RATE = 58.5833, 5, 35.73
GROSS, TAX, NET, SUPER = 2093.18, 314.00, 1779.18, 251.18
WEEKS = [
    ("21 Sep 2026", "27 Sep 2026", "29 Sep 2026"),
    ("28 Sep 2026", "04 Oct 2026", "06 Oct 2026"),
    ("05 Oct 2026", "09 Oct 2026", "13 Oct 2026"),
]

styles = getSampleStyleSheet()
section_style = ParagraphStyle("section", parent=styles["Heading2"], fontSize=10,
    leading=11, textColor=colors.HexColor("#193B5A"), spaceBefore=5, spaceAfter=2)
note_style = ParagraphStyle("note", parent=styles["BodyText"], fontSize=7, leading=8.5,
    textColor=colors.HexColor("#586675"))

def money(v): return f"${v:,.2f}"

def table(data, widths, header=True, right_cols=()):
    t = Table(data, colWidths=widths)
    commands = [
        ("GRID", (0,0), (-1,-1), .35, colors.HexColor("#C7D1DB")),
        ("FONTSIZE", (0,0), (-1,-1), 7.5),
        ("TOPPADDING", (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]
    if header:
        commands += [("BACKGROUND", (0,0), (-1,0), colors.HexColor("#DCE8F2")),
                     ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold")]
    for col in right_cols:
        commands.append(("ALIGN", (col,1 if header else 0), (col,-1), "RIGHT"))
    t.setStyle(TableStyle(commands))
    return t

def heading(text): return Paragraph(text, section_style)

def white_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.restoreState()

def build(i, start, end, pay_date):
    ordinary_ytd = BASE["ordinary"] + GROSS*i
    gross_ytd = BASE["gross"] + GROSS*i
    tax_ytd = BASE["tax"] + TAX*i
    super_ytd = BASE["super"] + SUPER*i
    hours_ytd = BASE["hours"] + HOURS*i
    days_ytd = BASE["days"] + DAYS*i
    path = OUT / f"Personal_Earnings_Estimate_{start.replace(' ', '-')}_to_{end.replace(' ', '-')}.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=14*mm, rightMargin=14*mm,
                            topMargin=8*mm, bottomMargin=8*mm)
    story = [
        Paragraph("Personal weekly earnings tracker", styles["Title"]),
        Paragraph("PERSONAL ESTIMATE - NOT A PAYSLIP - NOT ISSUED BY THE EMPLOYER",
            ParagraphStyle(f"warning{i}", parent=styles["BodyText"], fontSize=8, leading=9,
            textColor=colors.HexColor("#8A2C20"), backColor=colors.HexColor("#FFF1EE"),
            borderColor=colors.HexColor("#E3A096"), borderWidth=.6, borderPadding=4,
            spaceBefore=2, spaceAfter=5)),
        table([
            ["Tracking summary", "Value"],
            ["Worker", "Facundo Leon Marchi"],
            ["Employer reference", "Agri-Labour Australia Pty Ltd - ABN 23 142 526 216"],
            ["Worksite / role", "Olam Orchards Australia Pty Ltd - Stockpad Drier"],
            ["Pay period", f"{start} to {end}"],
            ["Projected pay date", pay_date],
        ], [48*mm, 125*mm]),
        heading("Details"),
        table([
            ["Entitlement", "Unit", "Rate", "Current", "YTD"],
            [f"DAYS WORKED (week ending {end})", f"{DAYS:.4f}", "$0.00", "$0.00", "$0.00"],
            [f"Ordinary incl. casual loading (week ending {end})", f"{HOURS:.4f}", money(RATE), money(GROSS), money(ordinary_ytd)],
            ["Night Shift Ordinary Hours", "-", "-", "-", money(BASE["night"])],
            ["Gross Payment", "", "", money(GROSS), money(gross_ytd)],
        ], [79*mm, 22*mm, 22*mm, 25*mm, 25*mm], right_cols=(1,2,3,4)),
        heading("Deductions"),
        table([
            ["Deduction", "Current", "YTD"],
            ["Tax (PAYG) - projected", f"-{money(TAX)}", f"-{money(tax_ytd)}"],
            ["Total Deductions", f"-{money(TAX)}", f"-{money(tax_ytd)}"],
        ], [113*mm, 30*mm, 30*mm], right_cols=(1,2)),
        heading("Net Pay"),
        table([
            ["Calculation", "Projected amount"],
            ["Gross Payment", money(GROSS)],
            ["Total Deductions", f"-{money(TAX)}"],
            ["Net Payment", money(NET)],
        ], [143*mm, 30*mm], right_cols=(1,)),
        heading("Disbursement"),
        table([
            ["Account / destination", "Projected total"],
            ["Personal tracking only - bank details intentionally omitted", money(NET)],
            ["Total disbursement", money(NET)],
        ], [143*mm, 30*mm], right_cols=(1,)),
        heading("Employer Contributions"),
        table([
            ["Item", "Current accrual", "YTD"],
            ["SGC - Candidates (projected)", money(SUPER), money(super_ytd)],
            ["Total Contributions", money(SUPER), money(super_ytd)],
        ], [113*mm, 30*mm, 30*mm], right_cols=(1,2)),
        heading("Superannuation Fund"),
        table([
            ["Currently nominated fund", "Member number"],
            ["The Trustee for MERCER SUPER TRUST", "103493284"],
        ], [123*mm, 50*mm]),
        heading("Notes"),
        Paragraph(f"Cumulative personal tracking after this projected week: {days_ytd} actual workdays and {hours_ytd:.4f} hours. Values assume the same hours, rate, PAYG and super as the week ending 20 Sep 2026. Replace all projected figures with the employer-issued records when received.", note_style),
    ]
    doc.build(story, onFirstPage=white_page, onLaterPages=white_page)

selected = list(enumerate(WEEKS, 1))
if "--only-last" in sys.argv:
    selected = selected[-1:]
for i, data in selected:
    build(i, *data)
