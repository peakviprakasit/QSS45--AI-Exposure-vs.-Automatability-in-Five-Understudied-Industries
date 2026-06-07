#!/usr/bin/env python
"""Compact, square-ish variants of the movement map + joint density, with BOTTOM legends
   (not right-side) and no footer, so they pair cleanly side-by-side AND stay interactive.
   Overwrites fig09_movement_map.html + fig09_joint_density.html (used full-width on /v2 too —
   bottom-legend layout works at both widths). Trace code mirrors nb09."""
import numpy as np, pandas as pd
import plotly.graph_objects as go
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = next((p for p in [HERE, *HERE.parents] if (p/"data"/"processed").exists()), HERE)
PROC = ROOT/"data"/"processed"
OUT  = ROOT/"output"/"figures"
WEB  = ROOT/"website"/"public"/"figures"

df = pd.read_csv(PROC/"final_selected_model_scores_stratified_sample.csv", dtype={"job_id": str})
for c in ["year","final_exposure_score","final_automatable_score"]:
    df[c] = pd.to_numeric(df[c], errors="coerce")
df["year"] = df["year"].astype(int)

INK="#16222e"; SUB="#5a6b7b"; GRID="#eef2f6"
C_EXP="#1f6f8b"; C_EXP_L="#b9d4dd"
IND_COLOR={"patent_ip":"#11405c","pharma_chem":"#2f8f8a","legal_services":"#3f7cac",
           "insurance":"#c47a3f","farming_forestry":"#977a55"}
LABEL={"patent_ip":"Patent / IP","pharma_chem":"Pharma / Chemical","legal_services":"Legal Services",
       "insurance":"Insurance","farming_forestry":"Farming & Forestry"}
SHORT={"patent_ip":"Patent/IP","pharma_chem":"Pharma","legal_services":"Legal",
       "insurance":"Insurance","farming_forestry":"Farming"}
FONT="Helvetica Neue, Arial, sans-serif"
piv_exp = df.pivot_table(index="industry_key",columns="year",values="final_exposure_score",aggfunc="mean")
piv_auto= df.pivot_table(index="industry_key",columns="year",values="final_automatable_score",aggfunc="mean")
ORDER=list(piv_exp[2026].sort_values(ascending=False).index)

def base_c(fig, title, subtitle, h=560):
    fig.update_layout(
        template="plotly_white", font=dict(family=FONT, color=INK, size=12.5),
        title=dict(text=f"<b>{title}</b><br><span style='font-size:11.5px;color:{SUB}'>{subtitle}</span>",
                   x=0.012, xanchor="left", y=0.965, font=dict(size=16)),
        paper_bgcolor="white", plot_bgcolor="white",
        margin=dict(l=56, r=22, t=74, b=78), height=h,
        hoverlabel=dict(bgcolor="white", bordercolor="#cdd6df", font=dict(family=FONT, size=12, color="#000")),
        legend=dict(orientation="h", y=-0.155, x=0.5, xanchor="center", font=dict(size=10.5),
                    bgcolor="rgba(255,255,255,0)"))
    fig.update_xaxes(showgrid=True, gridcolor=GRID, zeroline=False, linecolor="#cdd6df")
    fig.update_yaxes(showgrid=True, gridcolor=GRID, zeroline=False, linecolor="#cdd6df")
    return fig

def export(fig, name):
    for d in (OUT, WEB):
        fig.write_html(d/name, include_plotlyjs=True, full_html=True,
                       config={"displayModeBar":False,"displaylogo":False,"responsive":True,
                               "modeBarButtonsToRemove":["select2d","lasso2d","autoScale2d"]})
    print("wrote", name)

