import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

class DocsController {
  public getDocs = async (req: Request, res: Response): Promise<void> => {
    try {
      // Read both documentation files
      const simpleOverviewPath = path.join(__dirname, '../../docs/SIMPLE_OVERVIEW.md');
      const architecturePath = path.join(__dirname, '../../docs/ARCHITECTURE.md');
      
      const simpleOverview = fs.readFileSync(simpleOverviewPath, 'utf8');
      const architecture = fs.readFileSync(architecturePath, 'utf8');

      // Convert markdown to HTML
      const simpleOverviewHtml = marked(simpleOverview);
      const architectureHtml = marked(architecture);

      // Create an HTML template with styling and Mermaid integration
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>API Documentation</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { 
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              margin-bottom: 20px;
            }
            .nav-pills {
              margin-bottom: 20px;
            }
            pre {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
            }
            .mermaid {
              background-color: white;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="mb-4">API Documentation</h1>
            
            <ul class="nav nav-pills mb-4" id="docTabs">
              <li class="nav-item">
                <a class="nav-link active" href="#simple">Simple Overview</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#technical">Technical Architecture</a>
              </li>
            </ul>

            <div class="tab-content">
              <div class="tab-pane active" id="simple">
                ${simpleOverviewHtml}
              </div>
              <div class="tab-pane" id="technical">
                ${architectureHtml}
              </div>
            </div>
          </div>

          <script>
            // Initialize Mermaid
            mermaid.initialize({ startOnLoad: true });

            // Tab handling
            document.querySelectorAll('#docTabs a').forEach(tab => {
              tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs and panes
                document.querySelectorAll('#docTabs a').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                e.target.classList.add('active');
                
                // Show corresponding pane
                const target = e.target.getAttribute('href').substring(1);
                document.getElementById(target).classList.add('active');
              });
            });
          </script>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error loading documentation',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export default new DocsController(); 