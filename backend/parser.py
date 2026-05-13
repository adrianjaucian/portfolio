import pandas as pd

def clean_boxscore(df):
    df = df[~df["MP"].str.contains("Did Not Play", na=False)]
    return df