# ===== movement map =====
fig=go.Figure()
for key in ORDER:
    x24,y24=piv_exp.loc[key,2024],piv_auto.loc[key,2024]
    x26,y26=piv_exp.loc[key,2026],piv_auto.loc[key,2026]
    c=IND_COLOR[key]
    fig.add_trace(go.Scatter(
        x=[x24,x26], y=[y24,y26], mode="markers", name=SHORT[key], legendgroup=key,
        marker=dict(size=[12,20], color=c, symbol=["circle-open","circle"],
                    line=dict(width=[2.2,1.5], color="white"), opacity=1),
        text=[LABEL[key],LABEL[key]], customdata=[[2024],[2026]],
        hovertemplate="<b>%{text}</b><br>Year %{customdata[0]}<br>"
                      "AI exposure: %{x:.3f}<br>Automatability: %{y:.3f}<extra></extra>"))
    fig.add_annotation(x=x26,y=y26, ax=x24,ay=y24, xref="x",yref="y",axref="x",ayref="y",
                       showarrow=True, arrowhead=2, arrowsize=1, arrowwidth=2,
                       arrowcolor=c, opacity=0.9, standoff=11, startstandoff=6)
base_c(fig,"Exposure moved, automatability didn’t",
       "each arrow = one industry, 2024 → 2026 · hover for values")
fig.update_xaxes(title="Mean AI exposure  →", range=[0,0.215])
fig.update_yaxes(title="Automatability  ↑", range=[0.248,0.378])
export(fig,"fig09_movement_map.html")

# ===== joint density =====
_d = df.dropna(subset=["final_exposure_score","final_automatable_score"]).copy()
_N=len(_d); _r=float(np.corrcoef(_d.final_exposure_score,_d.final_automatable_score)[0,1])
_rng=np.random.default_rng(42)
_d["_jx"]=np.clip(_d.final_exposure_score+_rng.normal(0,0.012,_N),0,1)
_d["_jy"]=np.clip(_d.final_automatable_score+_rng.normal(0,0.018,_N),0,1)
fig=go.Figure()
fig.add_trace(go.Histogram2dContour(x=_d._jx,y=_d._jy,
    colorscale=[[0,"#ffffff"],[0.25,"#cfe3ea"],[0.6,"#7fb4c4"],[1,"#11405c"]],
    showscale=False, showlegend=False, ncontours=14, line=dict(width=0), hoverinfo="skip", opacity=0.9))
for key in [k for k in ORDER if k in _d.industry_key.unique()]:
    s=_d[_d.industry_key==key]
    fig.add_trace(go.Scattergl(x=s._jx,y=s._jy,mode="markers",name=SHORT[key],
        marker=dict(size=4,color=IND_COLOR[key],opacity=0.34,line=dict(width=0)),
        customdata=np.stack([s.title_clean.fillna("(no title)"),s.year],axis=-1),
        hovertemplate="<b>%{customdata[0]}</b><br>"+LABEL[key]+" · %{customdata[1]}<br>"
                      "Exposure %{x:.2f} · Automatability %{y:.2f}<extra></extra>"))
fig.add_vline(x=0.5,line=dict(color="#9aa7b4",dash="dash",width=1))
fig.add_hline(y=0.5,line=dict(color="#9aa7b4",dash="dash",width=1))
fig.add_annotation(x=0.5,y=0.62,text=f"<b>r = {_r:+.2f}</b>",showarrow=False,
    font=dict(size=14,color=INK),bgcolor="white",bordercolor="#cdd6df",borderwidth=1,borderpad=5)
for qx,qy,t in [(0.97,0.97,"exposed &<br>automatable"),(0.03,0.97,"automatable,<br>not exposed"),
                (0.97,0.03,"exposed,<br>not automatable"),(0.03,0.03,"neither")]:
    fig.add_annotation(x=qx,y=qy,text=t,showarrow=False,xanchor="right" if qx>0.5 else "left",
                       yanchor="top" if qy>0.5 else "bottom",font=dict(size=9.5,color="#90a4b8"))
base_c(fig,"Exposure ≠ automatability",
       f"each point = one posting (n={_N:,}) · r = {_r:+.2f} · hover for the role")
fig.update_xaxes(title="AI exposure  →", range=[-0.02,1.02])
fig.update_yaxes(title="Automatability  ↑", range=[-0.02,1.02])
export(fig,"fig09_joint_density.html")
print("done")
