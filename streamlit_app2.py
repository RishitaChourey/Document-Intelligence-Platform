import streamlit as st
import pandas as pd
import datetime
import time
import random
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from PIL import Image
import html
import re

# Page configuration
st.markdown("""
<style>
/* --- General App Background --- */
.main {
    background: linear-gradient(135deg, #EBEDF3, #fff3e0);
    color: #676767;
    font-family: 'Segoe UI', sans-serif;
    transition: all 0.3s ease;
}

/* --- Header --- */
.main-header {
    background: linear-gradient(90deg, #003B6D, #6699CC);
    padding: 1rem;
    border-radius: 8px;
    color: white;
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    letter-spacing: 1px;
}

/* --- Cards --- */
.decision-card {
    border: 1px solid #BDBDBD;
    border-radius: 14px;
    padding: 1.5rem;
    margin: 0.8rem 0;
    background: linear-gradient(145deg, #ffffff, #F7F7F7);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.decision-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

/* --- Risk Levels --- */
.risk-high { border-left: 6px solid #dc3545; background-color: #ffe5e5; }
.risk-medium { border-left: 6px solid #ffc107; background-color: #fff8e1; }
.risk-low { border-left: 6px solid #28a745; background-color: #e8f5e9; }

/* --- Workflow Stages --- */
.workflow-stage {
    display: inline-block;
    padding: 0.5rem 1.2rem;
    margin: 0.3rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.95rem;
    color: #ffffff;
}
.stage-uploaded { background: #003B6D; }
.stage-review { background: #f57c00; }
.stage-approved { background: #28a745; }

/* --- Urgent Priority Pulse --- */
.priority-urgent { 
    animation: pulse 2s infinite;
    background: #ffebee !important;
    border-radius: 8px;
    padding: 8px 12px;
}
@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
}

/* --- Sidebar Navigation --- */
.sidebar-title {
    color: #003B6D;
    font-weight: bold;
    font-size: 1.4rem;
    margin-bottom: 20px;
    text-align: center;
}
.nav-item {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    margin: 5px 0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    color: #676767;
    border: 1px solid transparent;
    font-weight: 500;
}
.nav-item:hover {
    background: linear-gradient(90deg, #6699CC, #003B6D);
    border-color: #BDBDBD;
    color: white;
}
.nav-item.active {
    background: linear-gradient(90deg, #003B6D, #6699CC);
    color: white;
    border-color: #003B6D;
    font-weight: 600;
}
.nav-icon {
    margin-right: 12px;
    font-size: 18px;
    width: 22px;
    color: #6699CC;
}

/* --- Scrollable Summary Container --- */
.scroll-container {
    max-height: 600px;
    overflow-y: auto;
    padding: 20px;
    background: linear-gradient(145deg, #ffffff, #EBEDF3);
    border-radius: 12px;
    border: 1px solid #DDD;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.05);
}
.scroll-container h2 { color: #003B6D; }
.scroll-container h3 { color: #6699CC; }
.scroll-container p { color: #333333; line-height: 1.5rem; margin-bottom: 12px; }
</style>
""", unsafe_allow_html=True)


# Initialize session state
if 'documents' not in st.session_state:
    st.session_state.documents = [
        {
            'id': 'DOC001',
            'name': 'Annual Budget Report 2024.pdf',
            'category': 'Financial Report',
            'department': 'Finance',
            'status': 'Approved',
            'risk_score': 0.2,
            'upload_date': datetime.now() - timedelta(days=5),
            'assignee': 'John Doe',
            'reviewer': 'Jane Smith',
            'priority': 'Medium',
            'size': '2.4 MB',
            'summary': 'Annual financial overview with budget allocations for metro expansion projects.',
            'policy_match': 'Financial Compliance Policy v2.1',
            'next_step': 'Archive after board meeting',
            'chat_count': 3,
            'extracted_data': {'tables': 5, 'charts': 12, 'images': 8}
        },
        {
            'id': 'DOC002',
            'name': 'Safety Audit Report - Line 1.docx',
            'category': 'Safety Audit',
            'department': 'Operations',
            'status': 'Under Review',
            'risk_score': 0.8,
            'upload_date': datetime.now() - timedelta(days=2),
            'assignee': 'Mike Johnson',
            'reviewer': 'Sarah Wilson',
            'priority': 'Urgent',
            'size': '1.8 MB',
            'summary': 'Critical safety findings requiring immediate attention on Line 1 operations.',
            'policy_match': 'Safety Standards Manual v3.2',
            'next_step': 'Schedule emergency review meeting',
            'chat_count': 8,
            'extracted_data': {'tables': 3, 'charts': 6, 'images': 15}
        },
        {
            'id': 'DOC003',
            'name': 'Vendor Contract - ABC Systems.pdf',
            'category': 'Contract',
            'department': 'Procurement',
            'status': 'Pending Approval',
            'risk_score': 0.4,
            'upload_date': datetime.now() - timedelta(days=1),
            'assignee': 'Lisa Brown',
            'reviewer': 'Tom Davis',
            'priority': 'Medium',
            'size': '856 KB',
            'summary': 'Service contract for maintenance systems with standard terms and conditions.',
            'policy_match': 'Procurement Guidelines v1.8',
            'next_step': 'Legal team final review',
            'chat_count': 2,
            'extracted_data': {'tables': 2, 'charts': 1, 'images': 3}
        }
    ]

