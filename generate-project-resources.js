const fs = require('fs');
const XLSX = require('xlsx');

// Resource allocation configuration
const RESOURCE_CONFIG = {
    MIN_PEOPLE_PER_PROJECT: 1,
    MAX_PEOPLE_PER_PROJECT: 40,
    EFFORT_MULTIPLIERS: {
        Create: 1.0,
        Update: 0.6,
        Delete: 0.3
    },
    JOB_FUNCTIONS: {
        BUSINESS: {
            RATIO: {
                MIN: 0.30,  // 30% minimum business job functions
                MAX: 0.50   // 50% maximum business job functions
            },
            FUNCTIONS: [
                "Business Analyst",
                "Product Owner",
                "Business Process Expert",
                "Compliance Officer",
                "Risk Analyst"
            ]
        },
        IT: {
            RATIO: {
                MIN: 0.50,  // 50% minimum IT job functions
                MAX: 0.70   // 70% maximum IT job functions
            },
            FUNCTIONS: [
                "Software Engineer",
                "Test Engineer",
                "Solution Architect",
                "Platform Engineer",
                "Site Reliability Engineer",
                "Security Engineer"
            ]
        }
    }
};

/**
 * Base resource allocation patterns for standard capabilities
 * Defines the default resource requirements based on:
 * - Capability type (business/IT)
 * - Action type (Create/Update/Delete)
 * Each pattern specifies:
 * - Required job functions
 * - Estimated effort range in man-days
 * - Standard tasks for the work
 */
const resourcePatterns = {
    business: {
        Create: {
            roles: [
                { function: "Business Analyst", manDays: [15, 30], tasks: [
                    "Requirements gathering and documentation",
                    "Business process mapping",
                    "Stakeholder interviews",
                    "Process optimization analysis"
                ]},
                { function: "Business Process Expert", manDays: [10, 20], tasks: [
                    "Process design review",
                    "Business rules definition",
                    "Process validation"
                ]},
                { function: "Product Owner", manDays: [5, 10], tasks: [
                    "Feature prioritization",
                    "Acceptance criteria definition",
                    "Business value validation"
                ]}
            ]
        },
        Update: {
            roles: [
                { function: "Business Analyst", manDays: [10, 20], tasks: [
                    "Impact analysis",
                    "Change requirements documentation",
                    "Process update mapping"
                ]},
                { function: "Business Process Expert", manDays: [5, 15], tasks: [
                    "Process modification review",
                    "Updated rules validation"
                ]}
            ]
        },
        Delete: {
            roles: [
                { function: "Business Analyst", manDays: [5, 10], tasks: [
                    "Decommissioning impact analysis",
                    "Transition plan documentation"
                ]},
                { function: "Business Process Expert", manDays: [3, 8], tasks: [
                    "Process dependency analysis",
                    "Decommissioning validation"
                ]}
            ]
        }
    },
    IT: {
        Create: {
            roles: [
                { function: "Software Engineer", manDays: [20, 40], tasks: [
                    "Technical design",
                    "Implementation",
                    "Unit testing",
                    "Code review"
                ]},
                { function: "Test Engineer", manDays: [10, 20], tasks: [
                    "Test planning",
                    "Test case development",
                    "Integration testing",
                    "Performance testing"
                ]},
                { function: "Solution Architect", manDays: [5, 15], tasks: [
                    "Architecture design",
                    "Technical specifications",
                    "Integration patterns definition"
                ]}
            ]
        },
        Update: {
            roles: [
                { function: "Software Engineer", manDays: [15, 30], tasks: [
                    "Code modification",
                    "Regression testing",
                    "Documentation update"
                ]},
                { function: "Test Engineer", manDays: [8, 15], tasks: [
                    "Test case updates",
                    "Integration testing",
                    "Regression test execution"
                ]}
            ]
        },
        Delete: {
            roles: [
                { function: "Software Engineer", manDays: [5, 15], tasks: [
                    "Code removal planning",
                    "Dependency cleanup",
                    "System documentation update"
                ]},
                { function: "Test Engineer", manDays: [3, 10], tasks: [
                    "Decommissioning testing",
                    "Test suite cleanup"
                ]}
            ]
        }
    }
};

