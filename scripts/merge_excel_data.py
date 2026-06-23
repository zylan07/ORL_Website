import os
import re
import json
import pandas as pd

workspace = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
records = []

def parse_precision_date(val):
    if pd.isna(val):
        return ""
    if isinstance(val, pd.Timestamp):
        return val.strftime("%Y-%m-%d")
    s = str(val).strip()
    if not s or s.lower() in ("nan", "null", "—", "-"):
        return ""
    
    # YYYY
    if re.match(r"^\d{4}(\.0)?$", s):
        return str(int(float(s)))
        
    # YYYY-MM
    if re.match(r"^\d{4}-\d{2}$", s):
        return s
        
    # MM.YYYY or MM/YYYY
    m = re.match(r"^(\d{2})[./](\d{4})$", s)
    if m:
        mm, yyyy = m.groups()
        return f"{yyyy}-{mm}"
        
    # DD.MM.YYYY or DD/MM/YYYY
    m = re.match(r"^(\d{2})[./](\d{2})[./](\d{4})$", s)
    if m:
        dd, mm, yyyy = m.groups()
        return f"{yyyy}-{mm}-{dd}"
        
    # YYYY-MM-DD
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})$", s)
    if m:
        return s
        
    try:
        dt = pd.to_datetime(s)
        if len(s) == 4 and s.isdigit():
            return str(dt.year)
        return dt.strftime("%Y-%m-%d")
    except:
        return s

def extract_precision_date(duration):
    if pd.isna(duration):
        return ""
    s = str(duration).strip()
    if not s or s.lower() in ("nan", "null"):
        return ""
    
    # 1. Full date dd.mm.yyyy or dd/mm/yyyy
    m = re.search(r"(\d{2})[./](\d{2})[./](\d{4})", s)
    if m:
        dd, mm, yyyy = m.groups()
        return f"{yyyy}-{mm}-{dd}"
        
    # 2. YYYY-MM-DD
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m:
        return m.group(0)

    # 3. MM/YYYY or MM.YYYY
    m = re.search(r"\b(\d{2})[./](\d{4})\b", s)
    if m:
        mm, yyyy = m.groups()
        return f"{yyyy}-{mm}"
        
    # 4. Year
    m_year = re.search(r"\b(19|20)\d{2}\b", s)
    if m_year:
        return m_year.group(0)
        
    return ""

def clean_dc_scholar_name(name):
    if pd.isna(name):
        return ""
    # Remove registration numbers, scholar codes, IDs inside parentheses
    s = str(name).strip()
    s_cleaned = re.sub(r"\s*\([^)]*\)", "", s)
    return s_cleaned.strip()

def map_talk_place(place_val):
    p = str(place_val).strip()
    if p.lower() == 'thailand':
        return 'Bangkok'
    elif p.lower() == 'indonesia':
        return 'Bali'
    return p

# 1. Awards & Recognition
awards_file = os.path.join(workspace, "Awards and recognition.xlsx")
if os.path.exists(awards_file):
    print("Processing Awards and recognition...")
    df = pd.read_excel(awards_file)
    for idx, row in df.iterrows():
        title = row.get("Award / Recognition")
        awarded_by = row.get("Awarded By")
        recipient = row.get("Recipient")
        year = row.get("Year")
        if pd.isna(title) or str(title).strip() == "":
            continue
        date_str = str(int(float(year))) if pd.notna(year) else ""
        records.append({
            "id": f"award-{idx+1:04d}",
            "type": "award",
            "title": str(title).strip(),
            "date": date_str,
            "organization": str(awarded_by).strip() if pd.notna(awarded_by) else "",
            "recipient": str(recipient).strip() if pd.notna(recipient) else "",
            "summary": f"Awarded by: {awarded_by}. Recipient: {recipient}." if pd.notna(awarded_by) else "",
            "tags": [],
            "attachments": []
        })