if 'processing_stats' not in st.session_state:
    st.session_state.processing_stats = {
        'today': 24,
        'this_week': 156,
        'total': 2847
    }

# Initialize current page in session state
if 'current_page' not in st.session_state:
    st.session_state.current_page = "Dashboard"

# Load the logo
logo = Image.open("C:/Users/ahsib/CodeCrumbsKMRL/docintellogo-removebg-preview.png")

# Display the logo in the sidebar
st.sidebar.image(logo, width=50)  # Adjust width as needed

# Sidebar title next to the logo
st.sidebar.markdown("""
<h1 style="display:inline; vertical-align: middle; margin-left:10px; color:#003B6D; font-size:1.8rem; font-weight:bold;">
    KMRL DocIntel
</h1>
""", unsafe_allow_html=True)

# Navigation menu items
nav_items = [
    ("Dashboard", "", "Overview and decision cards"),
    ("Upload Hub", "", "Document upload and processing"),
    ("Categorization", "", "Smart document classification"),
    ("Workflows", "", "Automation and task management"),
    ("Content", "", "Document repository and search"),
    ("Analytics", "", "Reports and insights"),
    ("Governance", "", "Compliance and audit trails"),
    ("Settings", "", "System configuration")
]

# Create navigation buttons
for page_name, icon, description in nav_items:
    # Check if this is the current page
    is_active = st.session_state.current_page == page_name
    
    # Create button with custom styling
    if st.sidebar.button(
        f"{icon} {page_name}",
        key=f"nav_{page_name}",
        help=description,
        use_container_width=True
    ):
        st.session_state.current_page = page_name
        st.rerun()

# Add some spacing
st.sidebar.markdown("---")

# Quick stats in sidebar
st.sidebar.markdown("### Quick Stats")
st.sidebar.metric("Active Documents", len([d for d in st.session_state.documents if d['status'] in ['Under Review', 'Pending Approval']]))
st.sidebar.metric("Today's Uploads", st.session_state.processing_stats['today'])
st.sidebar.metric("Pending Actions", len([d for d in st.session_state.documents if d['priority'] == 'Urgent']))

page = st.session_state.current_page

# Main header container with logo and text
logo = Image.open("C:/Users/ahsib/CodeCrumbsKMRL/docintellogo-removebg-preview.png")  # load logo

# Create a styled container
st.markdown("""
<div style="
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #003B6D, #6699CC);
    padding: 1rem 1.5rem;
    border-radius: 6px;
    color: white;
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
    margin-bottom: 1.2rem;
">
""", unsafe_allow_html=True)

# Columns for logo and text inside the container
col1, col2 = st.columns([1, 5])

with col1:
    st.image(logo, width=100)  # logo displayed using Streamlit

with col2:
    st.markdown("""
    <div>
        <h1 style="margin:0; font-size:2rem;">KMRL Document Intelligence Platform</h1>
        <p style="margin:0; font-size:1rem;">Centralized document upload and processing for intelligent categorization and workflow automation</p>
    </div>
    """, unsafe_allow_html=True)

# Close container div
st.markdown("</div>", unsafe_allow_html=True)

