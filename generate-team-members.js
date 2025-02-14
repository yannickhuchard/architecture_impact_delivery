const fs = require('fs');
const XLSX = require('xlsx');

// Import existing teams from generate-team-to-capabilities.js
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
    "Integration Team", "Application Support Team", "Innovation Team",
    "Microservice Development Team", "Low-Code No-Code Development Team",
    "Site Reliability Engineering Team", "Central Monitoring Team"
];

// Define job functions
const jobFunctions = {
    business: [
        "Business Analyst",
        "Product Owner",
        "Product Manager",
        "Business Process Expert",
        "Risk Analyst",
        "Compliance Officer",
        "Financial Analyst",
        "Investment Advisor",
        "Relationship Manager",
        "Credit Analyst",
        "Treasury Specialist",
        "Trade Finance Specialist",
        "Customer Service Representative",
        "Sales Manager",
        "Operations Manager"
    ],
    technology: [
        "Software Engineer",
        "DevOps Engineer",
        "System Administrator",
        "Database Administrator",
        "Security Engineer",
        "Network Engineer",
        "Cloud Architect",
        "Solution Architect",
        "Enterprise Architect",
        "Data Scientist",
        "Test Engineer",
        "Scrum Master",
        "Technical Lead",
        "Integration Specialist",
        "Infrastructure Engineer",
        "Site Reliability Engineer",
        "Platform Engineer",
        "Microservice Developer",
        "Low-Code Developer",
        "Monitoring Specialist"
    ]
};

// Define roles (can be multiple per person)
const roles = {
    business: [
        "Product Champion",
        "Domain Expert",
        "Process Owner",
        "Business Stakeholder",
        "Risk Controller",
        "Compliance Guardian",
        "Financial Controller",
        "Client Advisor",
        "Account Manager",
        "Portfolio Manager",
        "Treasury Dealer",
        "Trade Specialist",
        "Service Lead",
        "Sales Coach",
        "Operations Coordinator"
    ],
    technology: [
        "Tech Lead",
        "DevOps Champion",
        "System Owner",
        "Database Owner",
        "Security Officer",
        "Network Administrator",
        "Cloud Expert",
        "Architecture Owner",
        "Data Steward",
        "Quality Gate Keeper",
        "Agile Coach",
        "Technical Mentor",
        "Integration Lead",
        "Infrastructure Owner",
        "Innovation Champion",
        "SRE Champion",
        "Microservice Architect",
        "Low-Code Platform Owner",
        "Monitoring Lead",
        "Reliability Expert",
        "Platform Developer",
        "Observability Expert"
    ]
};

// List of first names and last names for generating random full names
const firstNames = [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "William",
    "Sophia", "James", "Charlotte", "Benjamin", "Mia", "Lucas", "Amelia",
    "Mason", "Harper", "Ethan", "Evelyn", "Alexander"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"
];

function generateRandomName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

function getRandomElements(array, min, max) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateTeamMembers() {
    console.log('Starting team members composition generation...');
    const teamMembers = [];
    
    teams.forEach(team => {
        // Determine if it's a business or technology team
        const teamType = team.toLowerCase().includes('team') ? 
            (team.includes('Platform') || team.includes('DevOps') || team.includes('Security') || 
             team.includes('Network') || team.includes('Database') || team.includes('Infrastructure') || 
             team.includes('Integration') || team.includes('Architecture') ? 'technology' : 'business') 
            : 'business';
        
        // Generate 5-12 team members per team
        const memberCount = Math.floor(Math.random() * 8) + 5;
        console.log(`Generating ${memberCount} members for ${team}`);
        
        // Track used names to avoid duplicates within team
        const usedNames = new Set();
        
        // Randomly select which team member will be the leader (0 to memberCount-1)
        const leaderIndex = Math.floor(Math.random() * memberCount);
        
        for (let i = 0; i < memberCount; i++) {
            let fullName;
            do {
                fullName = generateRandomName();
            } while (usedNames.has(fullName));
            usedNames.add(fullName);
            
            // Assign job function and roles based on team type
            const jobFunction = jobFunctions[teamType][Math.floor(Math.random() * jobFunctions[teamType].length)];
            const assignedRoles = getRandomElements(roles[teamType], 1, 3); // 1-3 roles per person
            
            // Add leadership role for team leader
            if (i === leaderIndex) {
                if (teamType === 'business') {
                    assignedRoles.unshift('Team Lead');
                } else {
                    assignedRoles.unshift('Technical Team Lead');
                }
            }
            
            teamMembers.push({
                "Team Name": team,
                "Full Name": fullName,
                "Job Function": jobFunction,
                "Is Team Leader": i === leaderIndex ? "True" : "False",
                "Roles": assignedRoles.join(", ")
            });
        }
    });
    
    console.log('\nTeam Members Generation Summary:');
    console.log(`Total teams processed: ${teams.length}`);
    console.log(`Total team members generated: ${teamMembers.length}`);
    
    return teamMembers;
}

// Generate the Excel file
const dataDir = './data';
const teamsDir = `${dataDir}/teams`;

// Create directories if they don't exist
console.log('Checking directories...');
if (!fs.existsSync(dataDir)) {
    console.log('Creating data directory...');
    fs.mkdirSync(dataDir);
}
if (!fs.existsSync(teamsDir)) {
    console.log('Creating teams directory...');
    fs.mkdirSync(teamsDir);
}

// Generate and save the team members data
console.log('Generating team members data...');
const teamMembers = generateTeamMembers();

console.log('Creating Excel workbook...');
const ws = XLSX.utils.json_to_sheet(teamMembers);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Team Members");

// Adjust column widths
const colWidths = [
    { wch: 30 },  // Team Name
    { wch: 25 },  // Full Name
    { wch: 25 },  // Job Function
    { wch: 15 },  // Is Team Leader
    { wch: 50 }   // Roles
];
ws['!cols'] = colWidths;

const filename = `${teamsDir}/team-members.xlsx`;
console.log(`Writing file: ${filename}`);
XLSX.writeFile(wb, filename);

console.log(`\nSuccess! File generated at: ${filename}`); 