/**
 * Special capability patterns for complex technical capabilities
 * These override the standard IT patterns when specific expertise is required
 * Used for capabilities that:
 * 1. Need specialized roles (e.g., Platform Engineer instead of Software Engineer)
 * 2. Require different effort estimations
 * 3. Have specific technical tasks
 * 4. Involve modern cloud-native or platform work
 */
const specialCapabilityPatterns = {
    "Container Orchestration (Kubernetes)": {
        Create: {
            roles: [
                { 
                    function: "Platform Engineer", 
                    manDays: [30, 50],  // Higher effort due to complexity
                    tasks: [
                        "Kubernetes cluster design",
                        "Infrastructure as Code implementation",
                        "CI/CD pipeline setup",
                        "Security hardening"
                    ]
                },
                { 
                    function: "Site Reliability Engineer",  // Specialized role
                    manDays: [20, 30],
                    tasks: [
                        "Monitoring setup",
                        "Alert configuration",
                        "SLO definition",
                        "Runbook creation"
                    ]
                }
            ]
        }
    },
    "Service Mesh (Istio/Linkerd)": {
        Create: {
            roles: [
                { function: "Platform Engineer", manDays: [25, 40], tasks: [
                    "Service mesh architecture design",
                    "Traffic management setup",
                    "Security policy implementation"
                ]},
                { function: "Site Reliability Engineer", manDays: [15, 25], tasks: [
                    "Observability configuration",
                    "Performance baseline definition",
                    "Troubleshooting procedures"
                ]}
            ]
        }
    },
    "AI/ML Platform": {
        Create: {
            roles: [
                {
                    function: "Data Scientist",
                    manDays: [40, 60],  // Higher effort for AI implementation
                    tasks: [
                        "ML model architecture design",
                        "Model training pipeline setup",
                        "Model validation framework",
                        "AI infrastructure configuration"
                    ]
                },
                {
                    function: "ML Engineer",
                    manDays: [30, 45],
                    tasks: [
                        "Feature engineering pipeline",
                        "Model deployment automation",
                        "Performance optimization",
                        "Model monitoring setup"
                    ]
                }
            ]
        }
    },
    "Regulatory Compliance": {
        Create: {
            roles: [
                {
                    function: "Compliance Officer",
                    manDays: [25, 40],
                    tasks: [
                        "Regulatory requirements analysis",
                        "Compliance framework design",
                        "Control documentation",
                        "Regulatory reporting setup"
                    ]
                },
                {
                    function: "Risk Analyst",
                    manDays: [15, 25],
                    tasks: [
                        "Risk assessment",
                        "Control testing design",
                        "Compliance monitoring setup"
                    ]
                }
            ]
        }
    },
    "Infrastructure Architecture": {
        Create: {
            roles: [
                {
                    function: "Infrastructure Architect",
                    manDays: [35, 55],
                    tasks: [
                        "Infrastructure blueprint design",
                        "Scalability planning",
                        "Disaster recovery design",
                        "Security architecture"
                    ]
                },
                {
                    function: "Platform Engineer",
                    manDays: [25, 40],
                    tasks: [
                        "Infrastructure as Code implementation",
                        "Automation framework setup",
                        "Performance optimization"
                    ]
                }
            ]
        }
    },
    "Data Architecture": {
        Create: {
            roles: [
                {
                    function: "Data Architect",
                    manDays: [30, 50],
                    tasks: [
                        "Data model design",
                        "Data flow architecture",
                        "Data governance framework",
                        "Master data management setup"
                    ]
                },
                {
                    function: "Data Engineer",
                    manDays: [25, 40],
                    tasks: [
                        "ETL pipeline design",
                        "Data quality framework",
                        "Data integration patterns"
                    ]
                }
            ]
        }
    },
    "Private Banking Platform": {
        Create: {
            roles: [
                {
                    function: "Business Process Expert",
                    manDays: [35, 50],
                    tasks: [
                        "Wealth management workflow design",
                        "Investment process modeling",
                        "Client onboarding framework",
                        "Regulatory compliance integration"
                    ]
                },
                {
                    function: "Financial System Architect",
                    manDays: [25, 40],
                    tasks: [
                        "Portfolio management system design",
                        "Risk management integration",
                        "Reporting framework setup"
                    ]
                }
            ]
        }
    },
    "Event Streaming Platform": {
        Create: {
            roles: [
                {
                    function: "Integration Architect",
                    manDays: [30, 45],
                    tasks: [
                        "Event streaming architecture design",
                        "Message flow patterns",
                        "Scalability planning",
                        "Event schema design"
                    ]
                },
                {
                    function: "Platform Engineer",
                    manDays: [20, 35],
                    tasks: [
                        "Kafka cluster setup",
                        "Stream processing implementation",
                        "Monitoring and alerting configuration"
                    ]
                }
            ]
        }
    },
    "Security Operations Center": {
        Create: {
            roles: [
                {
                    function: "Security Architect",
                    manDays: [40, 60],
                    tasks: [
                        "Security monitoring architecture",
                        "Incident response framework",
                        "Security tool integration",
                        "Threat detection design"
                    ]
                },
                {
                    function: "Security Engineer",
                    manDays: [30, 45],
                    tasks: [
                        "SIEM implementation",
                        "Security automation setup",
                        "Threat hunting framework"
                    ]
                }
            ]
        }
    },
    "Digital Identity Platform": {
        Create: {
            roles: [
                {
                    function: "Identity Architect",
                    manDays: [35, 50],
                    tasks: [
                        "IAM architecture design",
                        "Authentication framework",
                        "Authorization model",
                        "Identity lifecycle management"
                    ]
                },
                {
                    function: "Security Engineer",
                    manDays: [25, 40],
                    tasks: [
                        "SSO implementation",
                        "MFA setup",
                        "Directory service integration"
                    ]
                }
            ]
        }
    },
    "API Gateway Platform": {
        Create: {
            roles: [
                {
                    function: "API Architect",
                    manDays: [30, 45],
                    tasks: [
                        "API gateway architecture",
                        "API security framework",
                        "Rate limiting design",
                        "API documentation framework"
                    ]
                },
                {
                    function: "Platform Engineer",
                    manDays: [20, 35],
                    tasks: [
                        "Gateway implementation",
                        "API monitoring setup",
                        "Developer portal configuration"
                    ]
                }
            ]
        }
    }
};

