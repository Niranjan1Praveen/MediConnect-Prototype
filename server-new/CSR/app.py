import pandas as pd
from dash import Dash, dcc, html
from flask import Flask
import plotly.graph_objs as go

# Flask server
server = Flask(__name__)

# Dash app
app = Dash(__name__, server=server, use_pages=False, suppress_callback_exceptions=True,
           external_stylesheets=["/assets/style.css"])
app.title = "CSR Impact Assessment Dashboard"

# Load master CSV
df = pd.read_csv("data/CSR.csv")

# Helper function for KPI cards
def kpi_summary(label, value, unit=""):
    if unit == "₹":
        display_value = f"₹{value:,.0f}"
    else:
        display_value = f"{value:,.0f} {unit}"
    return html.Div([
        html.H4(label),
        html.P(display_value)
    ], className="kpi-card")

# Generate tab per CSR
def generate_csr_tab(csr_name):
    csr_df = df[df["Name of CSR"] == csr_name].copy()

    # Parse and clean date
    csr_df["Date_of_Camp"] = pd.to_datetime(csr_df["Date_of_Camp"], errors="coerce")

    # KPIs
    total_camps = csr_df["Healthcamps_conducted"].sum()
    total_patients = csr_df["Patients_treated"].sum()
    avg_cost_per_camp = round(csr_df["Cost_per_Camp"].mean(), 2)
    avg_consultation_time = round(csr_df["Avg_Consultation_Time"].mean(), 2)

    # Bar chart: Patients treated per district
    fig1 = go.Figure()
    fig1.add_trace(go.Bar(
        x=csr_df["District"],
        y=csr_df["Patients_treated"],
        name="Patients Treated"
    ))
    fig1.update_layout(title="Patients Treated per District", template="plotly_dark")

    # Line chart: Cost per patient over time (aggregated)
    grouped = csr_df.groupby("Date_of_Camp").agg({"Cost_per_Patient": "mean"}).reset_index()
    grouped = grouped.sort_values("Date_of_Camp")

    fig2 = go.Figure()
    fig2.add_trace(go.Scatter(
        x=grouped["Date_of_Camp"],
        y=grouped["Cost_per_Patient"],
        mode="lines+markers",
        line_shape="spline",
        marker=dict(size=6),
        name="Cost per Patient"
    ))
    fig2.update_layout(title="Cost per Patient over Time", template="plotly_dark")

    return [
        html.Div([
            kpi_summary("Total Camps", total_camps),
            kpi_summary("Patients Treated", total_patients),
            kpi_summary("Avg. Cost per Camp", avg_cost_per_camp, "₹"),
            kpi_summary("Avg. Consultation Time", avg_consultation_time, "min"),
        ], className="kpi-row"),
        dcc.Graph(figure=fig1, className="dash-graph"),
        dcc.Graph(figure=fig2, className="dash-graph"),
    ]

# Tabs for each CSR
tabs = []
for csr_name in df["Name of CSR"].unique():
    tabs.append(dcc.Tab(
        label=csr_name,
        children=generate_csr_tab(csr_name),
        className="tab",
        selected_className="tab--selected"
    ))

# App layout
app.layout = html.Div([
    html.H1("CSR Impact Assessment Dashboard"),
    dcc.Tabs(children=tabs)
])

if __name__ == "__main__":
    app.run(debug=True, port=9050)