# 2. Invited Talks
talks_file = os.path.join(workspace, "Edited Invited Talks (1).xlsx")
if os.path.exists(talks_file):
    print("Processing Invited Talks...")
    df = pd.read_excel(talks_file)
    for idx, row in df.iterrows():
        title = row.get("Title of the Talk")
        date_val = row.get("Date")
        venue = row.get("Venue")
        place_val = row.get("Place")
        if pd.isna(title) or str(title).strip() == "":
            continue
        date_str = parse_precision_date(date_val)
        
        # Rule: Existing Venue content becomes subtitle
        subtitle = str(venue).strip() if pd.notna(venue) else ""
        # Rule: Existing Place content becomes Venue (organization field)
        org = str(place_val).strip() if pd.notna(place_val) else ""
        # Rule: Place column should contain city/location
        mapped_place = map_talk_place(org)
        
        records.append({
            "id": f"talk-{idx+1:04d}",
            "type": "talk",
            "title": str(title).strip(),
            "subtitle": subtitle,
            "date": date_str,
            "organization": org,
            "place": mapped_place,
            "summary": f"Venue (original): {subtitle}. Location: {mapped_place}.",
            "tags": [],
            "attachments": []
        })

# 3. Workshops
workshop_file = os.path.join(workspace, "Workshop (1).xlsx")
if os.path.exists(workshop_file):
    print("Processing Workshops...")
    df = pd.read_excel(workshop_file)
    for idx, row in df.iterrows():
        title = row.get("Workshop Title")
        category = row.get("Category")
        host = row.get("Host / Code")
        duration = row.get("Duration")
        mode = row.get("Mode")
        if pd.isna(title) or str(title).strip() == "":
            continue
        date_str = extract_precision_date(duration)
        records.append({
            "id": f"workshop-{idx+1:04d}",
            "type": "workshop",
            "title": str(title).strip(),
            "date": date_str,
            "organization": str(host).strip() if pd.notna(host) else "SSNCE",
            "duration": str(duration).strip() if pd.notna(duration) else "",
            "mode": str(mode).strip() if pd.notna(mode) else "Contact",
            "summary": f"{category}. Duration: {duration}. Mode: {mode}." if pd.notna(category) else "",
            "tags": [str(x).strip() for x in [category, mode] if pd.notna(x)],
            "attachments": []
        })

# 4. Publications
pub_file = os.path.join(workspace, "publications (1).xlsx")
if os.path.exists(pub_file):
    print("Processing Publications...")
    df = pd.read_excel(pub_file)
    for idx, row in df.iterrows():
        title = row.get("Title")
        pub_type = row.get("Type")
        year = row.get("Year")
        authors = row.get("Authors")
        venue = row.get("Venue / Publisher")
        doi = row.get("DOI")
        
        # Skip header rows containing "---" or nan titles
        if pd.isna(title) or str(title).strip() == "" or pd.isna(pub_type) or "---" in str(pub_type):
            continue
            
        date_str = str(int(float(year))) if pd.notna(year) else ""
        
        # Classify subtype strictly
        t_val = str(pub_type).strip()
        if t_val.lower() == 'journal':
            subtype = 'Journal'
        elif t_val.lower() == 'conference':
            subtype = 'Conference'
        elif t_val.lower() == 'book':
            subtype = 'Book'
        else:
            subtype = 'Journal'  # default fallback
            
        doi_val = str(doi).strip() if pd.notna(doi) else ""
        if doi_val.lower() in ("nan", "null", "-", "—", "*"):
            doi_val = ""
            
        records.append({
            "id": f"pub-{idx+1:04d}",
            "type": "publication",
            "title": str(title).strip(),
            "date": date_str,
            "organization": str(venue).strip() if pd.notna(venue) else "",
            "authors": str(authors).strip() if pd.notna(authors) else "",
            "doi": doi_val,
            "subtype": subtype,
            "summary": f"Authors: {authors}. Venue: {venue}. DOI: {doi_val}" if pd.notna(authors) else "",
            "tags": [subtype],
            "attachments": []
        })

# 5. Board of Studies
bos_file = os.path.join(workspace, "Board of Studies (1).xlsx")
if os.path.exists(bos_file):
    print("Processing Board of Studies...")
    df = pd.read_excel(bos_file)
    for idx, row in df.iterrows():
        role = row.get("Role")
        date_val = row.get("Date")
        category = row.get("Category")
        details = row.get("Details")
        if pd.isna(role) or str(role).strip() == "":
            continue
        date_str = parse_precision_date(date_val)
        records.append({
            "id": f"bos-{idx+1:04d}",
            "type": "bos",
            "title": str(role).strip(),
            "date": date_str,
            "organization": str(category).strip() if pd.notna(category) else "Board of Studies",
            "summary": str(details).strip() if pd.notna(details) else "",
            "tags": [str(category).strip()] if pd.notna(category) else ["Board of Studies"],
            "attachments": []
        })