# Dashboard Page
if page == "Dashboard":
    st.markdown(f"# {page}")
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="Today's Uploads",
            value=st.session_state.processing_stats['today'],
            delta="12 vs yesterday"
        )
    
    with col2:
        st.metric(
            label="This Week",
            value=st.session_state.processing_stats['this_week'],
            delta="23 vs last week"
        )
    
    with col3:
        st.metric(
            label="Total Processed",
            value=f"{st.session_state.processing_stats['total']:,}",
            delta="2,847 all time"
        )
    
    with col4:
        pending_count = len([d for d in st.session_state.documents if d['status'] in ['Under Review', 'Pending Approval']])
        st.metric(
            label="Pending Reviews",
            value=pending_count,
            delta="-2 vs yesterday",
            delta_color="inverse"
        )

    st.markdown("---")

    # Decision Cards Section
    st.subheader("Decision Cards - Documents Requiring Action")
    
    for doc in st.session_state.documents:
        if doc['status'] in ['Under Review', 'Pending Approval']:
            risk_class = "risk-high" if doc['risk_score'] > 0.7 else "risk-medium" if doc['risk_score'] > 0.4 else "risk-low"
            priority_class = "priority-urgent" if doc['priority'] == 'Urgent' else ""
            
            st.markdown(f"""
            <div class="decision-card {risk_class} {priority_class}">
                <div style="display: flex; justify-content: between; align-items: center;">
                    <div style="flex: 1;">
                        <h4>{doc['name']}</h4>
                        <p><strong>Summary:</strong> {doc['summary']}</p>
                        <p><strong>Policy Match:</strong> {doc['policy_match']}</p>
                        <p><strong>Risk Score:</strong> {doc['risk_score']:.1f} | <strong>Priority:</strong> {doc['priority']} | <strong>Assignee:</strong> {doc['assignee']}</p>
                    </div>
                    <div style="text-align: right;">
                        <p><strong>Next Step:</strong></p>
                        <p style="color: #1976d2; font-weight: bold;">{doc['next_step']}</p>
                        <p><small>{doc['chat_count']} discussions</small></p>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            col1, col2, col3 = st.columns(3)
            with col1:
                if st.button(f"Approve {doc['id']}", key=f"approve_{doc['id']}"):
                    doc['status'] = 'Approved'
                    st.success(f"Document {doc['id']} approved! Immutable snapshot created.")
                    st.rerun()
            
            with col2:
                if st.button(f"Review {doc['id']}", key=f"review_{doc['id']}"):
                    st.info(f"Opening review interface for {doc['id']}")
            
            with col3:
                if st.button(f"Chat {doc['id']}", key=f"chat_{doc['id']}"):
                    st.info(f"Opening discussion thread for {doc['id']}")

    st.markdown("---")

    # Workflow Visualization
    st.subheader("Current Workflows")
    
    workflow_data = []
    for doc in st.session_state.documents:
        workflow_data.append({
            'Document': doc['name'][:30] + '...' if len(doc['name']) > 30 else doc['name'],
            'Status': doc['status'],
            'Department': doc['department'],
            'Priority': doc['priority'],
            'Days Since Upload': (datetime.now() - doc['upload_date']).days
        })
    
    df = pd.DataFrame(workflow_data)
    
    # Status distribution
    col1, col2 = st.columns(2)
    
    with col1:
        status_counts = df['Status'].value_counts()
        fig = px.pie(values=status_counts.values, names=status_counts.index, 
                     title="Document Status Distribution")
        fig.update_traces(textposition='inside', textinfo='percent+label')
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        dept_counts = df['Department'].value_counts()
        fig = px.bar(x=dept_counts.index, y=dept_counts.values, 
                     title="Documents by Department")
        fig.update_layout(xaxis_title="Department", yaxis_title="Document Count")
        st.plotly_chart(fig, use_container_width=True)

# ---- File upload section ----
uploaded_files = st.file_uploader(
    "Choose files",
    type=['pdf', 'doc', 'docx', 'txt', 'jpg', 'png', 'gif', 'svg', 'xls', 'xlsx', 'csv', 'zip', 'rar', '7z'],
    accept_multiple_files=True,
    help="Support for multiple file formats up to 100MB each"
)

# ---- Hardcoded Vigilance Manual Summary ----
SUMMARY_TEXT = """
## Meeting Overview
The meeting is focused on the introduction and importance of a Vigilance Manual for Kochi Metro Rail Limited, aimed at promoting transparency, preventing corruption, and enhancing governance within the organization.

### Chairman's Message on Vigilance Manual
The Vigilance Manual aims to enhance transparency and integrity within Kochi Metro Rail Limited (KMRL).
Emphasizes the importance of vigilance in preventing corruption and ensuring fair duty performance.
Highlights vigilance as part of overall risk management to improve organizational efficiency.
Aims to create awareness among KMRL officers and staff regarding vigilance administration.
Congratulates the team for developing the manual.

### Foreword on Corruption Awareness
The foreword stresses the need for vigilance against corruption to protect societal values and promote ethical practices.
Corruption negatively impacts social dynamics and economic growth.
Vigilance awareness is crucial for understanding rights and duties in combating corruption.
Preventive vigilance is highlighted as a modern management tool to avert frauds and scams.
The manual serves as a guiding document for efficient and transparent vigilance duties.

### Introduction to Corruption and Vigilance
Corruption has historical roots and requires organized vigilance for effective management.
Corruption is an age-old issue, referenced in Kautilya’s “Arthashastra.”
The establishment of the Central Vigilance Commission (CVC) in 1964 was a significant step in combating corruption.
The manual outlines the evolution of vigilance organizations and their roles in public sector undertakings.

### Vigilance Approaches in Public Sector
The vigilance administration in public sector undertakings (PSUs) employs preventive and punitive approaches.
Preventive vigilance focuses on identifying and mitigating potential corruption risks.
Punitive vigilance involves taking action against employees responsible for misconduct.
Employees are protected under Article 311 of the Constitution, ensuring fair inquiry processes.

### Understanding the Vigilance Angle
The concept of the Vigilance Angle is crucial in identifying corrupt practices within the organization.
Defined by the CVC, it includes acts like accepting bribes or possessing disproportionate assets.
Other irregularities may indicate integrity issues, requiring careful evaluation.
Delays in case disposal can reinforce the presence of a vigilance angle.

### Core Principles of Vigilance
Integrity in governance is paramount.
Combating corruption and ensuring professionalism are critical.
Transparency, promptness, and impartiality are fundamental tenets of vigilance.

### Defining Corruption and Its Impact
Corruption is defined as the abuse of power for personal gain, with significant negative consequences.
Causes include poor regulatory frameworks and social tolerance for unethical practices.
The impact includes economic inefficiencies and threats to national security.

### Governmental Institutions for Vigilance
The Central Vigilance Commission (CVC) oversees vigilance matters in India.
Established in 1964, the CVC advises on vigilance administration and investigates corruption cases.
It reviews procedures and practices to enhance integrity in public administration.
The CVC collects data and presents annual reports to the President.

### Vigilance Administration in KMRL
KMRL's vigilance administration follows CVC guidelines.
The Chief Vigilance Officer (CVO) is appointed preferably from outside KMRL.
A Vigilance Committee oversees vigilance matters and ensures timely case disposal.
The committee reviews procurement processes and identifies corruption-prone areas for proactive measures.

### Functions and Responsibilities of Vigilance Committee
Reviews status of comments and actions on CTE type Intensive Examination Reports.
Facilitates study of system improvements by the Vigilance Officer every three months.
Reviews implementation of the Corruption Risk Management Policy.
Ensures all Executives undergo Vigilance Awareness Program at least once every 10 years.
Provides logistical support to Vigilance Officers for efficient functioning.
Undertakes any additional tasks assigned by the Managing Director or Chief Vigilance Officer.

### Functions and Responsibilities of Vigilance Officials
Investigate authenticated complaints from high-level references and media.
Conduct checks and follow-up investigations on serious irregularities.
Ensure timely proceedings of vigilance cases and regular reviews.
Prepare accurate charge sheets and ensure prompt appointments of inquiry officers.
Maintain liaison with the CVC and CBI.
Monitor integrity of personnel within the vigilance department and conduct regular inspections.

### Different Facets of Vigilance
Vigilance is integral to risk management, aimed at preventing corruption and ensuring organizational efficiency.
Striking a balance between over-vigilance and under-vigilance is crucial to avoid demoralization and corruption.
Positive vigilance involves transparency, impartiality, and fair procedures to uphold integrity.

### Preventive Vigilance
Identifies and modifies procedures that provide scope for corruption.
Reviews regulatory functions to ensure necessity and efficiency.
Educates citizens about procedures and simplifies cumbersome processes.
Ensures integrity by posting trustworthy officers in sensitive areas.
Implements regular staff rotation and updates manuals on important subjects.

### Detective Vigilance
Utilizes complaints, inspection reports, and audits to detect irregularities.
Monitors public contact points and officials in sensitive positions.
Organizes traps and raids in collaboration with police or CBI.

### Corrective Vigilance
Analyzes results of investigations to find contributing factors to misconduct.
Updates practices to enhance transparency and plug loopholes.
Educates employees through case studies and promotes transparency in decision-making.

### Administrative Vigilance
Conducts monthly vigilance committee meetings.
Issues No-Objection Certificates and ensures timely submission of reports.

### Punitive Vigilance
Scrutinizes complaints to determine if they involve a vigilance angle.
Completes investigations in a timely manner as per CVC guidelines.
Ensures proper drafting of charge sheets and adherence to disciplinary rules.

### Complaints and Investigation
Complaints can originate from public or internal employees.
Anonymous complaints are generally not acted upon unless verified.
Complaints are scrutinized for substance, and appropriate actions are taken based on findings.

### Whistle Blower Policy
Establishes a mechanism for employees to report genuine concerns.
Protects whistleblowers from harassment or victimization.
Defines roles and responsibilities of whistleblowers and investigators.

### Integrity Pact Overview
Integrity Pacts prevent corruption in public contracting.
Agreements between contracting authorities and bidders abstain from corrupt practices.
Enhances transparency, trust, and efficiency in public procurement.

### Periodic Review and Evaluation of Integrity Pact
IEMs submit quarterly reports.
Self-assessments and external reviews evaluate effectiveness in reducing corruption.

### Checklist for Tenders and Contracts
Provides criteria for open, limited, and single tenders to ensure transparency and fairness.

### CTE/CVC Guidelines for Procurement Improvement
Emphasizes codified purchase manual, proper filing systems, and transparent tendering.
Ensures reasonableness of prices, avoids favoritism, and maintains fair bidding.

### Awarding Contracts on Nomination Basis
All contracts awarded on nomination basis are reported to PSU Boards.
Quarterly reports submitted and audit committee checks at least 10%.
Tendering or public auction ensures compliance with Article 14.

### Mobilization Advance Guidelines
Mobilization advances should be interest-bearing.
Recovery should be time-based and not linked to work progress.
Bank Guarantees must be furnished against advances.

### Post Tender Negotiation Restrictions
Post-tender negotiations prohibited except with L-1 bidder.
Any negotiation must be justified and documented.
Maximum timeframe of one month for tender award process.

### Use of Websites in Tender Processes
Bid documents published on organization's website.
Short-term tenders posted online for transparency and competition.
Vendor directories updated regularly.

### Leveraging Technology for Transparency
Provide comprehensive information on websites for laws, licenses, and clearances.
Applications for vendor registration and status of payments accessible online.
E-procurement systems certified for security and compliance.

### E-Payments Implementation
Payments to suppliers/vendors should be made electronically wherever possible.
Transition to e-payments in phased manner starting with major suppliers.

### Undertaking by Tender Committee Members
Members must disclose personal interests.
Members with conflicts refrain from participating.

### Recovery from Intensive Examination Findings
Recoveries enforced as per contract conditions.
Executing agencies consider Commission's observations and advice.
"""

TAGS = ["Transparency", "Vigilance", "KMRL", "Anti-Corruption", "Governance"]

def _format_heading(text, level=2):
    color = "#003B6D" if level == 2 else "#6699CC"
    size = "1.25rem" if level == 2 else "1.05rem"
    return f'<h{level} style="color:{color}; margin-top:14px; margin-bottom:6px; font-size:{size};">{html.escape(text)}</h{level}>'

def _wrap_html(body_html):
    """Wrap HTML to keep consistent container styling."""
    return f'''
    <div style="
        max-height: 520px;
        overflow-y: auto;
        padding: 16px;
        background: linear-gradient(145deg,#ffffff,#F7F7F7);
        border-radius: 10px;
        border: 1px solid #DDD;
    ">
    {body_html}
    </div>
    '''

# ---- Process uploaded files ----
if uploaded_files:
    for uploaded_file in uploaded_files:
        with st.expander(f"Processing: {uploaded_file.name}", expanded=True):
            # File details: left column for summary, right for tags
            col_summary, col_tags = st.columns([3, 1])

            # ---- File Details Card (above summary) ----
            with col_summary:
                st.markdown(
                    f"""
                    <div style="
                        background-color: #EBEDF3;
                        padding: 12px;
                        border-radius: 10px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
                        margin-bottom: 12px;
                    ">
                        <strong>Name:</strong> {html.escape(uploaded_file.name)}<br>
                        <strong>Size:</strong> {uploaded_file.size / 1024:.1f} KB<br>
                        <strong>Type:</strong> {html.escape(uploaded_file.type)}
                    </div>
                    """, unsafe_allow_html=True
                )

            # ---- Simulate AI Processing ----
            progress_bar = st.progress(0)
            status_text = st.empty()
            for i in range(100):
                progress_bar.progress(i + 1)
                if i < 30:
                    status_text.text("Analyzing content...")
                elif i < 60:
                    status_text.text("Generating summary...")
                elif i < 90:
                    status_text.text("Classifying document...")
                else:
                    status_text.text("Processing complete!")
                time.sleep(0.01)

            # ---- Streaming Summary (left column) ----
            summary_placeholder = col_summary.empty()

            # Parse the summary into "blocks" by blank lines
            paragraphs = re.split(r'\n\s*\n', SUMMARY_TEXT.strip())

            current_html = ""   # holds completed HTML (headers + finished paragraphs)
            # Start with an empty rendered container so we can update it repeatedly
            summary_placeholder.markdown(_wrap_html(""), unsafe_allow_html=True)

            for para in paragraphs:
                para = para.strip()
                if not para:
                    continue

                # Handle headings (# / ## / ###)
                if para.startswith("# "):
                    heading_text = para[2:].strip()
                    current_html += _format_heading(heading_text, level=2)
                    summary_placeholder.markdown(_wrap_html(current_html), unsafe_allow_html=True)
                    time.sleep(0.18)
                    continue
                if para.startswith("## "):
                    heading_text = para[3:].strip()
                    current_html += _format_heading(heading_text, level=3)
                    summary_placeholder.markdown(_wrap_html(current_html), unsafe_allow_html=True)
                    time.sleep(0.14)
                    continue
                if para.startswith("### "):
                    heading_text = para[4:].strip()
                    current_html += _format_heading(heading_text, level=4)
                    summary_placeholder.markdown(_wrap_html(current_html), unsafe_allow_html=True)
                    time.sleep(0.12)
                    continue

                # If paragraph looks like a bullet list (lines starting with '-' or digits), render list and stream item-by-item
                lines = [ln.strip() for ln in para.splitlines() if ln.strip()]
                is_list = all(re.match(r'^(-\s+|\d+\.)', ln) for ln in lines) and len(lines) > 1

                if is_list:
                    # stream list items
                    list_html = "<ul style='margin-bottom:10px; padding-left:18px; color:#333;'>"
                    for ln in lines:
                        # remove leading marker
                        item_text = re.sub(r'^(-\s+|\d+\.\s*)', '', ln)
                        list_html += f"<li>{html.escape(item_text)}</li>"
                        # display current_html + partial list
                        summary_placeholder.markdown(_wrap_html(current_html + list_html + "</ul>"), unsafe_allow_html=True)
                        time.sleep(0.12)
                    # finalize list
                    current_html += list_html + "</ul>"
                    time.sleep(0.12)
                    continue

                # Normal paragraph: stream sentence-by-sentence
                # Split into sentences (keeps punctuation) — simple heuristic
                sentences = re.split(r'(?<=[.!?])\s+', para)
                para_build = "<p style='margin-bottom:10px; line-height:1.6; color:#333;'>"
                for s in sentences:
                    s = s.strip()
                    if not s:
                        continue
                    # append sentence to the paragraph under construction
                    para_build += html.escape(s) + " "
                    # render current_html + in-progress paragraph
                    summary_placeholder.markdown(_wrap_html(current_html + para_build + "</p>"), unsafe_allow_html=True)
                    time.sleep(0.06)  # streaming speed per sentence
                # when paragraph complete, close and add to current_html
                para_build += "</p>"
                current_html += para_build
                # small pause between paragraphs
                time.sleep(0.14)

            # ---- Suggested Keywords (right column) - small cards with shadows ----
            tags_html = '<div style="display:flex; flex-wrap:wrap; gap:10px;">'
            for tag in TAGS:
                tags_html += f'''
                <div style="
                    padding:8px 12px;
                    border-radius:8px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
                    background: white;
                    font-weight:600;
                    color:#003B6D;
                    min-width: 80px;
                    text-align:center;
                ">{html.escape(tag)}</div>
                '''
            tags_html += '</div>'

            # Wrap tags in a small card so visual style matches summary
            col_tags.markdown(
                f"""
                <div style="
                    padding:12px;
                    border-radius:10px;
                    background: linear-gradient(145deg,#ffffff,#F7F7F7);
                    border:1px solid #DDD;
                    box-shadow: inset 0 2px 6px rgba(0,0,0,0.03);
                ">
                    <h4 style="color:#003B6D; margin-top:0; margin-bottom:8px;">Suggested Keywords</h4>
                    {tags_html}
                </div>
                """, unsafe_allow_html=True
            )
# Categorization Page
elif page == "Categorization":
    st.markdown(f"# {page}")
    st.markdown("*AI-powered document classification and department-wise organization*")
    st.markdown("---")
    
    st.subheader("Smart Categorization")
    
    # Category management
    categories = {
        "Financial Reports": ["Budget", "Audit", "Invoice", "Receipt"],
        "Safety Documents": ["Incident Report", "Safety Audit", "Training Manual"],
        "Contracts": ["Vendor Agreement", "Service Contract", "NDA"],
        "Operations": ["Maintenance Report", "Performance Metrics", "SOP"],
        "HR Documents": ["Policy", "Training", "Compliance"]
    }
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("**Department-wise Categories:**")
        for dept, cats in categories.items():
            with st.expander(f"{dept}"):
                for cat in cats:
                    st.write(f"• {cat}")
    
    with col2:
        st.write("**AI Classification Confidence:**")
        classification_data = {
            'Category': list(categories.keys()),
            'Accuracy': [95, 92, 88, 90, 94],
            'Documents': [120, 85, 95, 110, 75]
        }
        
        df = pd.DataFrame(classification_data)
        fig = px.bar(df, x='Category', y='Accuracy', 
                     title="AI Classification Accuracy by Category")
        fig.update_layout(yaxis_title="Accuracy (%)", xaxis_tickangle=-45)
        st.plotly_chart(fig, use_container_width=True)

# Workflows Page
elif page == "Workflows":
    st.markdown(f"# {page}")
    st.markdown("*Automated document routing, approvals, and task management*")
    st.markdown("---")
    
    st.subheader("Workflow Automation")
    
    # Kanban-style workflow board
    st.write("**Document Workflow Board**")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("### Uploaded")
        uploaded_docs = [d for d in st.session_state.documents if d['status'] == 'Uploaded']
        for doc in uploaded_docs:
            st.markdown(f"""
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 5px;">
                <strong>{doc['name'][:20]}...</strong><br>
                <small>{doc['department']} • {doc['priority']}</small>
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("### Under Review")
        review_docs = [d for d in st.session_state.documents if d['status'] == 'Under Review']
        for doc in review_docs:
            priority_style = "background-color: #ffebee;" if doc['priority'] == 'Urgent' else ""
            st.markdown(f"""
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 5px; {priority_style}">
                <strong>{doc['name'][:20]}...</strong><br>
                <small>{doc['assignee']} • {doc['priority']}</small>
            </div>
            """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("### Pending Approval")
        pending_docs = [d for d in st.session_state.documents if d['status'] == 'Pending Approval']
        for doc in pending_docs:
            st.markdown(f"""
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 5px;">
                <strong>{doc['name'][:20]}...</strong><br>
                <small>{doc['reviewer']} • {doc['priority']}</small>
            </div>
            """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("### Approved")
        approved_docs = [d for d in st.session_state.documents if d['status'] == 'Approved']
        for doc in approved_docs:
            st.markdown(f"""
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 5px; background-color: #e8f5e9;">
                <strong>{doc['name'][:20]}...</strong><br>
                <small>Archived • {doc['priority']}</small>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Workflow automation rules
    st.subheader("Automation Rules")
    
    with st.expander("Configure Workflow Rules"):
        st.selectbox("Document Type", ["All", "Financial Report", "Safety Audit", "Contract"])
        st.selectbox("Auto-assign to", ["Department Head", "Specific User", "Round Robin"])
        st.selectbox("Priority Escalation", ["None", "After 24 hours", "After 48 hours", "After 1 week"])
        st.checkbox("Send email notifications")
        st.checkbox("Create calendar reminders")
        
        if st.button("Save Workflow Rule"):
            st.success("Workflow rule saved successfully!")

# Content Page
elif page == "Content":
    st.markdown(f"# {page}")
    st.markdown("*Document repository with advanced search and content extraction*")
    st.markdown("---")
    
    st.subheader("Content Management")
    
    # Document listing with search
    search_term = st.text_input("Search documents...", placeholder="Enter document name, category, or department")
    
    # Filters
    col1, col2, col3 = st.columns(3)
    with col1:
        dept_filter = st.selectbox("Filter by Department", ["All"] + list(set([d['department'] for d in st.session_state.documents])))
    with col2:
        status_filter = st.selectbox("Filter by Status", ["All"] + list(set([d['status'] for d in st.session_state.documents])))
    with col3:
        priority_filter = st.selectbox("Filter by Priority", ["All"] + list(set([d['priority'] for d in st.session_state.documents])))
    
    # Document table
    filtered_docs = st.session_state.documents
    
    if search_term:
        filtered_docs = [d for d in filtered_docs if search_term.lower() in d['name'].lower() 
                        or search_term.lower() in d['category'].lower()
                        or search_term.lower() in d['department'].lower()]
    
    if dept_filter != "All":
        filtered_docs = [d for d in filtered_docs if d['department'] == dept_filter]
    
    if status_filter != "All":
        filtered_docs = [d for d in filtered_docs if d['status'] == status_filter]
    
    if priority_filter != "All":
        filtered_docs = [d for d in filtered_docs if d['priority'] == priority_filter]
    
    # Display documents
    for doc in filtered_docs:
        with st.expander(f"{doc['name']} - {doc['status']}"):
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.write("**Document Info:**")
                st.write(f"• ID: {doc['id']}")
                st.write(f"• Category: {doc['category']}")
                st.write(f"• Department: {doc['department']}")
                st.write(f"• Size: {doc['size']}")
                st.write(f"• Upload Date: {doc['upload_date'].strftime('%Y-%m-%d %H:%M')}")
            
            with col2:
                st.write("**Workflow Info:**")
                st.write(f"• Status: {doc['status']}")
                st.write(f"• Priority: {doc['priority']}")
                st.write(f"• Assignee: {doc['assignee']}")
                st.write(f"• Reviewer: {doc['reviewer']}")
                st.write(f"• Risk Score: {doc['risk_score']:.1f}")
            
            with col3:
                st.write("**Extracted Data:**")
                st.write(f"• Tables: {doc['extracted_data']['tables']}")
                st.write(f"• Charts: {doc['extracted_data']['charts']}")
                st.write(f"• Images: {doc['extracted_data']['images']}")
                st.write(f"• Discussions: {doc['chat_count']}")
            
            # Action buttons
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.button("Download", key=f"download_{doc['id']}")
            with col2:
                st.button("Chat", key=f"chat_content_{doc['id']}")
            with col3:
                st.button("Extract Data", key=f"extract_{doc['id']}")
            with col4:
                st.button("Share", key=f"share_{doc['id']}")

# Analytics Page
elif page == "Analytics":
    st.markdown(f"# {page}")
    st.markdown("*Comprehensive insights and performance metrics for document management*")
    st.markdown("---")
    
    st.subheader("Analytics Dashboard")
    
    # Time series chart
    dates = pd.date_range(start='2024-01-01', end='2024-09-26', freq='D')
    upload_counts = [random.randint(5, 25) for _ in range(len(dates))]
    
    fig = px.line(x=dates, y=upload_counts, title="Document Uploads Over Time")
    fig.update_layout(xaxis_title="Date", yaxis_title="Number of Uploads")
    st.plotly_chart(fig, use_container_width=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Department activity
        dept_activity = {
            'Finance': 45,
            'Operations': 32,
            'Procurement': 28,
            'HR': 18,
            'Engineering': 25
        }
        
        fig = px.bar(x=list(dept_activity.keys()), y=list(dept_activity.values()),
                     title="Document Activity by Department")
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Processing time analysis
        processing_times = [2, 4, 3, 6, 2, 5, 4, 3, 7, 2, 4, 5]
        fig = px.histogram(x=processing_times, nbins=10, 
                          title="Document Processing Time Distribution")
        fig.update_layout(xaxis_title="Processing Time (hours)", yaxis_title="Number of Documents")
        st.plotly_chart(fig, use_container_width=True)
    
    # Key insights
    st.subheader("Key Insights")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(
            label="Average Processing Time",
            value="4.2 hours",
            delta="-0.8 vs last month",
            delta_color="inverse"
        )
    
    with col2:
        st.metric(
            label="Auto-classification Accuracy",
            value="94.2%",
            delta="+2.1% vs last month"
        )
    
    with col3:
        st.metric(
            label="User Satisfaction Score",
            value="4.7/5.0",
            delta="+0.2 vs last month"
        )

# Governance Page
elif page == "Governance":
    st.markdown(f"# {page}")
    st.markdown("*Compliance tracking, audit trails, and immutable document history*")
    st.markdown("---")
    
    st.subheader("Governance & Compliance")
    
    # Compliance dashboard
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="Audit Ghosts",
            value="2,847",
            delta="All documents tracked"
        )
    
    with col2:
        st.metric(
            label="Compliance Score",
            value="98.5%",
            delta="+1.2% this month"
        )
    
    with col3:
        st.metric(
            label="Policy Violations",
            value="3",
            delta="-2 vs last month",
            delta_color="inverse"
        )
    
    with col4:
        st.metric(
            label="Security Incidents",
            value="0",
            delta="Clean record"
        )
    
    st.markdown("---")
    
    # Audit trail
    st.subheader("Audit Trail")
    
    audit_data = [
        {"Timestamp": "2024-09-26 14:30", "User": "john.doe@kmrl", "Action": "Document Approved", "Document": "Annual Budget Report", "IP": "192.168.1.45"},
        {"Timestamp": "2024-09-26 13:45", "User": "jane.smith@kmrl", "Action": "Review Completed", "Document": "Safety Audit Report", "IP": "192.168.1.52"},
        {"Timestamp": "2024-09-26 12:20", "User": "mike.johnson@kmrl", "Action": "Document Uploaded", "Document": "Vendor Contract", "IP": "192.168.1.33"},
        {"Timestamp": "2024-09-26 11:15", "User": "system", "Action": "Auto-Classification", "Document": "Maintenance Report", "IP": "System"},
        {"Timestamp": "2024-09-26 10:30", "User": "lisa.brown@kmrl", "Action": "Access Granted", "Document": "Financial Statement", "IP": "192.168.1.67"}
    ]
    
    audit_df = pd.DataFrame(audit_data)
    st.dataframe(audit_df, use_container_width=True)
    
    # Immutable snapshots
    st.subheader("Immutable Snapshots")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("**Recent Snapshots:**")
        for doc in st.session_state.documents:
            if doc['status'] == 'Approved':
                st.write(f"{doc['name']} - Hash: {hash(doc['name']) % 1000000:06d}")
                st.write(f"   └── Approved by {doc['reviewer']} on {doc['upload_date'].strftime('%Y-%m-%d')}")
    
    with col2:
        st.write("**Compliance Policies:**")
        policies = [
            "Financial Compliance Policy v2.1 ✓",
            "Safety Standards Manual v3.2 ✓", 
            "Procurement Guidelines v1.8 ✓",
            "Data Protection Policy v4.0 ✓",
            "Document Retention Policy v1.5 ✓"
        ]
        
        for policy in policies:
            st.write(f"• {policy}")
    
    # Retention and archival
    st.markdown("---")
    st.subheader("Document Lifecycle Management")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.write("**Hot Storage (Active)**")
        st.write("• 156 documents")
        st.write("• Last 30 days")
        st.write("• Instant access")
        st.progress(0.3)
    
    with col2:
        st.write("**Cold Storage (Archive)**")
        st.write("• 2,691 documents")
        st.write("• Older than 30 days")
        st.write("• 5-min retrieval")
        st.progress(0.7)
    
    with col3:
        st.write("**Scheduled for Deletion**")
        st.write("• 23 documents")
        st.write("• Retention expired")
        st.write("• 7-day grace period")
        st.progress(0.1)

# Settings Page
elif page == "Settings":
    st.markdown(f"# {page}")
    st.markdown("*System configuration and administrative controls*")
    st.markdown("---")
    
    st.subheader("Settings")
    
    # User preferences
    with st.expander("User Preferences"):
        st.selectbox("Default Department View", ["All", "Finance", "Operations", "Procurement", "HR"])
        st.selectbox("Notification Frequency", ["Real-time", "Hourly", "Daily", "Weekly"])
        st.checkbox("Email notifications")
        st.checkbox("Desktop notifications")
        st.checkbox("Mobile push notifications")
    
    # System configuration
    with st.expander("System Configuration"):
        st.selectbox("Auto-archive after", ["30 days", "60 days", "90 days", "1 year", "Never"])
        st.selectbox("Storage tier transition", ["Hot to Cold after 7 days", "Hot to Cold after 30 days", "Manual only"])
        st.slider("AI Classification Confidence Threshold", 0.5, 1.0, 0.8, 0.1)
        st.checkbox("Enable audit ghosting")
        st.checkbox("Require approval watermarks")
    
    # Integration settings
    with st.expander("Integrations"):
        st.text_input("JIRA API Endpoint", placeholder="https://yourcompany.atlassian.net")
        st.text_input("Email Server (SMTP)", placeholder="smtp.yourcompany.com")
        st.selectbox("Authentication Method", ["LDAP", "Active Directory", "OAuth 2.0", "SAML"])
        st.checkbox("Enable API access")
        st.text_area("Webhook URLs", placeholder="Enter webhook URLs for external integrations")
    
    # Backup and maintenance
    with st.expander("Backup & Maintenance"):
        st.selectbox("Backup Frequency", ["Daily", "Weekly", "Monthly"])
        st.selectbox("Backup Retention", ["30 days", "90 days", "1 year", "Indefinite"])
        st.progress(85)
        st.write("Storage Usage: 85% of 1TB")
        
        if st.button("Run System Diagnostics"):
            st.info("Running system diagnostics...")
            time.sleep(2)
            st.success("System diagnostics completed. All systems operational.")

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 1rem;">
    KMRL Document Intelligence Platform v1.0 | 
    Built by Code Crumbs for efficient document management
</div>
""", unsafe_allow_html=True)
