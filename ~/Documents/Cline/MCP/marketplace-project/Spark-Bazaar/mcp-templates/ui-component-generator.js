#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * UI Component Generator MCP Server
 * 
 * This server provides tools for generating UI components based on natural language descriptions.
 * It supports multiple frameworks (React, Vue, Angular) and styling approaches (Tailwind, Bootstrap, Material UI).
 */
class UIComponentGeneratorServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ui-component-generator',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_component',
          description: 'Generates a UI component based on a natural language description',
          inputSchema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Natural language description of the desired component',
              },
              framework: {
                type: 'string',
                description: 'Target framework for the component',
                enum: ['react', 'vue', 'angular'],
                default: 'react'
              },
              styling: {
                type: 'string',
                description: 'Styling approach to use',
                enum: ['tailwind', 'bootstrap', 'material-ui', 'vanilla-css'],
                default: 'tailwind'
              },
              features: {
                type: 'array',
                description: 'Additional features to include',
                items: {
                  type: 'string',
                  enum: ['responsive', 'accessible', 'dark-mode', 'animations']
                },
                default: ['responsive', 'accessible']
              },
              includePreview: {
                type: 'boolean',
                description: 'Whether to include a preview image',
                default: false
              }
            },
            required: ['description'],
          },
        },
        {
          name: 'modify_component',
          description: 'Modifies an existing UI component based on a natural language description',
          inputSchema: {
            type: 'object',
            properties: {
              existingCode: {
                type: 'string',
                description: 'Existing component code to modify',
              },
              modification: {
                type: 'string',
                description: 'Natural language description of the desired modifications',
              },
              framework: {
                type: 'string',
                description: 'Framework of the existing component',
                enum: ['react', 'vue', 'angular'],
                default: 'react'
              }
            },
            required: ['existingCode', 'modification'],
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'generate_component') {
        return this.handleGenerateComponent(request.params.arguments);
      } else if (request.params.name === 'modify_component') {
        return this.handleModifyComponent(request.params.arguments);
      } else {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }
    });
  }

  async handleGenerateComponent(args) {
    try {
      // Validate required arguments
      if (!args.description || typeof args.description !== 'string') {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Missing or invalid description parameter'
        );
      }

      // Default values for optional arguments
      const framework = args.framework || 'react';
      const styling = args.styling || 'tailwind';
      const features = args.features || ['responsive', 'accessible'];
      const includePreview = args.includePreview || false;

      // In a real implementation, this would use an AI model to generate
      // the component based on the description and parameters
      
      // For this template, we'll just return mock data
      let componentCode = '';
      if (framework === 'react') {
        componentCode = this.generateReactComponent(args.description, styling, features);
      } else if (framework === 'vue') {
        componentCode = this.generateVueComponent(args.description, styling, features);
      } else if (framework === 'angular') {
        componentCode = this.generateAngularComponent(args.description, styling, features);
      }

      // Prepare response content
      const responseContent = [
        {
          type: 'text',
          text: componentCode,
        }
      ];

      // Add preview image if requested
      if (includePreview) {
        responseContent.push({
          type: 'text',
          text: 'Preview image would be included here in the actual implementation.',
        });
      }

      return {
        content: responseContent,
      };
    } catch (error) {
      console.error('Error in handleGenerateComponent:', error);
      throw error;
    }
  }

  async handleModifyComponent(args) {
    try {
      // Validate required arguments
      if (!args.existingCode || typeof args.existingCode !== 'string') {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Missing or invalid existingCode parameter'
        );
      }
      if (!args.modification || typeof args.modification !== 'string') {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Missing or invalid modification parameter'
        );
      }

      // Default value for optional argument
      const framework = args.framework || 'react';

      // In a real implementation, this would use an AI model to modify
      // the component based on the existing code and modification description
      
      // For this template, we'll just return mock data
      const modifiedCode = this.modifyComponentCode(args.existingCode, args.modification, framework);

      return {
        content: [
          {
            type: 'text',
            text: modifiedCode,
          }
        ],
      };
    } catch (error) {
      console.error('Error in handleModifyComponent:', error);
      throw error;
    }
  }

  // Mock implementations of the component generation methods
  // In a real implementation, these would use AI models to generate components

  generateReactComponent(description, styling, features) {
    // Mock implementation
    return `
// Generated React Component based on description: "${description}"
// Using ${styling} styling with features: ${features.join(', ')}
import React from 'react';

const Component = () => {
  // Component implementation would go here
  return (
    <div className="container">
      <h2>Generated Component</h2>
      <p>This would be a fully functional component in the real implementation.</p>
    </div>
  );
};

export default Component;
`;
  }

  generateVueComponent(description, styling, features) {
    // Mock implementation
    return `
<!-- Generated Vue Component based on description: "${description}" -->
<!-- Using ${styling} styling with features: ${features.join(', ')} -->
<template>
  <div class="container">
    <h2>Generated Component</h2>
    <p>This would be a fully functional component in the real implementation.</p>
  </div>
</template>

<script>
export default {
  name: 'GeneratedComponent',
  // Component implementation would go here
}
</script>
`;
  }

  generateAngularComponent(description, styling, features) {
    // Mock implementation
    return `
// Generated Angular Component based on description: "${description}"
// Using ${styling} styling with features: ${features.join(', ')}
import { Component } from '@angular/core';

@Component({
  selector: 'app-generated',
  template: \`
    <div class="container">
      <h2>Generated Component</h2>
      <p>This would be a fully functional component in the real implementation.</p>
    </div>
  \`
})
export class GeneratedComponent {
  // Component implementation would go here
}
`;
  }

  modifyComponentCode(existingCode, modification, framework) {
    // Mock implementation
    return `
// Modified component based on request: "${modification}"
// Original code length: ${existingCode.length} characters
// Framework: ${framework}

${existingCode}

// Modifications would be applied here in the real implementation
`;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('UI Component Generator MCP server running on stdio');
  }
}

// Run the server when this script is executed directly
const server = new UIComponentGeneratorServer();
server.run().catch(console.error);
