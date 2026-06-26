const rolesData = [
  { id: 1, role: 'Manager', department: 'Operations', employees: 12, viewAccess: ['Dashboard', 'Reports', 'Team'], editAccess: ['Team', 'Reports'], poc: 'Rahul Sharma', tasks: 5 },
  { id: 2, role: 'Developer', department: 'Engineering', employees: 45, viewAccess: ['Codebase', 'Tasks', 'Docs'], editAccess: ['Codebase', 'Tasks'], poc: 'Priya Patel', tasks: 18 },
  { id: 3, role: 'Designer', department: 'Creative', employees: 8, viewAccess: ['Assets', 'Projects', 'Feedback'], editAccess: ['Assets', 'Projects'], poc: 'Ankit Verma', tasks: 7 },
  { id: 4, role: 'HR Executive', department: 'Human Resources', employees: 6, viewAccess: ['Employees', 'Payroll', 'Attendance'], editAccess: ['Employees', 'Attendance'], poc: 'Sneha Reddy', tasks: 4 },
  { id: 5, role: 'Accountant', department: 'Finance', employees: 10, viewAccess: ['Invoices', 'Expenses', 'Reports'], editAccess: ['Invoices', 'Expenses'], poc: 'Vikram Singh', tasks: 9 },
  { id: 6, role: 'Sales Executive', department: 'Sales', employees: 20, viewAccess: ['Leads', 'Deals', 'Clients'], editAccess: ['Leads', 'Deals'], poc: 'Meera Joshi', tasks: 12 },
  { id: 7, role: 'Support Agent', department: 'Customer Support', employees: 15, viewAccess: ['Tickets', 'Knowledge Base'], editAccess: ['Tickets'], poc: 'Arjun Nair', tasks: 22 },
  { id: 8, role: 'Team Lead', department: 'Engineering', employees: 7, viewAccess: ['Dashboard', 'Codebase', 'Tasks', 'Team'], editAccess: ['Tasks', 'Team'], poc: 'Kavya Iyer', tasks: 10 },
]

const totalEmployees = rolesData.reduce((sum, r) => sum + r.employees, 0)

export default function Roles() {
  return (
    <div className="roles-page">
      <div className="roles-header">
        <h1>Roles</h1>
        <span className="badge">{totalEmployees} Total Employees</span>
      </div>

      <div className="roles-grid">
        {rolesData.map((r) => (
          <div key={r.id} className="role-card">
            <div className="role-card-top">
              <div className="role-icon">{r.role[0]}</div>
              <div>
                <h3>{r.role}</h3>
                <p className="dept">{r.department}</p>
              </div>
            </div>
            <div className="role-card-info">
              <div className="info-row">
                <span className="info-label">View Access</span>
                <div className="access-tags">{r.viewAccess.map((a) => <span key={a} className="tag view-tag">{a}</span>)}</div>
              </div>
              <div className="info-row">
                <span className="info-label">Edit Access</span>
                <div className="access-tags">{r.editAccess.map((a) => <span key={a} className="tag edit-tag">{a}</span>)}</div>
              </div>
              <div className="info-row">
                <span className="info-label">POC</span>
                <span className="info-value">{r.poc}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tasks</span>
                <span className="info-value tasks-count">{r.tasks}</span>
              </div>
            </div>
            <div className="role-card-bottom">
              <span className="emp-count">{r.employees}</span>
              <span className="emp-label">Employees</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
