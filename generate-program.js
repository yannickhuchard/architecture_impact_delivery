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
  console.log(`\nGenerating projects for ${programName}...`);
  const projects = [];
  const projectCount = Math.floor(Math.random() * 11) + 10;
  console.log(`Creating ${projectCount} projects...`);
  
  // Pre-calculate capabilities arrays for faster access
  const businessCapabilitiesArr = [...businessCapabilities];
  const itCapabilitiesArr = [...itCapabilities];
  let totalCapabilities = 0;
  
  for (let i = 1; i <= projectCount; i++) {
    const isBusiness = programName === "Data Program" ? 
      Math.random() > 0.3 : Math.random() > 0.4;
    
    // Generate 1 to 15 capabilities for this project
    const capabilityCount = Math.floor(Math.random() * 15) + 1;
    totalCapabilities += capabilityCount;
    
    // Create base project data
    const projectName = generateProjectName(programName, i);
    console.log(`  Project ${i}/${projectCount}: ${projectName} (${capabilityCount} capabilities)`);
    
    const baseProject = {
      "Program Name": programName,
      "Project Name": projectName,
      "Phase": Math.random() > 0.5 ? "Initiation" : "Intake",
      "Delivery Period": generateDeliveryPeriod(),
      "Architect": architects[Math.floor(Math.random() * architects.length)],
      "Total Cost Estimation": Math.random() > 0.3 ? 
        `€${Math.floor(Math.random() * 9900000 + 100000).toLocaleString('de-DE')}` : ''
    };

    // Generate multiple capabilities for the same project
    const usedCapabilities = new Set();
    for (let j = 0; j < capabilityCount; j++) {
      const isDomainBusiness = isBusiness ? Math.random() > 0.2 : Math.random() > 0.8;
      const capabilityPool = isDomainBusiness ? businessCapabilitiesArr : itCapabilitiesArr;
      
      let capability;
      let attempts = 0;
      do {
        capability = capabilityPool[Math.floor(Math.random() * capabilityPool.length)];
        attempts++;
      } while (usedCapabilities.has(capability) && attempts < 20);
      
      if (!usedCapabilities.has(capability)) {
        usedCapabilities.add(capability);
        projects.push({
          ...baseProject,
          "Capability Domain": isDomainBusiness ? "Business" : "IT",
          "Capability Name": capability,
          "Action": ["Create", "Update", "Delete"][Math.floor(Math.random() * 3)]
        });
      }
    }
  }
  
  console.log(`  Total capabilities generated: ${totalCapabilities}`);
  console.log(`  Average capabilities per project: ${(totalCapabilities/projectCount).toFixed(1)}`);
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
  const programsDir = `${dataDir}/programs`;

  // Create directories if they don't exist
  console.log('Checking directories...');
  if (!fs.existsSync(dataDir)) {
    console.log('Creating data directory...');
    fs.mkdirSync(dataDir);
  }
  if (!fs.existsSync(programsDir)) {
    console.log('Creating programs directory...');
    fs.mkdirSync(programsDir);
  }

  console.log('Starting Excel file generation...');
  console.log(`Found ${programs.length} programs to process`);

  let totalProjects = 0;
  let totalCapabilities = 0;

  programs.forEach((program, index) => {
    console.log(`\nProcessing program ${index + 1}/${programs.length}: ${program}`);
    const projects = generateProjects(program);
    totalProjects += projects.length;
    totalCapabilities += projects.reduce((acc, curr) => acc + 1, 0);
    
    console.log('Creating Excel workbook...');
    const ws = XLSX.utils.json_to_sheet(projects);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    
    const filename = `${programsDir}/${program.replace(/ /g, '_')}.xlsx`;
    console.log(`Writing file: ${filename}`);
    XLSX.writeFile(wb, filename);
  });

  console.log('\nGeneration Summary:');
  console.log('------------------');
  console.log(`Total programs processed: ${programs.length}`);
  console.log(`Total projects generated: ${totalProjects}`);
  console.log(`Total capability mappings: ${totalCapabilities}`);
  console.log(`Average projects per program: ${(totalProjects/programs.length).toFixed(1)}`);
  console.log(`Average capabilities per project: ${(totalCapabilities/totalProjects).toFixed(1)}`);
  console.log('\nAll files generated successfully in /data folder!');