# Afya Flow Admin Manual (Organization Administrator)

Welcome to the **Afya Flow Admin Console**. As the Owner Doctor / Organization Administrator, you have full administrative controls over clinical staff registrations, patient chart parameters, and billing ledger dispatches.

---

## 1. Dashboard Overview Metrics
The administrator homepage captures general hospital system health:
- **Clinical Vitals Alerts**: Flags patients whose logged metrics trigger warning levels (e.g., Blood Pressure 145/95).
- **Compliance Rates**: Tracks average water drinking compliance (e.g., 78%) and medication adherence metrics.
- **Recent Activity Ledger**: Feeds real-time Winston logs to monitor audit logs.

---

## 2. Doctor Management (Staff Onboarding)
Administrators control clinical roster additions:
1. **Onboarding a Practitioner**:
   - Navigate to the **Doctor Management** tab.
   - Click "Register New Doctor", input their email, and assign their medical specialty (e.g. Cardiology).
2. **Deactivation & Approval**:
   - If a doctor leaves the organization, toggle their status to **Inactive**. This immediately revokes their portal session credentials and blocks database reads.

---

## 3. Patient Chart Assignments
To delegate primary care responsibility:
1. Go to **Patient Records**.
2. Select the patient file.
3. Choose the target practitioner from the doctor assignment dropdown list and click **Assign**. This links their charts, isolating records permissions.

---

## 4. Billing Console & Subscriptions
Manage organization subscription limits and patient invoicing:
1. **Subscribing**: Displays active enterprise plan rates ($249.00/month) and billing dates.
2. **Grace Period Warnings**: If a renewal fails, the system enters a 7-day grace period status. Pay the subscription within 7 days to avoid locks.
3. **Dispatching Invoices**: Select "Generate Invoice", input amount, choose target patient, and dispatch via M-Pesa STK, Credit Card, or Bank transfer routing.