# 6. Doctoral Committee (Research Supervision)
dc_file = os.path.join(workspace, "Doctoral Committee (1).xlsx")
if os.path.exists(dc_file):
    print("Processing Doctoral Committee...")
    df = pd.read_excel(dc_file)
    for idx, row in df.iterrows():
        scholar = row.get("Scholar Name / Committee")
        date_val = row.get("Date")
        month_year_val = row.get("Month/Year")
        inst = row.get("Institution")
        mode = row.get("Mode")
        if pd.isna(scholar) or str(scholar).strip() == "":
            continue
        
        # Format the date cleanly, preferring Month/Year or Date
        if pd.notna(month_year_val):
            date_str = parse_precision_date(month_year_val)
        else:
            date_str = parse_precision_date(date_val)
            
        # Clean the Scholar Name (removes registration numbers/IDs inside parentheses)
        cleaned_scholar = clean_dc_scholar_name(scholar)
        
        records.append({
            "id": f"dc-{idx+1:04d}",
            "type": "dc",
            "title": cleaned_scholar,
            "date": date_str,
            "organization": str(inst).strip() if pd.notna(inst) else "",
            "mode": str(mode).strip() if pd.notna(mode) else "Online",
            "summary": f"Institution: {inst}.",
            "tags": [],
            "attachments": []
        })

# 7. Host Institution
host_file = os.path.join(workspace, "Host Institution (1).xlsx")
if os.path.exists(host_file):
    print("Processing Host Institution...")
    df = pd.read_excel(host_file)
    for idx, row in df.iterrows():
        title = row.get("Programme Title")
        date_val = row.get("Raw Date")
        host = row.get("Host Institution Name")
        code = row.get("Code")
        duration = row.get("Duration")
        mode = row.get("Mode")
        if pd.isna(title) or str(title).strip() == "":
            continue
        date_str = parse_precision_date(date_val)
        records.append({
            "id": f"host-{idx+1:04d}",
            "type": "host",
            "title": str(title).strip(),
            "date": date_str,
            "organization": str(host).strip() if pd.notna(host) else "",
            "code": str(code).strip() if pd.notna(code) and str(code) not in ("", "") else "",
            "duration": str(duration).strip() if pd.notna(duration) else "",
            "mode": str(mode).strip() if pd.notna(mode) else "Contact",
            "role": "Coordinator & Resource Person",
            "summary": f"Host: {host}. Duration: {duration}. Mode: {mode}.",
            "tags": [],
            "attachments": []
        })

# 8. ITEC Program
itec_file = os.path.join(workspace, "ITEC program (1).xlsx")
if os.path.exists(itec_file):
    print("Processing ITEC Program...")
    df = pd.read_excel(itec_file)
    for idx, row in df.iterrows():
        title = row.get("Programme Title")
        date_val = row.get("Raw Date")
        code = row.get("Code")
        duration = row.get("Duration")
        mode = row.get("Mode")
        role = row.get("Role")
        if pd.isna(title) or str(title).strip() == "":
            continue
        date_str = parse_precision_date(date_val)
        records.append({
            "id": f"itec-{idx+1:04d}",
            "type": "itec",
            "title": str(title).strip(),
            "date": date_str,
            "organization": "ITEC Programme",
            "code": str(code).strip() if pd.notna(code) and str(code) not in ("Null", "nan") else "",
            "duration": str(duration).strip() if pd.notna(duration) else "",
            "mode": str(mode).strip() if pd.notna(mode) else "Contact",
            "role": "Resource Person", # Strict requirement
            "summary": f"Duration: {duration}. Mode: {mode}.",
            "tags": [],
            "attachments": []
        })

# 9. ITP Program
itp_file = os.path.join(workspace, "ITP (1).xlsx")
if os.path.exists(itp_file):
    print("Processing ITP...")
    df = pd.read_excel(itp_file)
    for idx, row in df.iterrows():
        title = row.get("Programme Title")
        date_val = row.get("sessionDate") if pd.notna(row.get("sessionDate")) else row.get("Date")
        code = row.get("Code")
        duration = row.get("Duration")
        mode = row.get("Mode")
        if pd.isna(title) or str(title).strip() == "":
            continue
        date_str = parse_precision_date(date_val)
        records.append({
            "id": f"itp-{idx+1:04d}",
            "type": "itp",
            "title": str(title).strip(),
            "date": date_str,
            "organization": "Industrial Training Programme",
            "code": str(code).strip() if pd.notna(code) else "",
            "duration": str(duration).strip() if pd.notna(duration) else "",
            "mode": str(mode).strip() if pd.notna(mode) else "Contact",
            "role": "Coordinator & Resource Person",
            "summary": f"Code: {code}. Duration: {duration}. Mode: {mode}.",
            "tags": [],
            "attachments": []
        })

