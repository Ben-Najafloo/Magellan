import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import traceback
import mysql.connector

app = Flask(__name__)
CORS(app)

# SQL Database connection settings
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  
    'database': 'eufunded'  
}

def load_data_from_sql():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        query_org = "SELECT * FROM organizations"
        query_proj = "SELECT * FROM projects"

        df_org = pd.read_sql(query_org, conn)
        df_proj = pd.read_sql(query_proj, conn)

        conn.close()

        df_merged = pd.merge(df_org, df_proj, on='project_id', how='outer')
        df_filled = df_merged.fillna('_')
        return df_filled
    except Exception as e:
        print("Error loading data from SQL:", e)
        return pd.DataFrame()  # return empty DataFrame if error

# Load the dataset from SQL
df_filled = load_data_from_sql()

# print(df_filled.head())
# print(df_filled.columns)
# print(f"Loaded {len(df_filled)} rows from SQL")



@app.route('/search', methods=['POST'])
def search_dataframe():
    search_terms = request.json.get('search_terms', [])
    searchable_columns = ['project_topic','project_id']

    if not search_terms:
        return jsonify({'data': [], 'columns': []})

    # Step 1: Build mask for each term and collect matching rows
    mask = pd.Series([False] * len(df_filled))

    for term in search_terms:
        term_mask = pd.Series([False] * len(df_filled))
        for column in searchable_columns:
            if column in df_filled.columns:
                if column in ['acronym', 'project_id']:
                    column_mask = df_filled[column].astype(str).str.contains(
                        re.escape(term), case=False, na=False, regex=True
                    )
                else:
                    column_mask = df_filled[column].astype(str).str.contains(
                        fr'\b{re.escape(term)}\b', case=False, na=False, regex=True
                    )
                term_mask = term_mask | column_mask
        mask = mask & term_mask if mask.any() else term_mask

    # Step 2: Get all matching project_ids, then fetch full entries for each matched project
    matched_project_ids = df_filled[mask]['project_id'].unique()
    results_df = df_filled[df_filled['project_id'].isin(matched_project_ids)]

    response_data = []
    unique_topics = results_df['project_topic'].unique() if 'project_topic' in results_df.columns else ['_']

    for topic in unique_topics:
        project_entries = results_df[results_df['project_topic'] == topic] if 'project_topic' in results_df.columns else results_df

        # Get coordinator
        coordinator = project_entries[project_entries['organization_role'] == 'coordinator']
        if len(coordinator) > 0:
            coordinator_data = coordinator.iloc[0].to_dict()
        else:
            coordinator_data = project_entries.iloc[0].to_dict()

        # Get participants
        participants = project_entries[project_entries['organization_role'] != 'coordinator']
        participants_data = participants.to_dict('records')

        response_data.append({
            'coordinator': coordinator_data,
            'participants': participants_data,
            'project_topic': topic
        })

    return jsonify({
        'data': response_data,
        'columns': list(results_df.columns)
    })



if __name__ == '__main__':
    app.run(debug=True, port=5000)