// Update DEFAULT_JOB_PATTERNS to include roles structure
const DEFAULT_JOB_PATTERNS = {
    roles: [
        // Business job functions
        {
            function: "Business Analyst",
            manDays: [15, 30],
            tasks: [
                "Requirements analysis",
                "Process documentation",
                "Stakeholder management"
            ]
        },
        {
            function: "Product Owner",
            manDays: [10, 20],
            tasks: [
                "Backlog management",
                "Feature prioritization",
                "Value assessment"
            ]
        },
        {
            function: "Business Process Expert",
            manDays: [12, 25],
            tasks: [
                "Process optimization",
                "Business rules definition",
                "Process implementation"
            ]
        },
        {
            function: "Compliance Officer",
            manDays: [10, 20],
            tasks: [
                "Compliance review",
                "Regulatory assessment",
                "Control documentation"
            ]
        },
        {
            function: "Risk Analyst",
            manDays: [10, 20],
            tasks: [
                "Risk assessment",
                "Control design",
                "Risk monitoring"
            ]
        },
        
        // IT job functions
        {
            function: "Software Engineer",
            manDays: [20, 40],
            tasks: [
                "Technical implementation",
                "Code development",
                "Unit testing"
            ]
        },
        {
            function: "Test Engineer",
            manDays: [15, 30],
            tasks: [
                "Test planning",
                "Test execution",
                "Quality assurance"
            ]
        },
        {
            function: "Solution Architect",
            manDays: [15, 30],
            tasks: [
                "Architecture design",
                "Technical guidance",
                "Solution review"
            ]
        },
        {
            function: "Platform Engineer",
            manDays: [20, 35],
            tasks: [
                "Platform development",
                "Infrastructure setup",
                "Platform maintenance"
            ]
        },
        {
            function: "Site Reliability Engineer",
            manDays: [15, 30],
            tasks: [
                "Reliability monitoring",
                "Performance optimization",
                "Incident response"
            ]
        },
        {
            function: "Security Engineer",
            manDays: [15, 30],
            tasks: [
                "Security implementation",
                "Security testing",
                "Security monitoring"
            ]
        }
    ]
};