# 10. PDP as Resource Person (PDP Resources)
pdp_file = os.path.join(workspace, "PDP as Resource person.xlsx")
if os.path.exists(pdp_file):
    print("Processing PDP as Resource person...")
    df = pd.read_excel(pdp_file)
    for idx, row in df.iterrows():
        title = row.get("Programme Title")
        date_val = row.get("sessionDate") if pd.notna(row.get("sessionDate")) else row.get("Date")
        code = row.get("Code")
        duration = row.get("Duration")
        mode = row.get("Mode")
        if pd.isna(title) or str(title).strip() == "":
            continue
        date_str = parse_precision_date(date_val)
        records.append({
            "id": f"pdp-{idx+1:04d}",
            "type": "pdp",
            "title": str(title).strip(),
            "date": date_str,
            "organization": "SSN College of Engineering",
            "code": str(code).strip() if pd.notna(code) and str(code) not in ("NULL", "nan", "NaN") else "",
            "duration": str(duration).strip() if pd.notna(duration) else "",
            "mode": str(mode).strip() if pd.notna(mode) else "Contact",
            "summary": f"Code: {code}. Duration: {duration}. Mode: {mode}.",
            "tags": [],
            "attachments": []
        })

# 11. PDP as Coordinator (As Coordinator)
coord_file = os.path.join(workspace, "PDP as Coordinator.xlsx")
if os.path.exists(coord_file):
    print("Processing PDP as Coordinator...")
    df = pd.read_excel(coord_file)
    for idx, row in df.iterrows():
        title = row.get("Programme Title")
        date_val = row.get("Raw Date")
        code = row.get("Code")
        duration = row.get("Duration")
        mode = row.get("Mode")
        if pd.isna(title) or str(title).strip() == "":
            continue
        date_str = parse_precision_date(date_val)
        records.append({
            "id": f"coord-{idx+1:04d}",
            "type": "coord",
            "title": str(title).strip(),
            "date": date_str,
            "organization": "SSN College of Engineering",
            "code": str(code).strip() if pd.notna(code) and str(code) not in ("NULL", "nan", "NaN") else "",
            "duration": str(duration).strip() if pd.notna(duration) else "",
            "mode": str(mode).strip() if pd.notna(mode) else "Contact",
            "summary": f"Code: {code}. Duration: {duration}. Mode: {mode}.",
            "tags": [],
            "attachments": []
        })

# 12. PG Courses
pg_file = os.path.join(workspace, "pg(1).xlsx")
if os.path.exists(pg_file):
    print("Processing PG Courses...")
    df = pd.read_excel(pg_file)
    for idx, row in df.iterrows():
        subj_name = row.get("Subject Name")
        subj_code = row.get("Subject Code")
        prog = row.get("Programme")
        period = row.get("Period (Year)")
        sem = row.get("Semester")
        students = row.get("No. of Students")
        if pd.isna(subj_name) or str(subj_name).strip() == "":
            continue
        records.append({
            "id": f"pg-{idx+1:04d}",
            "type": "pg",
            "title": str(subj_name).strip(),
            "date": str(int(float(period))) if pd.notna(period) else "",
            "organization": str(prog).strip() if pd.notna(prog) else "",
            "code": str(subj_code).strip() if pd.notna(subj_code) else "",
            "duration": str(int(sem)) if pd.notna(sem) else "",
            "mode": str(int(students)) if pd.notna(students) else "0",
            "summary": f"Programme: {prog}. Subject Code: {subj_code}. Semester: {sem}. Students: {students}",
            "tags": [],
            "attachments": []
        })

print(f"Total merged records: {len(records)}")

out_dir = os.path.join(workspace, "src", "data")
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "records.json")
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(records, f, indent=2, ensure_ascii=False)

print("Database written to src/data/records.json successfully.")

