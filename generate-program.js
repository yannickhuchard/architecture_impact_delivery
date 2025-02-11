const fs = require('fs');
const XLSX = require('xlsx');

// BIAN Banking Business Capabilities
const businessCapabilities = [
  "Account Management", "Loan Processing", "Payment Execution",
  "Customer Identity Management", "Regulatory Compliance", "Risk Management",
  "Investment Portfolio Management", "Card Authorization", "Fraud Detection",
  "Customer Onboarding", "Trade Settlement", "Wealth Management",
  "Channel Management", "Product Pricing", "Collateral Management",
  "Customer Agreement", "Document Management", "Financial Accounting",
  "Market Research", "Sales Product Matching"
];

// Combined IT Capabilities (ITIL + CNCF)
const itCapabilities = [
  // ITIL Management Capabilities
  "Incident Management",
  "Change Control",
  "IT Asset Management",
  "Service Desk",
  "Problem Management",
  "Release Management",
  "Service Configuration Management",
  "IT Continuity Management",
  "Capacity & Performance Management",
  "Service Validation & Testing",
  "Infrastructure Management",
  "Application Management",
  "Security Management",
  "API Management",
  "Data Management",
  "Cloud Management",
  "DevOps Management",
  "Monitoring & Event Management",
  "Service Level Management",
  "Knowledge Management",
  
  
  // CNCF Runtime Capabilities
  "Container Orchestration (Kubernetes)", 
  "Service Mesh (Istio/Linkerd)",
  "Cloud Native Storage (Rook/Longhorn)",
  "Observability (Prometheus/Grafana)",
  "Serverless Platform (Knative/OpenFaaS)",
  "API Gateway (Envoy/Contour)",
  "Cloud Native Networking (Cilium/Calico)",
  "Distributed Tracing (Jaeger/OpenTelemetry)",
  "Continuous Delivery (Argo/Flux)",
  "Security Policy Enforcement (OPA/Falco)",
  "Event Streaming (NATS/Kafka)",
  "Container Registry (Harbor/Dragonfly)",
  "Database Orchestration (Vitess/TiKV)",
  "Workload Scheduling (KubeEdge/Volcano)",
  "Package Management (Helm/Brigade)",
  "Cloud Native CI/CD (Tekton/Spinnaker)",
  "Secret Management (Vault/Secrets Store CSI)",
  "Auto-scaling (KEDA/Cluster Autoscaler)"
];

const programs = [
  "Regulatory Program", "Digital Program", "IT Core Program",
  "Innovation Program", "Credit Program", "Market Mandatory Program",
  "KYC-KYT Program", "Data Program"  // Added Data Program
];

const architects = [
  "John Doe", "Alice Smith", "Bob Wilson", 
  "Emma Davis", "Mike Brown", "Ethan Miller",
  "Sophia Clark", "Liam Johnson"  // Added 3 new architects
];

function generateProjects(programName) {
  const projects = [];
  const projectCount = Math.floor(Math.random() * 11) + 10;
  
  for (let i = 1; i <= projectCount; i++) {
    const isBusiness = programName === "Data Program" ? 
      Math.random() > 0.3 : Math.random() > 0.4;
    
    const capabilityDomain = isBusiness ? "Business" : "IT";
    const capabilityList = isBusiness ? businessCapabilities : itCapabilities;
    
    // Generate cost estimation (30% chance of being empty)
    let costEstimation = '';
    if (Math.random() > 0.3) {
      // Generate cost between 100K and 10M euros
      const cost = Math.floor(Math.random() * 9900000 + 100000);
      // Format with euro symbol and thousands separator
      costEstimation = `€${cost.toLocaleString('de-DE')}`;
    }
    
    projects.push({
      "Program Name": programName,
      "Project Name": generateProjectName(programName, i),
      "Phase": Math.random() > 0.5 ? "Initiation" : "Intake",
      "Capability Domain": capabilityDomain,
      "Capability Name": capabilityList[Math.floor(Math.random() * capabilityList.length)],
      "Action": ["Create", "Update", "Delete"][Math.floor(Math.random() * 3)],
      "Delivery Period": generateDeliveryPeriod(),
      "Architect": architects[Math.floor(Math.random() * architects.length)],
      "Total Cost Estimation": costEstimation
    });
  }
  
  return projects;
}

function generateProjectName(program, index) {
  const techTerms = {
    "IT Core Program": ["Kubernetes", "Istio", "Prometheus"],
    "Innovation Program": ["Blockchain", "AI/ML", "Quantum"],
    "Digital Program": ["Mobile", "API", "Microservices"],
    "Data Program": ["Data Lake", "Analytics", "BI",  // Added Data Program terms
                    "Machine Learning", "Data Warehouse"]
  };
  
  const actions = ["Upgrade", "Migration", "Implementation"];
  const components = ["Platform", "System", "Cluster"];
  
  const terms = techTerms[program] || [];
  const term = terms[Math.floor(Math.random() * terms.length)] || program.split(" ")[0];
  
  return `${term} ${components[Math.floor(Math.random() * components.length)]} ` +
         `${actions[Math.floor(Math.random() * actions.length)]} v${index}`;
}

function generateDeliveryPeriod() {
    const year = Math.random() > 0.5 ? 2025 : 2026;
    const quarter = `Q${Math.floor(Math.random() * 4) + 1}`;
    return `${year}-${quarter}`;
  }
  
  // Generate all files
  const dataDir = './data';

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  programs.forEach(program => {
    const ws = XLSX.utils.json_to_sheet(generateProjects(program));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, `${dataDir}/${program.replace(/ /g, '_')}.xlsx`);
  });
  
  console.log("Generated XLSX files in /data folder!");