function calculateResourceDistribution(totalPeople) {
    // Calculate random business percentage within configured range
    const businessPercentage = 
        RESOURCE_CONFIG.JOB_FUNCTIONS.BUSINESS.RATIO.MIN + 
        (Math.random() * (RESOURCE_CONFIG.JOB_FUNCTIONS.BUSINESS.RATIO.MAX - 
                         RESOURCE_CONFIG.JOB_FUNCTIONS.BUSINESS.RATIO.MIN));
    
    // Calculate allocations
    const businessCount = Math.max(1, Math.floor(totalPeople * businessPercentage));
    const itCount = totalPeople - businessCount;

    return {
        business: businessCount,
        it: itCount
    };
}

function distributeJobFunctions(count, type) {
    const functions = RESOURCE_CONFIG.JOB_FUNCTIONS[type].FUNCTIONS;
    const distribution = [];
    let remaining = count;

    // Ensure at least one person for each required job function
    functions.forEach(func => {
        if (remaining > 0) {
            distribution.push({
                function: func,
                count: 1
            });
            remaining--;
        }
    });

    // Distribute remaining people randomly across functions
    while (remaining > 0) {
        const randomIndex = Math.floor(Math.random() * functions.length);
        distribution[randomIndex].count++;
        remaining--;
    }

    return distribution;
}

/**
 * Generates resource allocations for each capability in each project
 * @param {Array} projectData - Array of project data from input files
 * @returns {Array} Resource allocations with effort estimates and tasks
 */
