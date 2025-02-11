const fs = require('fs');
const XLSX = require('xlsx');

// Import capabilities from generate-program.js
const businessCapabilities = [
  "Account Management", "Loan Processing", "Payment Execution",
  "Customer Identity Management", "Regulatory Compliance", "Risk Management",
  "Investment Portfolio Management", "Card Authorization", "Fraud Detection",
  "Customer Onboarding", "Trade Settlement", "Wealth Management",
  "Channel Management", "Product Pricing", "Collateral Management",
  "Customer Agreement", "Document Management", "Financial Accounting",
  "Market Research", "Sales Product Matching"
];

const itCapabilities = [
  // ITIL Management Capabilities
  "Incident Management", "Change Control", "IT Asset Management",
  "Service Desk", "Problem Management", "Release Management",
  "Service Configuration Management", "IT Continuity Management",
  "Capacity & Performance Management", "Service Validation & Testing",
  "Infrastructure Management", "Application Management", "Security Management",
  "API Management", "Data Management", "Cloud Management", "DevOps Management",
  "Monitoring & Event Management", "Service Level Management", "Knowledge Management",
  
  // CNCF Runtime Capabilities
  "Container Orchestration (Kubernetes)", "Service Mesh (Istio/Linkerd)",
  "Cloud Native Storage (Rook/Longhorn)", "Observability (Prometheus/Grafana)",
  "Serverless Platform (Knative/OpenFaaS)", "API Gateway (Envoy/Contour)",
  "Cloud Native Networking (Cilium/Calico)", "Distributed Tracing (Jaeger/OpenTelemetry)",
  "Continuous Delivery (Argo/Flux)", "Security Policy Enforcement (OPA/Falco)",
  "Event Streaming (NATS/Kafka)", "Container Registry (Harbor/Dragonfly)",
  "Database Orchestration (Vitess/TiKV)", "Workload Scheduling (KubeEdge/Volcano)",
  "Package Management (Helm/Brigade)", "Cloud Native CI/CD (Tekton/Spinnaker)",
  "Secret Management (Vault/Secrets Store CSI)", "Auto-scaling (KEDA/Cluster Autoscaler)"
];

// Define 30 teams
const teams = [
  // Business Domain Teams
  "Retail Banking Team", "Corporate Banking Team", "Investment Banking Team",
  "Wealth Management Team", "Treasury Team", "Trade Finance Team",
  "Cards & Payments Team", "Lending Team", "Deposits Team",
  "Customer Service Team", "Risk Management Team", "Compliance Team",
  "Financial Control Team", "Product Development Team", "Sales Team",
  
  // Technology Teams
  "Core Banking Platform Team", "Digital Banking Team", "API Platform Team",
  "Cloud Platform Team", "Security Operations Team", "Network Operations Team",
  "Database Team", "Data Analytics Team", "Enterprise Architecture Team",
  "DevOps Team", "Quality Assurance Team", "Infrastructure Team",
  "Integration Team", "Application Support Team", "Innovation Team"
];

function generateTeamCapabilityMappings() {
  console.log('Starting team-to-capability mapping generation...');
  const mappings = [];
  const assignedCapabilities = new Set();
  
  // Create a pool of available capabilities
  const availableCapabilities = [...businessCapabilities, ...itCapabilities];
  console.log(`Total capabilities available: ${availableCapabilities.length}`);
  
  // Shuffle the capabilities array once
  for (let i = availableCapabilities.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCapabilities[i], availableCapabilities[j]] = [availableCapabilities[j], availableCapabilities[i]];
  }
  
  let capabilityIndex = 0;
  teams.forEach((team, index) => {
    // Each team gets 1-4 capabilities
    const capabilityCount = Math.floor(Math.random() * 4) + 1;
    console.log(`Assigning ${capabilityCount} capabilities to ${team}`);
    
    for (let i = 0; i < capabilityCount && capabilityIndex < availableCapabilities.length; i++) {
      const capability = availableCapabilities[capabilityIndex++];
      mappings.push({
        "Team Name": team,
        "Capability Domain": businessCapabilities.includes(capability) ? "Business" : "IT",
        "Capability Name": capability
      });
    }
  });
  
  console.log('\nMapping Summary:');
  console.log(`Total teams: ${teams.length}`);
  console.log(`Total mappings generated: ${mappings.length}`);
  console.log(`Capabilities assigned: ${capabilityIndex}`);
  
  return mappings;
}

// Generate the Excel file
const dataDir = './data';

console.log('\nStarting Excel file generation...');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir);
}

// Generate and save the mappings
console.log('Generating mappings...');
const mappings = generateTeamCapabilityMappings();

console.log('Creating Excel workbook...');
const ws = XLSX.utils.json_to_sheet(mappings);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Team Capabilities");

console.log('Writing Excel file...');
const filePath = `${dataDir}/teams-to-capabilities.xlsx`;
XLSX.writeFile(wb, filePath);

console.log(`\nSuccess! File generated at: ${filePath}`); 