# -------------------------------------------------------------
# DATA VALIDATION AUDIT PASS
# -------------------------------------------------------------
print("Running validation audit...")
missing_dates = 0
missing_doi = 0
missing_titles = 0
missing_attachments = 0
total_pubs = 0

for r in records:
    # Check Dates
    if not r.get("date"):
        missing_dates += 1
    # Check Titles
    if not r.get("title") or r.get("title").strip() == "":
        missing_titles += 1
    # Check DOIs for Publications only
    if r.get("type") == "publication":
        total_pubs += 1
        if not r.get("doi"):
            missing_doi += 1
    # Check Attachments
    if not r.get("attachments") or len(r.get("attachments")) == 0:
        missing_attachments += 1

print("\n--- VALIDATION SUMMARY ---")
print(f"Total Records: {len(records)}")
print(f"Records Missing Dates: {missing_dates}")
print(f"Records Missing Titles: {missing_titles}")
print(f"Publications Missing DOI: {missing_doi} (out of {total_pubs})")
print(f"Records Missing Attachments: {missing_attachments}")

report_dir = os.path.join(workspace, "docs", "project-history")
os.makedirs(report_dir, exist_ok=True)
report_file = os.path.join(report_dir, "data_validation_report.md")

with open(report_file, "w", encoding="utf-8") as rf:
    rf.write("# Data Migration & Validation Report\n\n")
    rf.write("This report provides an automated validation summary of all migrated repository data records based on the authoritative updated Excel sheets.\n\n")
    rf.write("## Validation Metrics\n\n")
    rf.write("| Metric | Count |\n")
    rf.write("| :--- | :--- |\n")
    rf.write(f"| **Total Records** | {len(records)} |\n")
    rf.write(f"| **Records Missing Dates** | {missing_dates} |\n")
    rf.write(f"| **Records Missing Titles** | {missing_titles} |\n")
    rf.write(f"| **Publications Missing DOI** | {missing_doi} *(out of {total_pubs})* |\n")
    rf.write(f"| **Records Missing Attachments** | {missing_attachments} |\n\n")
    
    rf.write("## Category Distribution\n\n")
    categories = {}
    for r in records:
        t = r["type"]
        categories[t] = categories.get(t, 0) + 1
        
    rf.write("| Category | Records Count |\n")
    rf.write("| :--- | :--- |\n")
    for cat, count in sorted(categories.items()):
        rf.write(f"| {cat.upper()} | {count} |\n")

    # Publications breakdown
    journals_count = len([x for x in records if x["type"] == "publication" and x["subtype"] == "Journal"])
    conferences_count = len([x for x in records if x["type"] == "publication" and x["subtype"] == "Conference"])
    books_count = len([x for x in records if x["type"] == "publication" and x["subtype"] == "Book"])
    
    rf.write("\n## Publications Breakdown\n\n")
    rf.write("| Publication Subcategory | Count |\n")
    rf.write("| :--- | :--- |\n")
    rf.write(f"| Journal Publications | {journals_count} (Expected: 62) |\n")
    rf.write(f"| Conference Publications | {conferences_count} (Expected: 97) |\n")
    rf.write(f"| Books / Book Chapters | {books_count} (Expected: 10) |\n")
    rf.write(f"| **Total Publications** | **{journals_count + conferences_count + books_count}** |\n\n")

    # Technical Training breakdown
    host_count = len([x for x in records if x["type"] == "host"])
    itec_count = len([x for x in records if x["type"] == "itec"])
    itp_count = len([x for x in records if x["type"] == "itp"])
    pdp_count = len([x for x in records if x["type"] == "pdp"])
    coord_count = len([x for x in records if x["type"] == "coord"])
    
    rf.write("## Technical Training Breakdown\n\n")
    rf.write("| Technical Training Subcategory | Count |\n")
    rf.write("| :--- | :--- |\n")
    rf.write(f"| Host Institution | {host_count} |\n")
    rf.write(f"| ITEC Programmes | {itec_count} |\n")
    rf.write(f"| ITP Programmes | {itp_count} |\n")
    rf.write(f"| PDP as Resource Person | {pdp_count} |\n")
    rf.write(f"| PDP as Coordinator | {coord_count} |\n")
    rf.write(f"| **Total Technical Training** | **{host_count + itec_count + itp_count + pdp_count + coord_count}** |\n")

print(f"Audit report written to {report_file} successfully.")
