import { v4 as uuidv4 } from 'uuid'

// Types for database entities
export interface Project {
  id: string
  title: string
  description: string
  status: "Planning" | "Active" | "On Hold" | "Completed"
  category: string
  budget: number
  duration: string
  clientId: string
  managerId: string
  createdAt: string
  updatedAt: string
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "Investigating" | "Resolved" | "Closed"
  reportedBy: string
  assignedTo?: string
  location?: string
  images?: string[]
  createdAt: string
  updatedAt: string
}

export interface Contract {
  id: string
  title: string
  clientName: string
  value: number
  status: "Draft" | "Active" | "Completed" | "Cancelled"
  startDate: string
  endDate: string
  description: string
  auditTrail: AuditEntry[]
  createdAt: string
  updatedAt: string
}

export interface AuditEntry {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
}

export interface SiteInspection {
  id: string
  siteAddress: string
  inspectionType: string
  findings: any[]
  status: "Scheduled" | "In Progress" | "Completed"
  inspectorId: string
  reportUrl?: string
  createdAt: string
  updatedAt: string
}

// In-memory database (replace with real database in production)
class InMemoryDatabase {
  private projects: Map<string, Project> = new Map()
  private incidents: Map<string, Incident> = new Map()
  private contracts: Map<string, Contract> = new Map()
  private siteInspections: Map<string, SiteInspection> = new Map()
  private auditLog: AuditEntry[] = []

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Seed some sample data
    const sampleProjects: Project[] = [
      {
        id: uuidv4(),
        title: "Industrial Site Assessment - Phase I",
        description: "Environmental site assessment for former manufacturing facility",
        status: "Active",
        category: "Environmental Assessment",
        budget: 75000,
        duration: "6 weeks",
        clientId: "client-1",
        managerId: "pm-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Remediation Planning - Downtown Site",
        description: "Soil and groundwater remediation planning for contaminated site",
        status: "Planning",
        category: "Remediation",
        budget: 120000,
        duration: "12 weeks",
        clientId: "client-2",
        managerId: "pm-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]

    const sampleIncidents: Incident[] = [
      {
        id: uuidv4(),
        title: "Asbestos Discovery",
        description: "Unexpected asbestos-containing materials found during renovation",
        severity: "High",
        status: "Investigating",
        reportedBy: "Field Technician",
        location: "Building A, Second Floor",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]

    sampleProjects.forEach(project => this.projects.set(project.id, project))
    sampleIncidents.forEach(incident => this.incidents.set(incident.id, incident))
  }

  // Projects CRUD
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.projects.set(newProject.id, newProject)
    this.addAuditEntry('PROJECT_CREATED', 'System', `Project ${newProject.title} created`)
    return newProject
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const project = this.projects.get(id)
    if (!project) return null

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.projects.set(id, updatedProject)
    this.addAuditEntry('PROJECT_UPDATED', 'System', `Project ${updatedProject.title} updated`)
    return updatedProject
  }

  // Incidents CRUD
  async getIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values())
  }

  async getIncident(id: string): Promise<Incident | null> {
    return this.incidents.get(id) || null
  }

  async createIncident(incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Promise<Incident> {
    const newIncident: Incident = {
      ...incident,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.incidents.set(newIncident.id, newIncident)
    this.addAuditEntry('INCIDENT_CREATED', 'System', `Incident ${newIncident.title} created`)
    return newIncident
  }

  async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident | null> {
    const incident = this.incidents.get(id)
    if (!incident) return null

    const updatedIncident = {
      ...incident,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.incidents.set(id, updatedIncident)
    this.addAuditEntry('INCIDENT_UPDATED', 'System', `Incident ${updatedIncident.title} updated`)
    return updatedIncident
  }

  // Contracts CRUD
  async getContracts(): Promise<Contract[]> {
    return Array.from(this.contracts.values())
  }

  async getContract(id: string): Promise<Contract | null> {
    return this.contracts.get(id) || null
  }

  async createContract(contract: Omit<Contract, 'id' | 'auditTrail' | 'createdAt' | 'updatedAt'>): Promise<Contract> {
    const newContract: Contract = {
      ...contract,
      id: uuidv4(),
      auditTrail: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.contracts.set(newContract.id, newContract)
    this.addAuditEntry('CONTRACT_CREATED', 'System', `Contract ${newContract.title} created`)
    return newContract
  }

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract | null> {
    const contract = this.contracts.get(id)
    if (!contract) return null

    const updatedContract = {
      ...contract,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.contracts.set(id, updatedContract)
    this.addAuditEntry('CONTRACT_UPDATED', 'System', `Contract ${updatedContract.title} updated`)
    return updatedContract
  }

  // Site Inspections CRUD
  async getSiteInspections(): Promise<SiteInspection[]> {
    return Array.from(this.siteInspections.values())
  }

  async createSiteInspection(inspection: Omit<SiteInspection, 'id' | 'createdAt' | 'updatedAt'>): Promise<SiteInspection> {
    const newInspection: SiteInspection = {
      ...inspection,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.siteInspections.set(newInspection.id, newInspection)
    this.addAuditEntry('INSPECTION_CREATED', 'System', `Site inspection created for ${newInspection.siteAddress}`)
    return newInspection
  }

  // Audit log
  private addAuditEntry(action: string, user: string, details: string) {
    const entry: AuditEntry = {
      id: uuidv4(),
      action,
      user,
      timestamp: new Date().toISOString(),
      details,
    }
    this.auditLog.push(entry)
  }

  async getAuditLog(): Promise<AuditEntry[]> {
    return [...this.auditLog].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }
}

// Singleton instance
export const database = new InMemoryDatabase()

// Export utility functions
export const createProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
  database.createProject(project)

export const getProjects = () => database.getProjects()

export const createIncident = (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) =>
  database.createIncident(incident)

export const getIncidents = () => database.getIncidents()

export const createContract = (contract: Omit<Contract, 'id' | 'auditTrail' | 'createdAt' | 'updatedAt'>) =>
  database.createContract(contract)

export const getContracts = () => database.getContracts()

export const getAuditLog = () => database.getAuditLog()