function generateResourceAllocation(projectData) {
    const resourceAllocations = [];
    
    // Group projects by Project Name
    const projectGroups = {};
    projectData.forEach(project => {
        if (!projectGroups[project["Project Name"]]) {
            projectGroups[project["Project Name"]] = [];
        }
        projectGroups[project["Project Name"]].push(project);
    });

    // Process each project with all its capabilities
    Object.entries(projectGroups).forEach(([projectName, capabilities]) => {
        console.log(`\nProcessing project: ${projectName}`);
        console.log(`Found ${capabilities.length} capabilities to process:`);
        capabilities.forEach(cap => {
            console.log(`  - ${cap["Capability Name"]} (${cap["Action"]})`);
        });

        let totalProjectAllocations = [];

        // Process each capability
        capabilities.forEach(capability => {
            let domainType = (capability["Capability Domain"] || 'IT').toUpperCase();
            const action = capability["Action"];
            const capabilityName = capability["Capability Name"];

            // Validate capability type
            if (!['BUSINESS', 'IT'].includes(domainType)) {
                console.warn(`Invalid capability type "${domainType}" for project "${capability["Project Name"]}". Defaulting to "IT"`);
                domainType = 'IT';
            }

            // First try to find a special pattern for this capability
            let pattern;
            if (specialCapabilityPatterns[capabilityName]?.[action]) {
                console.log(`Using special pattern for capability: ${capabilityName}`);
                pattern = specialCapabilityPatterns[capabilityName][action];
            } else {
                // Fallback to standard patterns if no special pattern exists for this action
                try {
                    pattern = resourcePatterns[domainType.toLowerCase()]?.[action];
                } catch (error) {
                    console.warn(`Error accessing pattern for ${domainType} - ${action}. Using default pattern.`);
                    pattern = null;
                }
            }

            if (!pattern) {
                console.warn(`No pattern found for ${capabilityName} (${domainType}) - ${action}. Using default pattern.`);
                try {
                    // Try to get the Create pattern for the domain type
                    pattern = resourcePatterns[domainType.toLowerCase()]?.['Create'];
                } catch (error) {
                    console.warn(`Error accessing Create pattern for ${domainType}. Using default pattern.`);
                    pattern = DEFAULT_JOB_PATTERNS;
                }

                if (!pattern) {
                    console.warn(`No pattern found for ${domainType}. Using default pattern.`);
                    pattern = DEFAULT_JOB_PATTERNS;
                }

                // Adjust effort for Update/Delete actions
                if (pattern.roles) {
                    pattern = {
                        roles: pattern.roles.map(role => ({
                            ...role,
                            manDays: [
                                Math.floor(role.manDays[0] * RESOURCE_CONFIG.EFFORT_MULTIPLIERS[action]),
                                Math.floor(role.manDays[1] * RESOURCE_CONFIG.EFFORT_MULTIPLIERS[action])
                            ]
                        }))
                    };
                } else {
                    console.warn('Invalid pattern structure. Using default pattern with adjusted effort.');
                    pattern = {
                        roles: DEFAULT_JOB_PATTERNS.roles.map(role => ({
                            ...role,
                            manDays: [
                                Math.floor(role.manDays[0] * RESOURCE_CONFIG.EFFORT_MULTIPLIERS[action]),
                                Math.floor(role.manDays[1] * RESOURCE_CONFIG.EFFORT_MULTIPLIERS[action])
                            ]
                        }))
                    };
                }
            }

            // Calculate people needed for this capability
            // Adjust MAX_PEOPLE based on number of capabilities to maintain reasonable total
            const adjustedMaxPeople = Math.floor(RESOURCE_CONFIG.MAX_PEOPLE_PER_PROJECT / capabilities.length);
            const totalPeople = Math.floor(Math.random() * 
                (adjustedMaxPeople - RESOURCE_CONFIG.MIN_PEOPLE_PER_PROJECT + 1)) + 
                RESOURCE_CONFIG.MIN_PEOPLE_PER_PROJECT;

            // Calculate business/IT distribution for this capability
            const distribution = calculateResourceDistribution(totalPeople);
            
            // Distribute job functions
            const businessDistribution = distributeJobFunctions(distribution.business, 'BUSINESS');
            const itDistribution = distributeJobFunctions(distribution.it, 'IT');

            console.log(`\nCapability ${capabilityName} resource distribution:`);
            console.log('Business Functions:');
            businessDistribution.forEach(d => console.log(`  ${d.function}: ${d.count}`));
            console.log('IT Functions:');
            itDistribution.forEach(d => console.log(`  ${d.function}: ${d.count}`));

            // Generate allocations for this capability
            [...businessDistribution, ...itDistribution].forEach(allocation => {
                for (let i = 0; i < allocation.count; i++) {
                    const jobPattern = DEFAULT_JOB_PATTERNS.roles.find(r => r.function === allocation.function);
                    if (!jobPattern) {
                        console.warn(`No default pattern found for job function: ${allocation.function}`);
                        continue;
                    }

                    const [minDays, maxDays] = jobPattern.manDays;
                    const estimatedDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
                    const adjustedDays = Math.floor(estimatedDays * RESOURCE_CONFIG.EFFORT_MULTIPLIERS[action]);

                    totalProjectAllocations.push({
                        "Program Name": capability["Program Name"],
                        "Project Name": projectName,
                        "Capability Domain": domainType,
                        "Capability Name": capabilityName,
                        "Action": action,
                        "Job Function": allocation.function,
                        "Resource Type": allocation.function in RESOURCE_CONFIG.JOB_FUNCTIONS.BUSINESS.FUNCTIONS ? "BUSINESS" : "IT",
                        "Resource Number": `${allocation.function} ${i + 1}`,
                        "Estimated Man/Days": adjustedDays,
                        "Tasks": jobPattern.tasks.join("; ")
                    });
                }
            });
        });

        // Add all allocations for this project
        resourceAllocations.push(...totalProjectAllocations);

        // Log final allocation summary for this project
        const businessCount = totalProjectAllocations.filter(r => r["Resource Type"] === "BUSINESS").length;
        const itCount = totalProjectAllocations.filter(r => r["Resource Type"] === "IT").length;
        
        console.log(`\nFinal allocation for ${projectName}:`,
            `\n  Total Capabilities: ${capabilities.length}`,
            `\n  Total Resources: ${totalProjectAllocations.length}`,
            `\n  Business: ${businessCount} (${((businessCount/totalProjectAllocations.length)*100).toFixed(1)}%)`,
            `\n  IT: ${itCount} (${((itCount/totalProjectAllocations.length)*100).toFixed(1)}%)`);
    });

    return resourceAllocations;
}

/**
 * Processes input program files to extract project data
 * @param {Array} inputFiles - Array of file paths to process
 * @returns {Array} Combined project data from all input files
 */
