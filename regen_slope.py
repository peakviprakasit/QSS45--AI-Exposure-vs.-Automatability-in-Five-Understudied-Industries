#!/usr/bin/env python
"""Slopegraph for the figure-with-text-aside layout. Restores the subtitle + provenance
   footer, and uses Hanken Grotesk (loaded via an injected font link) instead of default
   Helvetica/Arial. Overwrites the html."""
import numpy as np, pandas as pd
import plotly.graph_objects as go
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=next((p for p in [HERE,*HERE.parents] if (p/"data"/"processed").exists()),HERE)
PROC=ROOT/"data"/"processed"; OUT=ROOT/"output"/"figures"; WEB=ROOT/"website"/"public"/"figures"
df=pd.read_csv(PROC/"final_selected_model_scores_stratified_sample.csv",dtype={"job_id":str})
df["final_exposure_score"]=pd.to_numeric(df["final_exposure_score"],errors="coerce")
df["year"]=pd.to_numeric(df["year"],errors="coerce").astype(int)
INK="#16222e";SUB="#5a6b7b";GRID="#eef2f6";FOOTC="#9aa7b4"
IND_COLOR={"patent_ip":"#11405c","pharma_chem":"#2f8f8a","legal_services":"#3f7cac","insurance":"#c47a3f","farming_forestry":"#977a55"}
LABEL={"patent_ip":"Patent / IP","pharma_chem":"Pharma / Chemical","legal_services":"Legal Services","insurance":"Insurance","farming_forestry":"Farming & Forestry"}
FONT="Hanken Grotesk, Arial, sans-serif"
FONTLINK='<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">'
N=len(df.dropna(subset=["final_exposure_score"]))
piv=df.pivot_table(index="industry_key",columns="year",values="final_exposure_score",aggfunc="mean")
ORDER=list(piv[2026].sort_values(ascending=False).index)
fig=go.Figure()
laby={k:piv.loc[k,2026] for k in ORDER}
for a,b in zip(sorted(ORDER,key=lambda k:laby[k])[:-1],sorted(ORDER,key=lambda k:laby[k])[1:]):
    if laby[b]-laby[a]<0.0095: laby[b]=laby[a]+0.0095
for key in ORDER:
    y24,y26=piv.loc[key,2024],piv.loc[key,2026]; c=IND_COLOR[key]; mult=y26/y24 if y24>0 else np.nan
    fig.add_trace(go.Scatter(x=[0,1],y=[y24,y26],mode="lines+markers",name=LABEL[key],
        line=dict(color=c,width=3),marker=dict(size=[8,13],color=c,line=dict(width=1.3,color="white")),
        customdata=[[2024,mult],[2026,mult]],
        hovertemplate="<b>"+LABEL[key]+"</b><br>%{customdata[0]}: %{y:.3f}<br>×%{customdata[1]:.2f} vs 2024<extra></extra>"))
    fig.add_annotation(x=1.04,y=laby[key],xref="x",yref="y",text=f"<b>{LABEL[key]}</b>  {y26:.3f} ({mult:.1f}×)",
                       showarrow=False,xanchor="left",font=dict(size=11,color=c))
fig.add_annotation(text=f"Model-labeled estimates · stratified sample n={N:,} (LinkedIn postings, 5 industries) · exposure: gpt-5.4",
                   xref="paper",yref="paper",x=0,y=-0.175,showarrow=False,xanchor="left",align="left",font=dict(size=9.5,color=FOOTC))
fig.update_layout(template="plotly_white",font=dict(family=FONT,color=INK,size=12),
    title=dict(text="<b>AI exposure by industry, 2024 &#8594; 2026</b><br>"
               "<span style='font-size:11.5px;color:"+SUB+"'>Knowledge work surges; manual &amp; clerical roles hold flat or dip.</span>",
               x=0.0,xanchor="left",y=0.97,font=dict(size=15,color=INK)),
    paper_bgcolor="white",plot_bgcolor="white",margin=dict(l=52,r=190,t=84,b=66),height=540,showlegend=False,
    hoverlabel=dict(bgcolor="white",bordercolor="#cdd6df",font=dict(family=FONT,size=12,color="#000")))
fig.update_xaxes(tickmode="array",tickvals=[0,1],ticktext=["2024","2026"],range=[-0.16,2.0],showgrid=False,title="",linecolor="#cdd6df")
fig.update_yaxes(title="Mean AI exposure score",range=[0,0.176],showgrid=True,gridcolor=GRID,zeroline=False,linecolor="#cdd6df")
for d in (OUT,WEB):
    p=d/"fig09_exposure_by_industry_slope.html"
    fig.write_html(p,include_plotlyjs=True,full_html=True,config={"displayModeBar":False,"displaylogo":False,"responsive":True})
    html=p.read_text(encoding="utf-8")
    if "Hanken+Grotesk" not in html:
        p.write_text(html.replace("</head>",FONTLINK+"</head>",1),encoding="utf-8")
print("wrote slopegraph (subtitle + footer + Hanken Grotesk)")
