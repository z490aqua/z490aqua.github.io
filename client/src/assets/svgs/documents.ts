export function getDocumentSVG(documentId: string): string {
  // Base document template
  const baseDocument = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48">
      <style>
        .document-bg { fill: #F5F0DC; }
        .document-border { fill: #D9CEB6; }
        .document-text { fill: #1A2E55; }
        .document-seal { fill: #B22234; }
        .document-accent { fill: #1A2E55; }
      </style>
      <rect class="document-border" x="0" y="0" width="40" height="48" rx="2" />
      <rect class="document-bg" x="2" y="2" width="36" height="44" rx="1" />
      {{CONTENT}}
    </svg>
  `;

  // Document-specific content
  let content = '';
  switch (documentId) {
    case 'constitution':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="20" height="2" />
        <rect class="document-text" x="6" y="24" width="28" height="2" />
        <rect class="document-text" x="6" y="28" width="28" height="2" />
        <rect class="document-text" x="6" y="32" width="20" height="2" />
        <path class="document-seal" d="M20,20 m-6,0 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" />
      `;
      break;
    
    case 'federalist10':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="28" height="2" />
        <rect class="document-text" x="6" y="20" width="20" height="2" />
        <rect class="document-text" x="6" y="28" width="28" height="2" />
        <rect class="document-text" x="6" y="32" width="20" height="2" />
        <rect class="document-accent" x="10" y="36" width="20" height="6" />
        <text x="20" y="41" text-anchor="middle" font-family="Arial" font-size="6" fill="#F5F0DC">10</text>
      `;
      break;
    
    case 'federalist51':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="28" height="2" />
        <rect class="document-text" x="6" y="20" width="20" height="2" />
        <rect class="document-text" x="6" y="28" width="28" height="2" />
        <rect class="document-text" x="6" y="32" width="20" height="2" />
        <rect class="document-accent" x="10" y="36" width="20" height="6" />
        <text x="20" y="41" text-anchor="middle" font-family="Arial" font-size="6" fill="#F5F0DC">51</text>
      `;
      break;
    
    case 'brutus1':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="28" height="2" />
        <rect class="document-text" x="6" y="20" width="20" height="2" />
        <rect class="document-text" x="6" y="28" width="28" height="2" />
        <rect class="document-text" x="6" y="32" width="20" height="2" />
        <rect class="document-accent" x="10" y="36" width="20" height="6" />
        <text x="20" y="41" text-anchor="middle" font-family="Arial" font-size="6" fill="#F5F0DC">B1</text>
      `;
      break;
      
    case 'articles':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="20" height="2" />
        <rect class="document-text" x="6" y="24" width="28" height="2" />
        <rect class="document-text" x="6" y="28" width="28" height="2" />
        <rect class="document-text" x="6" y="32" width="20" height="2" />
        <path class="document-seal" d="M14,18 L26,18 L26,22 L14,22 Z" />
        <path class="document-accent" d="M14,18 L18,14 L22,14 L26,18" />
      `;
      break;
      
    case 'billrights':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="1" />
        <rect class="document-text" x="6" y="11" width="28" height="1" />
        <rect class="document-text" x="6" y="14" width="28" height="1" />
        <rect class="document-text" x="6" y="17" width="28" height="1" />
        <rect class="document-text" x="6" y="20" width="28" height="1" />
        <rect class="document-text" x="6" y="23" width="28" height="1" />
        <rect class="document-text" x="6" y="26" width="28" height="1" />
        <rect class="document-text" x="6" y="29" width="28" height="1" />
        <rect class="document-text" x="6" y="32" width="28" height="1" />
        <rect class="document-text" x="6" y="35" width="28" height="1" />
        <rect class="document-accent" x="4" y="6" width="2" height="32" />
      `;
      break;
      
    case 'birmingham':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="28" height="2" />
        <rect class="document-text" x="6" y="20" width="20" height="2" />
        <rect class="document-text" x="6" y="28" width="28" height="2" />
        <rect class="document-text" x="6" y="32" width="28" height="2" />
        <rect class="document-text" x="6" y="36" width="20" height="2" />
        <rect class="document-accent" x="4" y="4" width="32" height="1" />
        <rect class="document-accent" x="4" y="43" width="32" height="1" />
      `;
      break;
      
    case 'declaration':
      content = `
        <rect class="document-text" x="6" y="10" width="28" height="2" />
        <rect class="document-text" x="6" y="14" width="28" height="2" />
        <rect class="document-text" x="6" y="18" width="28" height="2" />
        <rect class="document-text" x="6" y="22" width="20" height="2" />
        <rect class="document-text" x="6" y="30" width="28" height="2" />
        <rect class="document-text" x="6" y="34" width="20" height="2" />
        <path class="document-seal" d="M10,38 C10,38 20,40 30,38 L30,42 C30,42 20,40 10,42 Z" />
      `;
      break;
      
    case 'federalist70':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="28" height="2" />
        <rect class="document-text" x="6" y="20" width="20" height="2" />
        <rect class="document-text" x="6" y="28" width="28" height="2" />
        <rect class="document-text" x="6" y="32" width="20" height="2" />
        <rect class="document-accent" x="10" y="36" width="20" height="6" />
        <text x="20" y="41" text-anchor="middle" font-family="Arial" font-size="6" fill="#F5F0DC">70</text>
      `;
      break;
      
    case 'tutorial':
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="28" height="2" />
        <rect class="document-text" x="6" y="24" width="28" height="2" />
        <rect class="document-text" x="6" y="28" width="20" height="2" />
        <circle class="document-accent" cx="20" cy="38" r="6" />
        <text x="20" y="40" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#F5F0DC">?</text>
      `;
      break;
      
    default:
      content = `
        <rect class="document-text" x="6" y="8" width="28" height="2" />
        <rect class="document-text" x="6" y="12" width="28" height="2" />
        <rect class="document-text" x="6" y="16" width="20" height="2" />
        <rect class="document-text" x="6" y="24" width="28" height="2" />
        <rect class="document-text" x="6" y="28" width="28" height="2" />
        <rect class="document-text" x="6" y="32" width="20" height="2" />
        <path class="document-seal" d="M20,20 m-6,0 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" />
      `;
  }

  return baseDocument.replace('{{CONTENT}}', content);
}
