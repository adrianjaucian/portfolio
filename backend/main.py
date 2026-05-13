from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
import numpy as np
from stats_engine import generate_advanced_stats

app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# HELPERS
# =========================
def detect_header_row(lines):
    for i, line in enumerate(lines):
        clean = line.replace(" ", "").replace("\ufeff", "").lower()
        if "mp" in clean and "fga" in clean and "fg" in clean:
            return i
    return None


def normalize_column_name(col):
    name = str(col).strip().replace("\ufeff", "")
    if name == "":
        return name

    key = name.lower().replace("%", "pct").replace(" ", "").replace("-", "")

    if key in {"player", "players", "starters", "name"}:
        return "Player"
    if key == "mp":
        return "MP"
    if key == "fg":
        return "FG"
    if key == "fga":
        return "FGA"
    if key in {"fgpct", "fg_pct", "fgpercent", "fgpct"}:
        return "FG%"
    if key == "3p":
        return "3P"
    if key == "3pa":
        return "3PA"
    if key in {"3ppct", "3p_pct", "3ppercent", "3ppct"}:
        return "3P%"
    if key == "ft":
        return "FT"
    if key == "fta":
        return "FTA"
    if key in {"ftpct", "ft_pct", "ftpercent", "ftpct"}:
        return "FT%"
    if key == "orb":
        return "ORB"
    if key == "drb":
        return "DRB"
    if key == "trb":
        return "TRB"
    if key == "ast":
        return "AST"
    if key == "stl":
        return "STL"
    if key == "blk":
        return "BLK"
    if key == "tov":
        return "TOV"
    if key == "pf":
        return "PF"
    if key in {"teampts", "pts", "points"}:
        return "PTS"
    if key in {"gmsc", "gmscore"}:
        return "GmSc"
    if key in {"plusminus", "plusminus", "plusminus"}:
        return "+/-"

    return name


def clean_dataframe(df):
    # Normalize column names and remove stray BOM characters
    df.columns = [normalize_column_name(c) for c in df.columns]

    # remove empty columns
    df = df.dropna(axis=1, how="all")

    # remove "Did Not Play" rows
    if "MP" in df.columns:
        df = df[~df["MP"].astype(str).str.contains("Did Not Play", na=False)]
    
    # remove Team Totals row
    if df.shape[0] > 0:
        df = df[df.iloc[:, 0].astype(str).str.lower() != "team totals"]

    return df


# =========================
# ENDPOINT
# =========================
@app.post("/upload-boxscore")
async def upload_boxscore(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        text = contents.decode("utf-8")
    except UnicodeDecodeError:
        text = contents.decode("latin-1", errors="replace")

    lines = text.splitlines()

    # STEP 1: remove junk header rows
    lines = [
        line for line in lines
        if "Basic Box Score Stats" not in line
        and line.strip() != ""
    ]

    # STEP 2: detect real header
    header_index = detect_header_row(lines)

    if header_index is None:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Could not detect header row",
                "preview": lines[:10]
            }
        )

    # STEP 3: build clean CSV
    cleaned_csv = "\n".join(lines[header_index:])
    try:
        df = pd.read_csv(io.StringIO(cleaned_csv), skip_blank_lines=True)
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Could not parse uploaded CSV",
                "details": str(e)
            }
        )

    # STEP 4: clean dataframe
    df = clean_dataframe(df)

    print("🔥 COLUMNS:", df.columns.tolist())

    # STEP 5: validate required columns
    required = ["PTS", "FG", "FGA", "FTA"]

    missing = [c for c in required if c not in df.columns]

    if missing:
        return JSONResponse(
            status_code=400,
            content={
                "error": f"Missing columns: {missing}",
                "columns_found": df.columns.tolist()
            }
        )

    try:
        result = generate_advanced_stats(df)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Failed to calculate advanced stats",
                "details": str(e)
            }
        )

    # FINAL SAFETY CLEAN (VERY IMPORTANT)
    for row in result:
        for k, v in row.items():
            if isinstance(v, float):
                if pd.isna(v) or v == float("inf") or v == float("-inf"):
                    row[k] = 0

    return result