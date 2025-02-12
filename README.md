# Enterprise Architecture Impact Analysis Tools

A suite of tools for generating and visualizing enterprise architecture dependencies, focusing on the relationships between programs, projects, capabilities, and teams.

## Overview

This toolkit helps enterprise architects and program managers:
- Generate realistic program and project data
- Map teams to capabilities
- Visualize dependencies through heatmaps
- Analyze impact flows through Sankey diagrams

## Components

1. **Program Generator** (`generate-program.js`)
   - Generates program and project data based on BIAN banking capabilities
   - Creates Excel files for each program with projects and their impacts
   - Includes cost estimations and delivery timelines

2. **Team Capability Mapper** (`generate-team-to-capabilities.js`)
   - Generates team-to-capability mappings
   - Assigns capabilities to teams based on business and IT domains
   - Creates a consolidated Excel file of all mappings

3. **Impact Visualizer** (`architecture-impact-heatmap.html`)
   - Interactive heatmap showing program/project impact on capabilities
   - Sankey diagram displaying program > project > capability > team flow
   - Time-based filtering options

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser (Chrome/Firefox recommended)
- Excel file handling capability

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install xlsx
```

### Data Generation

1. Generate program and project data:
```bash
node generate-program.js
```
This creates multiple Excel files in the `data` folder, one for each program.

2. Generate team-to-capability mappings:
```bash
node generate-team-to-capabilities.js
```
This creates `teams-to-capabilities.xlsx` in the `data` folder.

### Visualization Usage

1. Open `architecture-impact-heatmap.html` in a web browser
2. Load data files:
   - Click "Project Files" to load program Excel files
   - Click "Team Mapping File" to load teams-to-capabilities.xlsx
3. Use period filters to view specific timeframes
4. Interact with visualizations:
   - Hover over heatmap cells to see details
   - Explore Sankey diagram connections
   - Use filters to focus on specific periods

## Data Structure

### Program Excel Files
```json
{
  "Program Name": "string",
  "Project Name": "string",
  "Phase": "Initiation | Intake",
  "Capability Domain": "Business | IT",
  "Capability Name": "string",
  "Action": "Create | Update | Delete",
  "Delivery Period": "YYYY-QN",
  "Architect": "string",
  "Total Cost Estimation": "string"
}
```

### Team Mapping Excel File
```json
{
  "Team Name": "string",
  "Capability Domain": "Business | IT",
  "Capability Name": "string"
}
```

## Features

### Program Generator
- BIAN banking capabilities
- ITIL and CNCF IT capabilities
- Random project name generation
- Cost estimation generation
- Quarterly delivery periods

### Team Capability Mapper
- 30 predefined teams
- Business and IT capability domains
- One-to-many team-capability relationships

### Impact Visualizer
- Interactive heatmap
- Sankey diagram
- Period filtering
- Responsive design
- Detailed tooltips

## Development

### Project Structure
```
├── data/                           # Generated Excel files
├── architecture-impact-heatmap.html # Visualization interface
├── generate-program.js             # Program data generator
├── generate-team-to-capabilities.js # Team mapping generator
└── .gitignore                      # Git ignore rules
```

### Adding New Features

1. **New Capability Types**:
   - Add to arrays in generator files
   - Update domain logic if needed

2. **New Visualizations**:
   - Add container in HTML
   - Implement using ECharts
   - Update data processing

### Best Practices
- Keep generators and visualizations synchronized
- Maintain consistent data structures
- Add logging for debugging
- Handle errors gracefully

## Troubleshooting

### Common Issues

1. **Missing Data**
   - Ensure all Excel files are generated
   - Check file permissions
   - Verify data directory exists

2. **Visualization Problems**
   - Check browser console for errors
   - Verify file format compatibility
   - Clear browser cache

3. **Generation Issues**
   - Check Node.js version
   - Verify XLSX dependency
   - Check disk space

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues and feature requests:
1. Check existing documentation
2. Review troubleshooting guide
3. Open a GitHub issue