function processInputFiles(inputFiles) {
    console.log('Processing input program files...');
    let allProjectData = [];

    inputFiles.forEach(file => {
        console.log(`Reading file: ${file}`);
        const workbook = XLSX.readFile(file);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        allProjectData = allProjectData.concat(data);
    });

    return allProjectData;
}

// Directory setup and main execution
const dataDir = './data';
const programsDir = `${dataDir}/programs`;
const resourcesDir = `${dataDir}/resources`;

// Create required directories
console.log('Checking directories...');
if (!fs.existsSync(dataDir)) {
    console.log('Creating data directory...');
    fs.mkdirSync(dataDir);
}
if (!fs.existsSync(resourcesDir)) {
    console.log('Creating resources directory...');
    fs.mkdirSync(resourcesDir);
}

// Find and validate input files
const programFiles = fs.readdirSync(programsDir)
    .filter(file => file.endsWith('.xlsx'))
    .map(file => `${programsDir}/${file}`);

if (programFiles.length === 0) {
    console.log('No program files found. Please run generate-program.js first.');
    process.exit(1);
}

console.log(`Found ${programFiles.length} program files to process`);

// Generate resource allocations
const projectData = processInputFiles(programFiles);

// Update column widths to include new Resource Type column
const COLUMN_WIDTHS = [
    { wch: 30 },  // Program Name
    { wch: 30 },  // Project Name
    { wch: 20 },  // Capability Domain
    { wch: 40 },  // Capability Name
    { wch: 15 },  // Action
    { wch: 25 },  // Job Function
    { wch: 15 },  // Resource Type
    { wch: 25 },  // Resource Number
    { wch: 20 },  // Estimated Man/Days
    { wch: 100 }  // Tasks
];

// Generate all resource allocations at once
console.log('Generating resource allocations for all projects...');
const allResourceAllocations = generateResourceAllocation(projectData);

// Group allocations by project name
const projectAllocations = {};
allResourceAllocations.forEach(allocation => {
    const projectName = allocation["Project Name"];
    if (!projectAllocations[projectName]) {
        projectAllocations[projectName] = [];
    }
    projectAllocations[projectName].push(allocation);
});

// Create one file per project with all its capabilities
Object.entries(projectAllocations).forEach(([projectName, allocations]) => {
    console.log(`\nCreating resource allocation workbook for project: ${projectName}`);
    
    // Group capabilities for logging
    const capabilities = [...new Set(allocations.map(a => `${a["Capability Name"]} (${a["Action"]})`))]
    console.log('Capabilities included:');
    capabilities.forEach(cap => console.log(`  - ${cap}`));
    
    const ws = XLSX.utils.json_to_sheet(allocations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resource Allocations");

    // Use the column widths configuration
    ws['!cols'] = COLUMN_WIDTHS;

    const sanitizedProjectName = projectName
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();

    const filename = `${resourcesDir}/project-${sanitizedProjectName}-human-resource-allocations.xlsx`;
    console.log(`Writing file: ${filename}`);
    XLSX.writeFile(wb, filename);

    // Log summary for this project
    const businessCount = allocations.filter(r => r["Resource Type"] === "BUSINESS").length;
    const itCount = allocations.filter(r => r["Resource Type"] === "IT").length;
    console.log(`Project summary:`,
        `\n  Total Capabilities: ${capabilities.length}`,
        `\n  Total Resources: ${allocations.length}`,
        `\n  Business: ${businessCount} (${((businessCount/allocations.length)*100).toFixed(1)}%)`,
        `\n  IT: ${itCount} (${((itCount/allocations.length)*100).toFixed(1)}%)`);
});

// Print overall summary
console.log('\nOverall Resource Allocation Summary:');
console.log(`Total projects processed: ${Object.keys(projectAllocations).length}`);
const totalAllocations = Object.values(projectAllocations)
    .reduce((sum, allocations) => sum + allocations.length, 0);
console.log(`Total resource allocations generated: ${totalAllocations}`);
console.log(`Average allocations per project: ${(totalAllocations / Object.keys(projectAllocations).length).toFixed(1)}`);
console.log(`\nFiles generated successfully in: ${resourcesDir}`); 